import { Component, OnInit, OnDestroy } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { IFilterProduct, ProductNecessity } from 'src/app/models/server/filter-models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preview-search-section',
  templateUrl: './preview-search-section.component.html',
  styleUrls: ['./preview-search-section.component.scss']
})
export class PreviewSearchSectionComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  requiredProducts: IFilterProduct[];
  availableProducts: IFilterProduct[];
  forbiddenProducts: IFilterProduct[];

  constructor(public filterService: FiltersService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.subscription.add(this.filterService.onProductsUpdated$.subscribe(_ => {
      this.requiredProducts = this.filterService.getProductsByNecessity(ProductNecessity.Required);
      const byAvailable = this.filterService.currFilter?.byAvailableProducts;
      const notRequiredProducts =  this.filterService.getProductsByNecessity(ProductNecessity.NotRequired);
      this.availableProducts = byAvailable ? notRequiredProducts : null;
      this.forbiddenProducts = byAvailable ? null : notRequiredProducts;
    }));
  }

  get byAvailableProducts() {
    return this.filterService.currFilter?.byAvailableProducts;
  }

  get filterName(): string {
    return this.filterService.currFilter.filterTitle;
  }

  get onlyProducts(): boolean {
    return this.filterService.currFilter.onlyProducts;
  }

  set onlyProducts(value: boolean) {
    this.filterService.currFilter.onlyProducts = value;
  }

  removeTag(tag: string) {
    this.filterService.removeTag(tag);
  }

  removeProduct(productId: number) {
    this.filterService.setProductNecessity(productId, ProductNecessity.Undefined, true);
  }

  get requiredTags(): Set<string> {
    return this.filterService.requiredTags;
  }

  get forbiddenTags(): Set<string> {
    return this.filterService.forbiddenTags;
  }

  get recipeTitleLabel(): string {
    const title = this.filterService.currFilter.recipeTitle;
    return title ? `"${title}"` : '__';
  }

  get durationLabel(): string {
    const filter = this.filterService.currFilter;
    return `від  ${filter.minDuration || '__'}  до  ${filter.maxDuration || '__'} (хв)`;
  }

  get caloriesLabel(): string {
    const filter = this.filterService.currFilter;
    return `від  ${filter.minCalories || '__'}  до  ${filter.maxCalories || '__'} (кКал)`;
  }
}
