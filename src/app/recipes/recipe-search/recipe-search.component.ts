import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { IActionItem } from 'src/app/models/else/menu-item';
import { FiltersService } from 'src/app/services/filters.service';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  recipes: IRecipeGeneralModel[];

  constructor(
    private authService: AuthService,
    public filterService: FiltersService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    this.filterService.updateProducts();
  }

  onSearch() {
    this.filterService.getRecipesByCurrentFilter().pipe(take(1))
      .subscribe(
        recipes => this.recipes = recipes,
        _ => alert('Error during filtering recipes')
      );
  }
}
