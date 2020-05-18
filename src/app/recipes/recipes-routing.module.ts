
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { AuthGuard } from '../auth/auth.guard';


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
    canActivate: [ AuthGuard ],
    component: RecipeEditorComponent
  },
  {
    path: ':id/edit',
    canActivate: [ AuthGuard ],
    component: RecipeEditorComponent
  },
  {
    path: ':id/details',
    component: RecipeDetailsComponent
  },
  {
    path: 'my',
    canActivate: [ AuthGuard ],
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
