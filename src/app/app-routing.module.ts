import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RecipesModule } from './recipes/recipes.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProductsModule } from './products/products.module';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
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
  { path: '', redirectTo: 'profiles', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
