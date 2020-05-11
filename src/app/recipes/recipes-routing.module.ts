
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: RecipeSearchComponent
  },
  {
    path: 'new',
    component: NewRecipeComponent
  },
  {
    path: ':id/details',
    component: RecipeDetailsComponent
  },
  {
    path: 'my',
    component: MyRecipesComponent
  },
  // {
  //   path: 'edit',
  //   component: RecipeEditorComponent
  // },
  // {
  //   path: '',
  //   component: RecipeSearchComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
