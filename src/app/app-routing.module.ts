import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnTestComponent } from './components/own-test/own-test.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', component: OwnTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
