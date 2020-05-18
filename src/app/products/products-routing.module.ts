import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';


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
  {
    path: ':id/edit',
    canActivate: [ AdminGuard ],
    component: ProductEditorComponent
  },
  {
    path: 'new',
    canActivate: [ AdminGuard ],
    component: ProductEditorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
