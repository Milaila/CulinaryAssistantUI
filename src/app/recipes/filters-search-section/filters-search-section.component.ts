import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { IFilterGeneralModel, IFilterGeneralProduct } from 'src/app/models/server/filter-models';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-filters-search-section',
  templateUrl: './filters-search-section.component.html',
  styleUrls: ['./filters-search-section.component.scss']
})
export class FiltersSearchSectionComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter();

  filters: IFilterGeneralModel[];
  currFilterId;
  subscriptions = new Subscription();

  constructor(
    public filterService: FiltersService,
    public auth: AuthService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.filterService.updateFilters();
    this.subscriptions.add(this.filterService.onCurrFilterChanged$
      .subscribe(filter => this.currFilterId = filter.id));
    this.subscriptions.add(this.filterService.filtersChanged$.pipe(delay(200))
      .subscribe(newFilters =>
        this.filters = newFilters?.sort((x, y) => {
          if (x.isDefault === y.isDefault) {
            return x.filterTitle?.localeCompare(y.filterTitle);
          }
          return x.isDefault && !y.isDefault ? -1 : 1;
        }) || []
      )
    );
  }

  setFilter(id: number) {
    this.currFilterId = id;
    this.filterService.applyFilter(id);
  }

  saveFilter(title: string, isDefault: boolean = false) {
    if (title?.trim()) {
      this.filterService.saveCurrFilter(title, isDefault);
    }
  }

  removeFilter(filterId: number) {
    this.filterService.removeFilter(filterId);
  }

  selectFilter(filterId: number) {
    this.filterService.applyFilter(filterId);
  }
}
