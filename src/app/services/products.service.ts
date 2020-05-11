// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { ServerHttpService } from './server-http.sevice';
// import { AuthService } from './auth.service';
// import { take, filter, map } from 'rxjs/operators';
// import { IProductModel, IProduct } from '../models/server/product-model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductsService {
//   private readonly products: Map<number, BehaviorSubject<IProduct>> = new Map();

//   constructor(
//     private server: ServerHttpService,
//     private auth: AuthService
//   ) { }

//   deleteProduct(id: number) {
//     if (this.auth.isAuthorized) {
//       this.server.deleteProduct(id).pipe(take(1)).subscribe(
//         res => {
//           this.products.get(id)?.next(null);
//           console.log('Product deleted successfully');
//         },
//         error => alert('Error during deleting product')
//       );
//     }
//   }

//   getProduct(id: number): Observable<IProduct> {
//     if (!id) {
//       return of(null);
//     }
//     if (!this.products.get(id)) {
//       this.updateProductFromServer(id, null);
//     }
//     return this.products.get(id);
//   }

//   getFullProduct(id: number): Observable<IProduct> {
//     if (!id) {
//       return of(null);
//     }
//     if (!this.products.get(id)) {
//       this.updateProductFromServer(id, null);
//     }
//     return this.products.get(id);
//   }

//   updateProduct(id: number) {
//     this.updateProductFromServer(id, this.products.get(id));
//   }

//   private updateProductFromServer(id: number, productSubj: BehaviorSubject<string>) {
//     if (!productSubj) {
//       productSubj = new BehaviorSubject<string>(null);
//       this.products.set(id, productSubj);
//     }
//     this.server.getProductsWithRelations(id).pipe(
//       take(1),
//       // filter(product => !!product?.data),
//       // map(product => 'data:product/jpeg;base64,' + product.data)
//     ).subscribe(
//       newProduct => productSubj.next(newProduct),
//       _ => alert('Error during getting product')
//     );
//   }

//   clearProducts() {
//     this.products.clear();
//   }
// }
