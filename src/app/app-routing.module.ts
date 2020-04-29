import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnTestComponent } from './components/own-test/own-test.component';
import { AppComponent } from './app.component';
import { NewRecipeComponent } from './components/new-recipe/new-recipe.component';
import { UserComponent } from './components/user/user.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { LoginComponent } from './components/user/login/login.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  // { path: '', component: OwnTestComponent },
  { path: 'recipes/new', component: NewRecipeComponent },
  { path: '', redirectTo: 'user/registration', pathMatch: 'full' },
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
