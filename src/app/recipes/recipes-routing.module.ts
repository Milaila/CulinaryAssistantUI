
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailsPageComponent } from './recipe-details-page/recipe-details-page.component';
import { ProfileRecipesComponent } from './profile-recipes/profile-recipes.component';


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
    component: RecipeEditorComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: ':id/edit',
    canActivate: [ AuthGuard ],
    component: RecipeEditorComponent
  },
  {
    path: ':id/details',
    component: RecipeDetailsPageComponent
  },
  {
    path: 'my',
    canActivate: [ AuthGuard ],
    component: ProfileRecipesComponent
  },
  {
    path: 'profile/:id',
    component: ProfileRecipesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
