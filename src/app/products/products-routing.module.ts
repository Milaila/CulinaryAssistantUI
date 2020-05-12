import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list/0',
    pathMatch: 'full'
  },
  {
    path: 'list',
    redirectTo: 'list/0',
  },
  {
    path: 'list/:id',
    component: ProductListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
