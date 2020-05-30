import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { IActionItem } from 'src/app/models/else/menu-item';
import { FiltersService } from 'src/app/services/filters.service';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { take, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';
import { RecipeSort } from '../recipes-sort-type';
// import { RecipeSortType } from '../recipes-sort-type';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  // currRecipes: IRecipeGeneralModel[] = null;
  // sortType: RecipeSortType = 'TITLE_ASC';

  constructor(
    private authService: AuthService,
    public recipes: RecipesService,
    public filterService: FiltersService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    // this.currRecipes = null;
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

  // sortRecipes(sortType: RecipeSortType) {
  //   this.currRecipes = null;
  //   this.recipeStore.sortCurrentRecipes(sortType);
  //   this.currRecipes = this.recipeStore.recipes;
  //   // this.recipeStore.sortType = sortType;
  // }

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

//   searchByRecipeName(name: string) {
//     const check = new RegExp(name, 'i');
//     this.currRecipes = this.recipeStore.recipes?.filter(r => check.test(r.title));
//   }

//   private sortRecipesByName(recipes$: Observable<IRecipeGeneralModel[]>): Observable<IRecipeGeneralModel[]> {
//     return recipes$.pipe(
//       take(1),
//       map(recipes => this.recipeStore.sortRecipesByTitle(recipes))
//     );
//   }
}
