import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { IActionItem } from 'src/app/models/else/menu-item';
import { FiltersService } from 'src/app/services/filters.service';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public filterService: FiltersService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    this.filterService.updateProducts();
  }

  onSearch() {

  }
}
