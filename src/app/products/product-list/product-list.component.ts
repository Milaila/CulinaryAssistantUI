import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { IProduct, IProductModel, IProductDetails, IProductGeneralModel, IProductName, IProductView } from 'src/app/models/server/product-model';
import { take, map, tap, filter, skip, delay } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from '../product-details/product-details.component';
import { ProductsService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NotificationType, NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  areAllCategories: boolean;
  areAllSubcategories: boolean;
  categories: IProductName[];
  currProducts: IProductView[];
  displayProducts: IProductView[];
  currProduct: IProductView;
  breadCrumbs: number[] = [];
  subscriptions = new Subscription();
  productsForSearch: IProductModel[] = this.productStore.sortByNameProducts;
  openDetails = false;

  get products(): Map<number, IProductView> {
    return this.productStore.store;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private server: ServerHttpService,
    private notifications: NotificationsService,
    public dialog: MatDialog,
    private imageStore: ImagesService,
    private productStore: ProductsService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.breadCrumbs = [];
    this.subscriptions.add(this.route.params?.pipe(
      tap(_ => {
        this.openDetails = false;
        this.displayProducts = null;
        this.categories = null;
        this.currProducts = null;
        this.areAllCategories = false;
        this.areAllSubcategories = false;
      }),
      delay(50)
    ).subscribe(x => {
      if (this.productStore.isUpdated) {
        this.setRootProduct(+x.id);
        this.productsForSearch = this.productStore.sortByNameProducts;
      } else {
        this.updateProducts(+x.id);
      }
    }));
  }

  get toggleCategoriesTitle(): string {
    return this.areAllCategories ? 'Сховати додаткові категорії' : 'Показати усі категорії';
  }

  get toggleSubcategoriesTitle(): string {
    return this.areAllSubcategories ? 'Сховати додаткові продукти' : 'Показати усі продукти категорії';
  }

  toggleCategories() {
    if (this.areAllCategories) {
      this.categories = this.currProduct.categoryNames;
    }
    else {
      this.categories = null;
      this.subscriptions.add(this.server.getAllProductCategories(this.currProduct?.id)
        .subscribe(products => this.categories = products));
    }
    this.areAllCategories = !this.areAllCategories;
  }

  toggleSubcategories() {
    if (this.areAllSubcategories) {
      this.displayProducts = this.currProducts;
    }
    else {
      this.displayProducts = null;
      this.subscriptions.add(this.server.getAllProductSubcategories(this.currProduct?.id).pipe(delay(1000))
        .subscribe(products => this.displayProducts = products.map(product => ({
          ...product,
          imageSrc$: this.imageStore.getImage(product?.imageId),
          categoryNames: this.productStore.getCategoriesNames(product)
        }))));
    }
    this.areAllSubcategories = !this.areAllSubcategories;
  }

  deleteProduct(productId: number, name: string) {
    this.productStore.deleteProduct(productId, name)?.subscribe(_ => {
      this.displayProducts = null;
      this.updateProducts(this.currProduct?.id);
      this.createNotification('Продукт видалено');
    },
    error => {
      this.createNotification('Продукт не видалено', NotificationType.Error, 'Помилка під час видалення продукту');
    });
  }

  createNotification(title: string, type = NotificationType.Success, content: string = '') {
    this.notifications.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }

  navigateToProduct(productId: number, saveBreadCrumb: boolean) {
    if (productId !== this.currProduct?.id) {
      if (saveBreadCrumb) {
        this.breadCrumbs.push(this.currProduct?.id);
      }
      this.router.navigate(['products/list', productId || 0]);
    }
  }

  onSelectProduct($event: MatAutocompleteSelectedEvent) {
    this.navigateToProduct($event?.option?.value, true);
  }

  filterProductsByName(name: string) {
    this.productsForSearch = this.productStore.filterProductsByName(name);
  }

  returnBack() {
    this.navigateToProduct(this.breadCrumbs.pop(), false);
  }

  private setRootProduct(rootProduct?: number, force: boolean = false) {
    if (rootProduct === this.currProduct?.id && !force) {
      return;
    }
    if (!rootProduct) {
      this.breadCrumbs = [];
    }

    let products = this.productStore.products;
    this.currProduct = this.products.get(rootProduct);
    this.areAllCategories = false;
    this.areAllSubcategories = false;

    if (this.currProduct) {
      this.currProduct.imageSrc$ = this.imageStore.getImage(this.currProduct.imageId);
      this.categories = this.currProduct.categoryNames = this.productStore.getCategoriesNames(this.currProduct);
      products = this.currProduct?.subcategories.map(id => this.products.get(id));
      this.openDetails = !products?.length;
    }
    else {
      products = products.filter(x => !x.categories?.length);
    }
    this.displayProducts = this.currProducts = this.productStore.sortProductsByNameAndType(products)
      .map(product => ({
        ...product,
        imageSrc$: this.imageStore.getImage(product?.imageId),
        categoryNames: this.productStore.getCategoriesNames(product)
      }));
  }

  private updateProducts(productId: number) {
    this.subscriptions.add(this.productStore.updateProducts().subscribe(products => {
      if (products) {
        this.setRootProduct(productId, true);
      }
      this.productsForSearch = this.productStore.sortByNameProducts;
    }));
  }
}
