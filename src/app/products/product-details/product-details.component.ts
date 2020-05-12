import { Component, OnInit, Input, Output, OnDestroy, Inject } from '@angular/core';
import { IProductView } from 'src/app/models/server/product-model';
import { EventEmitter } from 'protractor';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { take } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsDialogComponent implements OnInit, OnDestroy {

  currProduct: IProductView;
  subscriptions = new Subscription();

  constructor(
    private server: ServerHttpService,
    private dialogRef: MatDialogRef<ProductDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    const product = data.product;
    if (product) {
      this.currProduct = product;
    }
    else {
      this.updateProduct(+data.productId);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
  }

  updateProduct(productId: number) {
    this.currProduct = null;
    const categories$ = this.server.getProductCategories(productId);
    const subcategories$ = this.server.getProductSubcategories(productId);
    const product$ = this.server.getProductWithFullDetails(productId);

    this.subscriptions.add(combineLatest([product$, categories$, subcategories$])
      .subscribe(([product, categories, subcategories]) => {
        this.currProduct = {
          ...product,
          categories: null,
          subcategories: null,
          categoryNames: categories,
          subcategoryNames: subcategories
        };
    }));
  }
}
