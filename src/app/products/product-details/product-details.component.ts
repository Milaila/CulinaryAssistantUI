import { Component, OnInit, Input, Output, OnDestroy, Inject } from '@angular/core';
import { IProductView, IProductName } from 'src/app/models/server/product-model';
import { EventEmitter } from 'protractor';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { take } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products.service';
import { threadId } from 'worker_threads';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsDialogComponent implements OnInit, OnDestroy {
  areAllCategories: boolean;
  areAllSubcategories: boolean;
  currProduct: IProductView;
  categories: IProductName[];
  subcategories: IProductName[];
  subscriptions = new Subscription();

  constructor(
    private server: ServerHttpService,
    private router: Router,
    private productService: ProductsService,
    private dialogRef: MatDialogRef<ProductDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: number | IProductView
  ) {
    this.categories = null;
    this.subcategories = null;
    if (typeof data === 'number') {
      this.updateProduct(data);
    }
    else {
      this.currProduct = data;
      this.categories = this.currProduct?.categoryNames || [];
      this.subcategories = this.currProduct?.subcategoryNames || [];
      this.areAllCategories = false;
      this.areAllSubcategories = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.router.events.subscribe(_ => {
      this.dialogRef.close();
    }));
  }

  updateProduct(productId: number) {
    this.currProduct = this.productService.getProductView(productId);
    if (this.currProduct) {
      this.categories = this.currProduct?.categoryNames || [];
      this.subcategories = this.currProduct?.subcategoryNames || [];
      this.areAllCategories = false;
      this.areAllSubcategories = false;
      return;
    }

    this.categories = null;
    this.subcategories = null;
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
        this.categories = categories || [];
        this.subcategories = subcategories || [];
        this.areAllCategories = false;
        this.areAllSubcategories = false;
    }));
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
      this.subcategories = this.currProduct.subcategoryNames;
    }
    else {
      this.subcategories = null;
      this.subscriptions.add(this.server.getAllProductSubcategories(this.currProduct?.id)
        .subscribe(products => this.subcategories = products));
    }
    this.areAllSubcategories = !this.areAllSubcategories;
  }
}
