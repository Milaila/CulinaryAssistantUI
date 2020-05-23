import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { IProduct, IProductModel, IProductDetails, IProductGeneralModel, IProductName, IProductView } from 'src/app/models/server/product-model';
import { take, map, tap, filter, skip } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from '../product-details/product-details.component';
import { ProductsService } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  // products: IProductWithImage[] = [];
  // products: Map<number, IProductView> = new Map();
  currProducts: IProductView[];
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
    this.subscriptions.add(this.route.params?.subscribe(x => {
      this.openDetails = false;
      if (this.productStore.isUpdated) {
        this.setRootProduct(+x.id);
        this.productsForSearch = this.productStore.sortByNameProducts;
      } else {
        this.updateProducts(+x.id);
      }
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

  // editProduct(productId: number) {
  //   this.router.navigate(['products', productId, 'edit']);
  // }

  deleteProduct(productId: number) {
    this.currProducts = null;
    this.productStore.deleteProduct(productId).subscribe(_ => this.updateProducts(this.currProduct?.id));
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

  private setRootProduct(rootProduct?: number, force: boolean = false) {
    if (rootProduct === this.currProduct?.id && !force) {
      return;
    }
    if (!rootProduct) {
      this.breadCrumbs = [];
    }

    let products = this.productStore.products;
    this.currProduct = this.products.get(rootProduct);

    if (this.currProduct) {
      this.currProduct.imageSrc$ = this.imageStore.getImage(this.currProduct.imageId);
      this.currProduct.categoryNames = this.productStore.getCategoriesNames(this.currProduct);
      products = this.currProduct?.subcategories.map(id => this.products.get(id));
      this.openDetails = !products?.length;
    }
    else {
      products = products.filter(x => !x.categories?.length);
    }
    this.currProducts = this.productStore.sortProductsByNameAndType(products)
      .map(product => ({
        ...product,
        imageSrc$: this.imageStore.getImage(product?.imageId),
        categoryNames: this.productStore.getCategoriesNames(product)
      }));
  }

  returnBack() {
    this.navigateToProduct(this.breadCrumbs.pop(), false);
  }
}
