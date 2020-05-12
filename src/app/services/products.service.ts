import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { ServerHttpService } from './server-http.sevice';
import { AuthService } from './auth.service';
import { take, filter, map } from 'rxjs/operators';
import { IProductModel, IProduct, IProductView } from '../models/server/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly products: Map<number, BehaviorSubject<IProduct>> = new Map();

  constructor(
    private server: ServerHttpService,
    private auth: AuthService
  ) { }

  deleteProduct(id: number) {
    if (this.auth.isAuthorized) {
      this.server.deleteProduct(id).pipe(take(1)).subscribe(
        res => {
          this.products.get(id)?.next(null);
          console.log('Product deleted successfully');
        },
        error => alert('Error during deleting product')
      );
    }
  }

  // getProductDetailsView(productId: number): Observable<IProductView> {
  //   const categories$ = this.server.getProductCategories(productId);
  //   const subcategories$ = this.server.getProductSubcategories(productId);
  //   const product$ = this.server.getProductWithFullDetails(productId);

  //   return combineLatest([product$, categories$, subcategories$]).pipe(
  //     map(([product, categories, subcategories]) => ({
  //       ...product,
  //       categoryNames: categories?.map(x => x.name),
  //       subcategoryNames: subcategories?.map(x => x.name)
  //     }))
  //   );
  // }
}
