import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Server } from 'http';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { IProductManageModel, IProduct, IProductModel, IProductView, IProductRelationModel, IProductRelationWithName, IProductGeneralModel } from 'src/app/models/server/product-model';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImagesService } from 'src/app/services/images.service';
import { NgForm, FormControl } from '@angular/forms';
import { ProductDetailsDialogComponent } from '../product-details/product-details.component';
import { take } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit, OnDestroy {
  currProduct: IProductManageModel;
  // filteredProducts: IProduct[] = [];
  products: IProduct[] = [];
  filteredProducts: IProductGeneralModel[];
  // filteredCategories$: Observable<IProduct>;
  subs = new Subscription();
  isNew = true;
  decimalPattern = '[0-9.]*';
  categories: number[] = [];
  subcategories: number[] = [];

  @ViewChild('productForm') productForm: ElementRef;
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('subcategoryInput') subcategoryInput: ElementRef<HTMLInputElement>;
  categoryCtrl = new FormControl();
  subcategoryCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  // filteredTags$: Observable<string[]>;

  constructor(
    private productService: ProductsService,
    private server: ServerHttpService,
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private imageService: ImagesService,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (!this.auth.isAuthorized) {
      this.createNotification('Нема прав доступу', NotificationType.Error, 'Необхідна авторизація');
      this.router.navigate(['404']);
    }
    this.subs.add(this.route.params.subscribe(x => this.initProduct(+x.id)));
    if (this.productService.isUpdated) {
      this.filteredProducts = this.products = this.productService.products
        .sort((x, y) => x.name > y.name ? 1 : -1);
    }
    else {
      this.subs.add(this.productService.updateProducts().subscribe(products => {
        this.filteredProducts = this.products = (products || [])
          .sort((x, y) => x.name > y.name ? 1 : -1);
        }
      ));
    }

    this.categoryCtrl.valueChanges.subscribe(values => {
      console.log(values);
      values.forEach(id => this.addCategory(id));
      // this.addCategory(values.pop());
    });

    // this.categoryCtrl.valueChanges.subscribe(x => this.addCategory(x));
  }

  getProductName(id: number): string {
    return this.productService.getProduct(id)?.name;
  }

  filterMyProducts(name: string) {
    const check = new RegExp(name, 'i');
    this.filteredProducts = this.products.filter(x => check.test(x.name));
  }

  addCategory(id: number) {
    const indexChild = this.currProduct.subcategories?.findIndex(x => x.productId === id);
    if (indexChild > 0) {
      this.currProduct.subcategories.splice(indexChild, 1);
    }
    if (this.currProduct.categories?.findIndex(x => x.productId === id) < 0) {
      return;
    }
    this.currProduct.categories?.push({ id: 0, productId: id });
  }

  addSubcategory(id: number) {
    const indexCategory = this.currProduct.categories?.findIndex(x => x.productId === id);
    if (indexCategory > 0) {
      this.currProduct.categories.splice(indexCategory, 1);
    }
    if (this.currProduct.subcategories?.findIndex(x => x.productId === id) > 0) {
      return;
    }
    this.currProduct.subcategories?.push({ id: 0, productId: id });
  }

  removeCategory(index: number) {
    // this.categoryCtrl.value
    this.currProduct.categories?.splice(index, 1);
  }

  removeSubcategory(index: number) {
    this.currProduct.subcategories?.splice(index, 1);
  }

  private initProduct(id: number) {
    if (id) {
      this.isNew = false;
      this.subs.add(this.server.getProductWithFullDetails(id).subscribe(product => {
        this.currProduct = {
          ...product,
          categories: product.categories || [],
          subcategories: product.subcategories || [],
        };
      }));
    }
    else {
      this.currProduct = {
        id: 0,
        name: '',
        categories: [],
        subcategories: []
      };
    }
  }

  removeImage() {
    this.currProduct.image = this.currProduct.imageId = null;
  }

  convertToNumber(input: any): number {
    const value = input.value;
    return +value || (value === '0' ? 0 : null);
  }

  uploadImage(event: any) {
    const file = event?.target?.files[0];
    if (this.imageService.validateImageWithNotifications(file)) {
      this.subs.add(this.imageService.transformFileToImage(file)
        .subscribe(image => this.currProduct.image = image));
    }
  }

  onCreate(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const id = 0;
    const product: IProductManageModel = {
      id,
      imageId: 0,
      name: this.currProduct.name,
      description: this.currProduct.description,
      calories: this.currProduct.calories,
      fats: this.currProduct.fats,
      carbohydrates: this.currProduct.carbohydrates,
      squirrels: this.currProduct.squirrels,
      water: this.currProduct.water,
      ash: this.currProduct.ash,
      sugar: this.currProduct.sugar,
      cellulose: this.currProduct.cellulose,
      starch: this.currProduct.starch,
      transFats: this.currProduct.transFats,
      cholesterol: this.currProduct.cholesterol,
      image: this.currProduct.image ? { ...this.currProduct.image, id } : null,
      categories: this.currProduct.categories?.map(x => ({ id, productId: x.productId })),
      subcategories: this.currProduct.subcategories?.map(x => ({ id, productId: x.productId }))
    };
    this.server.createProduct(product).pipe(take(1))
      .subscribe(
        newId => {
          this.productService.updateProduct(newId);
          this.createNotification('Продукт створено');
          this.router.navigate(['products', newId, 'edit']);
        },
        error => this.createNotification('Продукт не створено', NotificationType.Error, 'Помилка при створенні продукту')
      );
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const id = this.currProduct.id;
    this.server.editProduct(this.currProduct).pipe(take(1))
      .subscribe(
        success => {
          this.createNotification('Продукт оновлено');
          this.productService.updateProduct(id);
        },
        error => this.createNotification('Продукт не оновлен', NotificationType.Error, 'Помилка при оновленні продукту')
      );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  createNotification(title: string, type = NotificationType.Success, content: string = '') {
    this.notifications.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }

  openProduct(productId: number): void {
    const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      data: productId
    });

    this.subs.add(dialogRef.afterClosed().subscribe());
  }
}
