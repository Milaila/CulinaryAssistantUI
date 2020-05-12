import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { IProduct, IProductModel, IProductDetails, IProductGeneralModel, IProductName, IProductView } from 'src/app/models/server/product-model';
import { take, map, tap, filter } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from '../product-details/product-details.component';

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
    public dialog: MatDialog,
    private imageStore: ImagesService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    this.subscriptions.add(this.route.params.subscribe(x => {
      if (this.products?.size) {
        this.setRootProduct(+x.id);
      }
    }));
    this.server.getProductsWithRelations().pipe(
      take(1),
    ).subscribe(
      products => {
        this.breadCrumbs = [ ];
        products.forEach(product => this.products.set(product.id, product));
        this.setRootProduct(id || 0);
      },
      _ => alert('Error while getting products!')
    );
  }

  navigateToProduct(productId: number, saveBreadCrumb: boolean) {
    if (productId !== this.currProduct?.id) {
      if (saveBreadCrumb) {
        this.breadCrumbs.push(this.currProduct?.id);
      }
      this.router.navigate(['products/list', productId || 0]);
    }
  }

  private setRootProduct(rootProduct?: number) {
    if (rootProduct === this.currProduct?.id) {
      return;
    }
    if (!rootProduct) {
      this.breadCrumbs = [];
    }

    let products = [...this.products.values()];
    this.currProduct = this.products.get(rootProduct);

    if (this.currProduct) {
      this.currProduct.imageSrc$ = this.imageStore.getImage(this.currProduct.imageId);
      this.currProduct.categoryNames = this.getCategoriesNames(this.currProduct);
      products = this.currProduct?.subcategories.map(id => this.products.get(id));
    }
    else {
      products = products.filter(x => !x.categories?.length);
    }
    this.currProducts = this.sortProductsByNameAndType(products).map(product => ({
      ...product,
      imageSrc$: this.imageStore.getImage(product.imageId),
      categoryNames: this.getCategoriesNames(product)
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
    this.navigateToProduct(this.breadCrumbs.pop(), false);
  }

  private getCategoriesNames(product: IProductModel): IProductName[] {
    return product?.categories?.map(id => ({id, name: this.products.get(id)?.name}));
  }

  // openDialog(productId: number): void {
  //   const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
  //     width: '600px',
  //     data: { productId }
  //   });

  //   dialogRef.afterClosed().subscribe();
  // }
}
