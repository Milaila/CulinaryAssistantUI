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
      if (this.filterService.currFilter?.byAvailableProducts) {
        this.availableProducts = this.filterService.getProductsByNecessity(ProductNecessity.Available);
        this.forbiddenProducts = null;
      }
      else {
        this.forbiddenProducts = this.filterService.getProductsByNecessity(ProductNecessity.Forbidden);
        this.availableProducts = null;
      }
    }));
  }

  get byAvailableProducts() {
    return this.filterService.currFilter?.byAvailableProducts;
  }

  removeTag(tag: string) {
    this.filterService.removeTag(tag);
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
