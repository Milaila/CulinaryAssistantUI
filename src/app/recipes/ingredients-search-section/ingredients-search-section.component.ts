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

export interface IColumn {
  column: string;
  name: string;
}

@Component({
  selector: 'app-ingredients-search-section',
  templateUrl: './ingredients-search-section.component.html',
  styleUrls: ['./ingredients-search-section.component.scss']
})
export class IngredientsSearchSectionComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  private areColumnsChanged = false;
  productsSource: MatTableDataSource<IFilterProduct> = null;
  rootProductId: number;
  subscriptions = new Subscription();
  columnHint = 'вміст в 100 грамах продукту';
  isLoaded = false;
  defaultColumns: string[] = [ 'requiredSelect', 'notRequiredSelect', 'name', 'subcategories' ];
  selectedColumns: string[] = [ 'calories', 'fats', 'squirrels', 'carbohydrates', 'sugar' ];
  displayedColumns: string[];
  optionalColumns: IColumn[] = [
    {
      column: 'calories',
      name: 'Калорії'
    },
    {
      column: 'fats',
      name: 'Жири'
    },
    {
      column: 'squirrels',
      name: 'Білки'
    },
    {
      column: 'carbohydrates',
      name: 'Вуглеводи'
    },
    {
      column: 'sugar',
      name: 'Цукор'
    },
    {
      column: 'water',
      name: 'Вода'
    },
    {
      column: 'ash',
      name: 'Зола'
    },
    {
      column: 'cellulose',
      name: 'Клітковина'
    },
    {
      column: 'starch',
      name: 'Крохмаль'
    },
    {
      column: 'cholesterol',
      name: 'Холестерин'
    },
    {
      column: 'transfats',
      name: 'Транс жири'
    }
  ];

  constructor(
    private filterService: FiltersService,
    private productsService: ProductsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.defaultColumns.concat(this.selectedColumns);
    if (this.filterService.needUpdate) {
      this.filterService.updateProducts();
    }
    this.subscriptions.add(this.filterService.currRootProductChanged$
      .subscribe(productId => this.rootProductId = productId));
    const currProducts$ = this.filterService.currProductsChanged$.pipe(
      tap(_ => this.productsSource = null),
      delay(this.isLoaded ? 100 : 300),
      tap(products => {
        this.productsSource = new MatTableDataSource(products?.map(id => this.getProduct(id)) || []);
        this.productsSource.filterPredicate = (data: IFilterProduct, name: string) => new RegExp(name, 'i').test(data.name);
        this.isLoaded = true;
      }),
      delay(100),
      tap(_ => this.productsSource.sort = this.sort)
    );
    this.subscriptions.add(currProducts$.subscribe());
  }

  getFilteredProducts(name: string): IProductModel[] {
    return this.productsService.filterProductsByName(name);
  }

  selectColumns(cols: string[]) {
    this.selectedColumns = cols || [];
    this.areColumnsChanged = true;
  }

  updateColumns() {
    if (this.areColumnsChanged) {
      this.areColumnsChanged = false;
      this.displayedColumns = this.defaultColumns.concat(this.selectedColumns);
    }
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
