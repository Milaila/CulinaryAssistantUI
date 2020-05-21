import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest, Subject } from 'rxjs';
import { ServerHttpService } from './server-http.sevice';
import { AuthService } from './auth.service';
import { take, filter, map, catchError, tap } from 'rxjs/operators';
import { IProductModel, IProduct, IProductView, IProductName } from '../models/server/product-model';
import { ImagesService } from './images.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // private readonly products: Map<number, BehaviorSubject<IProduct>> = new Map();
  store: Map<number, IProductModel> = new Map();
  sortByNameProducts: IProductModel[] = [];
  isUpdated = false;

  constructor(
    private server: ServerHttpService,
    private imageStore: ImagesService,
    private notifications: NotificationsService,
    private auth: AuthService
  ) {
  }

  deleteProduct(id: number): Observable<any> {
    if (this.auth.isAdmin) {
      return this.server.deleteProduct(id).pipe(
        take(1),
        tap(_ => {
          this.isUpdated = false;
          this.store.delete(id);
          this.updateSortByNameProducts();
          this.createNotification('Продукт видалено');
        }),
        catchError(_ => {
          this.createNotification('Продукт не видалено', NotificationType.Error, 'Помилка під час видалення продукту');
          throw Error();
        })
      );
    }
  }

  getProduct(id: number) {
    return this.store.get(id);
  }

  private updateSortByNameProducts() {
    this.sortByNameProducts = this.products.sort((x, y) => x.name > y.name ? 1 : -1);
  }

  get products(): IProductModel[] {
    return [...this.store.values()];
  }

  get hasProducts(): boolean {
    return !!this.productsNumber;
  }

  get productsNumber(): number {
    return this.store.size;
  }

  clearProducts() {
    this.isUpdated = false;
    this.store.clear();
    this.updateSortByNameProducts();
  }

  setProduct(id: number, product: IProductModel) {
    this.store.set(id, product);
    this.updateSortByNameProducts();
  }

  hasProduct(id: number): boolean {
    return this.store.has(id);
  }

  updateProduct(id: number) {
    this.isUpdated = false;
    this.server.getProduct(id).pipe(take(1)).subscribe(product => {
      this.store.set(id, product);
      this.updateSortByNameProducts();
    });
  }

  updateProducts(): Observable<IProductModel[]> {
    this.isUpdated = false;
    const updated$ = new Subject<IProductModel[]>();
    this.server.getProductsWithRelations().pipe(take(1)).subscribe(products => {
      this.store.clear();
      this.isUpdated = true;
      products?.filter(product => !!product).forEach(product =>
        this.store.set(product?.id, product));
      this.updateSortByNameProducts();
      updated$.next(products);
    });
    return updated$;
  }

  sortProductsByNameAndType(products: IProductView[]): IProductModel[] {
    return products
      .sort((x, y) => {
        const xChildren = x.subcategories?.length ? 1 : 0;
        const yChildren = y.subcategories?.length ? 1 : 0;
        if (xChildren === yChildren) {
          return x.name > y.name ? 1 : -1;
        }
        return yChildren - xChildren;
      });
  }

  filterProductsByName(name: string): IProductModel[] {
    const check = new RegExp(name, 'i');
    return this.sortByNameProducts
      .filter(product => check.test(product.name));
  }

  getCategoriesNames(product: IProductModel): IProductName[] {
    return product?.categories?.map(id => ({id, name: this.store.get(id)?.name}));
  }

  getSubcategoriesNames(product: IProductModel): IProductName[] {
    return product?.subcategories?.map(id => ({id, name: this.store.get(id)?.name}));
  }

  getProductView(id: number): IProductView {
    const product = this.store.get(id);
    if (!this.isUpdated || !product) {
      return null;
    }
    return {
      ...product,
      imageSrc$: this.imageStore.getImage(product?.imageId),
      categoryNames: this.getCategoriesNames(product),
      subcategoryNames: this.getSubcategoriesNames(product)
    };
  }

  createNotification(title: string, type = NotificationType.Success, content: string = '') {
    this.notifications.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
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
