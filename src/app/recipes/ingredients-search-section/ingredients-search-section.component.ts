import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { BehaviorSubject, of, Observable, combineLatest, Subscription } from 'rxjs';
import { IFilterProduct, IFilterGeneralProduct, ProductNecessity } from 'src/app/models/server/filter-models';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { filter } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-ingredients-search-section',
  templateUrl: './ingredients-search-section.component.html',
  styleUrls: ['./ingredients-search-section.component.scss']
})
export class IngredientsSearchSectionComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'subcategories', 'name', 'requiredSelect', 'notRequiredSelect', 'calories',
    'fats', 'squirrels', 'carbohydrates', //'sugar',
  ];
  productsSource: MatTableDataSource<IFilterProduct> = new MatTableDataSource([]);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  products: IFilterProduct[];
  rootProductId: number;
  subscriptions = new Subscription();

  constructor(private filterService: FiltersService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.filterService.currRootProductChanged$
      .subscribe(productId => this.rootProductId = productId));
    const currProducts$ = this.filterService.currProductsChanged$.pipe(filter(p => !!p));
    this.subscriptions.add(currProducts$.subscribe(products => {
      this.productsSource = new MatTableDataSource(products?.map(id => this.getProduct(id)));
      this.productsSource.sort = this.sort;
      this.productsSource.paginator = this.paginator;
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
    console.log(name);
    this.filterService.setCurrProductsByName(name);
  }

  toggleByAvailableProducts(value: boolean) {
    if (value !== this.byAvailable) {
      this.filterService.changeByAvailableProducts(!!value);
    }
  }

  log(event, object) {
    console.log(event, object);
  }

  get byAvailable(): boolean {
    return this.filterService.currFilter.byAvailableProducts;
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
    return this.byAvailable ? 'наявність продукту' : 'заборона продукту';
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

  // getProductColor(necessity: number): string {
  //   // const necessity = this.getProduct(productId).necessity;
  //   switch (+necessity) {
  //     // case ProductNecessity.Available: color = '#ffff88'; break;
  //     // case ProductNecessity.BecomeAvailable: color = '#fafae8'; break;
  //     // case ProductNecessity.BecomeForbidden: color = '#ffcccc'; break;
  //     // case ProductNecessity.BecomeRequired: color = '#d4f8cd'; break;
  //     case ProductNecessity.NotRequired: return this.byAvailable ? '#ffff88' : '#f58585';
  //     case ProductNecessity.Required: return '#acfa9d';
  //     default: return '#ffffff';
  //   }
  // }
}

export interface ExpandedProduct extends IFilterProduct {
  isExpanded?: boolean;
}
