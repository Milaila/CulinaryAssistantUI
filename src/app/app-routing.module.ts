import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnTestComponent } from './components/own-test/own-test.component';
import { AppComponent } from './app.component';
import { NewRecipeComponent } from './recipes/new-recipe/new-recipe.component';
import { UserComponent } from './components/user/user.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { LoginComponent } from './components/user/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RecipesModule } from './recipes/recipes.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProductsModule } from './products/products.module';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  // { path: '', component: OwnTestComponent },
  {
    path: 'recipes',
    loadChildren: () => RecipesModule
  },
  {
    path: 'profiles',
    loadChildren: () => ProfilesModule
  },
  {
    path: 'products',
    loadChildren: () => ProductsModule
  },
  { path: '404', component: NotFoundComponent },
  { path: '', redirectTo: 'user/registration', pathMatch: 'full' },
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
