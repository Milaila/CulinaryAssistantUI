import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';


const routes: Routes = [
  {
    path: '',
    component: RecipeSearchComponent
  },
  {
    path: 'search',
    component: RecipeSearchComponent
  },
  {
    path: 'new',
    component: NewRecipeComponent
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
