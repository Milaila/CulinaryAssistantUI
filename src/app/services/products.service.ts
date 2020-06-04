import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest, Subject } from 'rxjs';
import { ServerHttpService } from './server-http.service';
import { AuthService } from './auth.service';
import { take, filter, map, catchError, tap, switchMap } from 'rxjs/operators';
import { IProductModel, IProduct, IProductView, IProductName } from '../models/server/product-model';
import { ImagesService } from './images.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { IConfirmData } from '../models/else/confirm-data';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  store: Map<number, IProductModel> = new Map();
  sortByNameProducts: IProductModel[] = [];
  isUpdated = false;
  updatedProducts$ = new Subject<IProductModel[]>();
  private sendForUpdate = false;

  constructor(
    private server: ServerHttpService,
    private imageStore: ImagesService,
    private dialog: MatDialog,
    private auth: AuthService
  ) {
  }

  deleteProduct(id: number, name?: string): Observable<any> {
    if (!this.auth.isAdmin) {
      return;
    }
    const data: IConfirmData = {
      question: 'Видалити продукт' + (name ? ` "${name}"?` : '?'),
      confirmation: 'Видалити',
      cancellation: 'Скасувати'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { width: '350px', data });

    return dialogRef.afterClosed().pipe(
      take(1),
      filter(res => !!res),
      switchMap(() => this.server.deleteProduct(id).pipe(
        take(1),
        tap(_ => {
          this.isUpdated = false;
          this.store.delete(id);
          this.updateSortByNameProducts();
        }),
        // catchError(_ => {
        //   this.createNotification('Продукт не видалено', NotificationType.Error, 'Помилка під час видалення продукту');
        //   throw Error();
        // })
      ))
    );
  }

  getProduct(id: number) {
    return this.store.get(id);
  }

  private updateSortByNameProducts() {
    this.sortByNameProducts = this.products.sort((x, y) => x.name?.localeCompare(y.name));
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
    if (!this.sendForUpdate) {
      this.sendForUpdate = true;
      this.server.getProductsWithRelations().pipe(take(1)).subscribe(
        products => {
          this.sendForUpdate = false;
          this.store.clear();
          this.isUpdated = true;
          products?.filter(product => !!product).forEach(product =>
            this.store.set(product?.id, product));
          this.updateSortByNameProducts();
          this.updatedProducts$.next(products);
        },
        _ => this.sendForUpdate = false
      );
    }
    return this.updatedProducts$;
  }

  sortProductsByNameAndType(products: IProductView[]): IProductModel[] {
    return products
      .sort((x, y) => {
        const xChildren = x.subcategories?.length ? 1 : 0;
        const yChildren = y.subcategories?.length ? 1 : 0;
        if (xChildren === yChildren) {
          return x.name?.localeCompare(y.name);
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
}
