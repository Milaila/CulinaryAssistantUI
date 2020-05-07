import { Component, OnInit } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { IFilterGeneralModel, IFilterGeneralProduct } from 'src/app/models/server/filter-models';

@Component({
  selector: 'app-filters-search-section',
  templateUrl: './filters-search-section.component.html',
  styleUrls: ['./filters-search-section.component.scss']
})
export class FiltersSearchSectionComponent implements OnInit {

  filters: IFilterGeneralModel[];
  constructor(public filterService: FiltersService) { }

  ngOnInit(): void {
    this.filterService.updateFilters();
    this.filterService.filtersChanged$.subscribe(f => this.filters = f);
  }

  setFilter(id: number) {
    console.log('Set filter ' + id);
    this.filterService.displayFilter(id);
  }
}
