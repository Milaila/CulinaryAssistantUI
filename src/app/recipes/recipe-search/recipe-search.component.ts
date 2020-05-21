import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { IActionItem } from 'src/app/models/else/menu-item';
import { FiltersService } from 'src/app/services/filters.service';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { take, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  currRecipes: IRecipeGeneralModel[] = null;
  // resultRecipes: IRecipeGeneralModel[] = null;

  constructor(
    private authService: AuthService,
    private recipeStore: RecipesService,
    public filterService: FiltersService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    if (this.filterService.needUpdate) {
      this.filterService.updateProducts();
    }

    this.displayAllRecipes();
  }

  displayAllRecipes() {
    this.currRecipes = null;
    if (this.recipeStore.isUpdated) {
      this.currRecipes = this.recipeStore.recipes;
      return;
    }
    // this.sortRecipesByName(
    this.serverService.getRecipes().subscribe(
      recipes => this.recipeStore.recipes = this.currRecipes = recipes
      // _ => alert('Error during getting recipes')
    );
  }

  onSearch() {
    this.currRecipes = this.recipeStore.recipes = null;
    // this.sortRecipesByName(
    this.filterService.getRecipesByCurrentFilter()
      .subscribe (
        recipes => this.currRecipes = this.recipeStore.recipes = recipes,
        // _ => alert('Error during filtering recipes')
      );
  }

  onSearchByFilter(filterId: number) {
    this.currRecipes = this.recipeStore.recipes = null;
    this.sortRecipesByName(this.filterService.getRecipesByFilter(+filterId))
      .subscribe(
        recipes => this.currRecipes = this.recipeStore.recipes = recipes || [],
        // _ => alert('Error during filtering recipes by filter id')
      );
  }

  resetFilter() {
    this.filterService.resetCurrentFilter();
  }

  searchByRecipeName(name: string) {
    const check = new RegExp(name, 'i');
    this.currRecipes = this.recipeStore.recipes?.filter(r => check.test(r.title));
  }

  private sortRecipesByName(recipes$: Observable<IRecipeGeneralModel[]>): Observable<IRecipeGeneralModel[]> {
    return recipes$.pipe(
      take(1),
      map(recipes => recipes?.sort((x, y) => {
        if (!x.title) {
          return 1;
        }
        return x.title > y.title ? 1 : -1;
      }))
    );
  }
}
