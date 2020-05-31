import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { BehaviorSubject, of, Observable, combineLatest, Subscription } from 'rxjs';
import { IFilterProduct, IFilterGeneralProduct, ProductNecessity } from 'src/app/models/server/filter-models';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { filter, delay, tap } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from 'src/app/products/product-details/product-details.component';
import { ProductsService } from 'src/app/services/products.service';
import { IProductModel } from 'src/app/models/server/product-model';

@Component({
  selector: 'app-ingredients-search-section',
  templateUrl: './ingredients-search-section.component.html',
  styleUrls: ['./ingredients-search-section.component.scss']
})
export class IngredientsSearchSectionComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'subcategories', 'name', 'requiredSelect', 'notRequiredSelect', 'calories',
    'fats', 'squirrels', 'carbohydrates', 'sugar',
  ];
  productsSource: MatTableDataSource<IFilterProduct> = null;

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  rootProductId: number;
  subscriptions = new Subscription();
  columnHint = 'вміст в 100 грамах продукту';
  isLoaded = false;

  getFilteredProducts(name: string): IProductModel[] {
    return this.productsService.filterProductsByName(name);
  }

  constructor(
    private filterService: FiltersService,
    private productsService: ProductsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.filterService.needUpdate) {
      this.filterService.updateProducts();
    }
    this.subscriptions.add(this.filterService.currRootProductChanged$
      .subscribe(productId => this.rootProductId = productId));
    const currProducts$ = this.filterService.currProductsChanged$.pipe(
      tap(_ => this.productsSource = null),
      delay(this.isLoaded ? 100 : 300),
    );
    this.subscriptions.add(currProducts$.subscribe(products => {
      this.productsSource = new MatTableDataSource(products?.map(id => this.getProduct(id)) || []);
      this.productsSource.sort = this.sort;
      this.productsSource.filterPredicate = (data: IFilterProduct, name: string) => new RegExp(name, 'i').test(data.name);
      // this.productsSource.paginator = this.paginator;
      this.isLoaded = true;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get areAllProducts(): boolean {
    return !(this.rootProductId >= 0);
  }

  changeRootProduct(id: number) {
    this.filterService.setRootProduct(id);
  }

  goBack() {
    this.filterService.returnBack();
  }

  getProduct(id: number): ExpandedProduct {
    return this.filterService.getProduct(id);
  }

  searchByName(name: string) {
    this.productsSource.filter = name?.toLocaleLowerCase();
  }

  searchAllByName(name: string) {
    this.filterService.setCurrProductsByName(name);
  }

  toggleByAvailableProducts(value: boolean) {
    if (value !== this.byAvailable) {
      this.filterService.changeByAvailableProducts(!!value);
    }
  }

  toggleByExactProducts(value: boolean) {
    if (value !== this.byExactProducts) {
      this.filterService.currFilter.onlyProducts = value;
    }
  }

  log(event, object) {
    console.log(event, object);
  }

  get byAvailable(): boolean {
    return this.filterService.currFilter.byAvailableProducts;
  }

  get byExactProducts(): boolean {
    return this.filterService.currFilter.onlyProducts;
  }

  isNotRequired(product: IFilterProduct): boolean {
    return this.filterService.isProductSelected(product.id, ProductNecessity.NotRequired);
  }

  isRequired(product: IFilterProduct): boolean {
    return this.filterService.isProductSelected(product.id, ProductNecessity.Required);
  }

  get isAllRequired(): boolean {
    return this.filterService.areAllCurrentProductsSelected(ProductNecessity.Required);
  }

  get isAllNotRequired(): boolean {
    return this.filterService.areAllCurrentProductsSelected(ProductNecessity.NotRequired);
  }

  get areAnyRequired(): boolean {
    return this.filterService.areNotAllCurrentProductsSelected(ProductNecessity.Required);
  }

  get areAnyNotRequired(): boolean {
    return this.filterService.areNotAllCurrentProductsSelected(ProductNecessity.NotRequired);
  }

  onGroupRequiredChecked(event: MatCheckboxChange) {
    this.toggleAllProducts(event?.checked, ProductNecessity.Required);
  }

  onGroupNotRequiredChecked(event: MatCheckboxChange) {
    this.toggleAllProducts(event?.checked, ProductNecessity.NotRequired);
  }

  onRequiredChecked(event: MatCheckboxChange, product: IFilterProduct) {
    this.filterService.setProductNecessity(product.id, event?.checked
      ? ProductNecessity.Required : ProductNecessity.Undefined);
  }

  onNotRequiredChecked(event: MatCheckboxChange, product: IFilterProduct) {
    this.filterService.setProductNecessity(product.id, event?.checked
      ? ProductNecessity.NotRequired : ProductNecessity.Undefined);
  }

  private toggleAllProducts(checked: boolean, necessity: ProductNecessity) {
    if (checked) {
      this.filterService.selectAllCurrentProducts(necessity);
    }
    else {
      this.filterService.unselectAllCurrentProductsByNecessity(necessity);
    }
  }

  get notRequiredHint(): string {
    return this.byAvailable ? 'опціональні продукти' : 'заборонені продукти';
  }

  get notRequireProductHint(): string {
    return this.byAvailable ? 'опціональний продукт' : 'заборонений продукт';
  }

  changeProductStatus(productId: number) {
    this.filterService.selectProduct(productId);
  }

  statusLabel(necessity: ProductNecessity): string {
    switch (necessity) {
      case ProductNecessity.Required: return 'обов\'язковий';
      case ProductNecessity.NotRequired:
        return this.byAvailable ? 'опціональний' : 'заборонений';
      default: return 'невизначений';
    }
  }

  statusColor(necessity: ProductNecessity): string {
    switch (necessity) {
      case ProductNecessity.Required: return '#aefda9';
      case ProductNecessity.NotRequired:
        return this.byAvailable ? '#fdfaa9' : '#ffafaf';
      default: return '#e2e2e2';
    }
  }

  openProductDialog(productId: number): void {
    this.dialog.open(ProductDetailsDialogComponent, {
      width: '500px',
      data: this.filterService.getProductViewDetails(productId)
    }).afterClosed().subscribe();
  }
}

export interface ExpandedProduct extends IFilterProduct {
  isExpanded?: boolean;
}
