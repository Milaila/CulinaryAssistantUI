import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnTestComponent } from './components/own-test/own-test.component';
import { AppComponent } from './app.component';
import { NewRecipeComponent } from './components/new-recipe/new-recipe.component';


const routes: Routes = [
  { path: '', component: OwnTestComponent },
  { path: 'recipes/new', component: NewRecipeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
