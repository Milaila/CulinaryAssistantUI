import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { IActionItem } from 'src/app/models/else/menu-item';
import { FiltersService } from 'src/app/services/filters.service';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { take, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';
import { RecipeSort } from '../recipes-sort.enum';
import { ISortOption } from 'src/app/models/else/sort-option';
import { RECIPE_SORT_OPTIONS } from '../recipes-sort-options';
// import { RecipeSortType } from '../recipes-sort-type';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  sortOptions = RECIPE_SORT_OPTIONS;

  constructor(
    private authService: AuthService,
    public recipes: RecipesService,
    public filterService: FiltersService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    if (!this.recipes.isUpdated) {
      this.displayAllRecipes();
    }
  }

  displayAllRecipes() {
    this.serverService.getRecipes().pipe(take(1)).subscribe(
      recipes => {
        this.recipes.setRecipes(recipes);
      }
    );
  }

  get currentRecipes(): IRecipeGeneralModel[] {
    return this.recipes.currRecipes;
  }

  setSortType(sortType: RecipeSort) {
    this.recipes.sortType = sortType;
  }

  onSearch() {
    this.recipes.clearRecipes();
    this.filterService.getRecipesByCurrentFilter()
      .subscribe (
        recipes => {
          this.recipes.setRecipes(recipes);
        }
      );
  }

  onSearchByFilter(filterId: number) {
    this.recipes.clearRecipes();
    this.filterService.getRecipesByFilter(+filterId).pipe(take(1))
      .subscribe(
        recipes => {
          this.recipes.setRecipes(recipes);
        }
      );
  }

  resetFilter() {
    this.filterService.resetCurrentFilter();
  }
}
