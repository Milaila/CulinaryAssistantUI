import { Component, OnInit } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IProductModel } from 'src/app/models/server/product-model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { IFilterProduct, IFilterGeneralProduct, ProductNecessity } from 'src/app/models/server/filter-models';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-ingredients-search-section',
  templateUrl: './ingredients-search-section.component.html',
  styleUrls: ['./ingredients-search-section.component.scss']
})
export class IngredientsSearchSectionComponent implements OnInit {

  // isExpanded = false;
  // icons: {
  //   start: string;
  //   end: string;
  // }[] = [
  //   { start: 'done', end: 'done_all'},
  //   { start: 'select_all', end: 'crop_square'},
  //   { start: 'expand_more', end: 'chevron_right'},
  //   { start: 'select_all', end: 'crop_din'},
  //   { start: 'clear', end: 'done'},
  //   { start: 'add', end: 'add_circle'},
  //   { start: 'remove_circle', end: 'add_circle'},
  //   { start: 'indeterminate_check_box', end: 'check_box_outline_blank'},
  //   { start: 'check_box', end: 'indeterminate_check_box'},
  //   { start: 'check_box_outline_blank', end: 'check_box'},
  //   { start: 'check_box', end: 'done'},
  //   { start: 'check_box', end: 'done_all'},
  //   { start: 'check_box', end: 'done_all'},
  //   { start: 'close', end: 'cancel'},
  // ];
  products: IFilterProduct[];
  currProducts$: Observable<number[]>;
  rootProduct$: Observable<number>;

  constructor(private filterService: FiltersService) { }

  ngOnInit(): void {
    this.currProducts$ = this.filterService.currProductsChanged$;
    this.rootProduct$ = this.filterService.currRootProductChanged$;
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

  onChangeNecessity(productId: number, mrChange: MatRadioChange) {
    this.filterService.selectProduct(productId, mrChange?.value);
  }

  log(event, object) {
    console.log(event, object);
  }

  get byAvailable(): boolean {
    return this.filterService.currFilter.byAvailableProducts;
  }

  getProductColor(necessity: number): string {
    // console.log(necessity);
    // const necessity = this.getProduct(productId).necessity;
    let color;
    switch (+necessity){
      case ProductNecessity.Available: color = '#ffff88'; break;
      case ProductNecessity.BecomeAvailable: color = '#fafae8'; break;
      case ProductNecessity.BecomeForbidden: color = '#ffcccc'; break;
      case ProductNecessity.BecomeRequired: color = '#d4f8cd'; break;
      case ProductNecessity.Forbidden: color = '#f58585'; break;
      case ProductNecessity.Required: color = '#acfa9d'; break;
      default: color = '#ffffff';
    }
    // console.log(color);
    return color;
  }
}

export interface ExpandedProduct extends IFilterProduct {
  isExpanded?: boolean;
}
