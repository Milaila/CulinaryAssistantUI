import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { IProduct, IProductModel, IProductDetails, IProductGeneralModel } from 'src/app/models/server/product-model';
import { take, map, tap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  // products: IProductWithImage[] = [];
  products: Map<number, IProductView> = new Map();
  currProducts: IProductView[];
  currProduct: IProductView;
  breadCrumbs: number[] = [];
  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private server: ServerHttpService,
    private imageStore: ImagesService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    this.subscriptions.add(this.route.params.subscribe(x => {
      console.log(x, x.id, this.products?.size);
      if (this.products?.size) {
        this.setRootProduct(+x.id);
      }
    }));
    this.server.getProductsWithRelations().pipe(
      take(1),
    ).subscribe(
      products => {
        products.forEach(product => this.products.set(product.id, product));
        this.setRootProduct(id || 0, false);
      },
      _ => alert('Error while getting products!')
    );
  }

  navigateToProduct(productId: number) {
    if (productId !== this.currProduct?.id) {
      this.router.navigate(['products/list', productId || 0]);
    }
  }

  private setRootProduct(rootProduct?: number, saveBreadCrumb = true) {
    if (rootProduct === this.currProduct?.id) {
      return;
    }
    if (saveBreadCrumb) {
      this.breadCrumbs.push(this.currProduct?.id);
    }
    if (!rootProduct) {
      this.breadCrumbs = [];
    }

    let products = [...this.products.values()];
    this.currProduct = this.products.get(rootProduct);

    if (this.currProduct) {
      products = this.currProduct?.subcategories.map(id => this.products.get(id));
    }
    else {
      products = products.filter(x => !x.categories?.length);
    }
    this.currProducts = this.sortProductsByNameAndType(products).map(product => ({
      ...product,
      imageSrc$: this.imageStore.getImage(product.imageId),
      categories$: this.getCategoriesNames(product)
    }));
  }

  private sortProductsByNameAndType(products: IProductView[]): IProductView[] {
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

  returnBack() {
    this.navigateToProduct(this.breadCrumbs.pop());
  }

  getProductDetails(id: number): Observable<IProductDetails> {
    return this.server.getProductWithFullDetails(id);
  }

  private getCategoriesNames(product: IProductModel): Observable<IProductName[]> {
    return of(product?.categories).pipe(
      map(products => products?.map(id => ({id, name: this.products.get(id)?.name}))),
    );
  }
}

// export interface IProductView extends IProductGeneralModel, IProductDetails {
//   categories: IProductGeneralModel[];
//   subcategories: IProductGeneralModel[];
// }

export interface IProductName {
  id: number;
  name: string;
}

export interface IProductView extends IProductModel {
  imageSrc$?: Observable<string>;
  categories$?: Observable<IProductName[]>;
}
