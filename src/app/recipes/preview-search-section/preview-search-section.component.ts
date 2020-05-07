import { Component, OnInit } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-preview-search-section',
  templateUrl: './preview-search-section.component.html',
  styleUrls: ['./preview-search-section.component.scss']
})
export class PreviewSearchSectionComponent implements OnInit {


  constructor(public filterService: FiltersService) { }

  ngOnInit(): void {
  }

  get byAvailableProducts() {
  }

}
