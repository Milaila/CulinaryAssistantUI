import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { IFilterModel, IFilter, IFilterIngredientModel, IFilterTagModel, IFilterGeneralModel, IFilterProduct, ProductNecessity, IFilterGeneralProduct } from '../models/server/filter-models';
import { AuthService } from './auth.service';
import { ServerHttpService } from './server-http.sevice';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { take, catchError, map } from 'rxjs/operators';
import { IProductGeneralModel, IProductModel } from '../models/server/product-model';
import { isNumber } from 'util';
import { MatRadioChange } from '@angular/material/radio';
import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters: Map<number, IFilter> = new Map();
  private products: Map<number, IFilterProduct> = new Map();
  private currRootProductFull: IProductModel;
  private currRootProductId: number;
  private breadCrumbs: number[] = [];

  filtersChanged$: BehaviorSubject<IFilterGeneralModel[]> = new BehaviorSubject<IFilterGeneralModel[]>(null);
  // productsChanged: BehaviorSubject<IFilterGeneralProduct[]> = new BehaviorSubject<IFilterGeneralProduct[]>(null);
  // filtersChanged$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  currProductsChanged$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  onProductsUpdated$: Subject<any> = new Subject();
  currRootProductChanged$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  currFilter: IFilterModel = {
    filterTitle: '',
    isDefault: false,
    id: 0
  };

  get hasBreadCrumbs(): boolean {
    return !!this.breadCrumbs?.length;
  }

  constructor(
    private auth: AuthService,
    private server: ServerHttpService,
  ) { }

  updateProducts() {
    this.server.getProductsWithRelations().pipe(
      take(1),
    ).subscribe(
      products => {
        this.products = new Map();
        const necessity = ProductNecessity.Undefined;
        products.forEach(product => this.products.set(product.id, {...product, necessity}));
        this.setRootProduct(null, false);
        this.onProductsUpdated$.next(true);
      },
      _ => alert('Error while getting products!')
    );
  }

  private setCurrProductsByRoot(rootProduct?: number) {
    const products = [...this.products.values()];
    const currProducts = rootProduct
      ? products.filter(x => x?.categories?.includes(rootProduct))
      : products.filter(x => !x.categories?.length);
    this.currProductsChanged$.next(this.sortProductsByNameAndType(currProducts));
  }

  setCurrProductsByName(namePart: string) {
    this.breadCrumbs = [];
    this.currRootProductId = null;
    this.currRootProductChanged$.next(null);
    let products = [...this.products.values()];
    if (namePart) {
      const check = new RegExp(namePart, 'i');
      products = products.filter(x => check.test(x.name));
    }
    this.currProductsChanged$.next(this.sortProductsByNameAndType(products));
  }

  private sortProductsByNameAndType(products: IFilterProduct[]) {
    return products
      .sort((x, y) => {
        const xChildren = x.subcategories?.length ? 1 : 0;
        const yChildren = y.subcategories?.length ? 1 : 0;
        if (xChildren === yChildren) {
          return x.name > y.name ? 1 : -1;
        }
        return yChildren - xChildren;
      })
      .map(product => product.id);
  }

  setRootProduct(id: number, saveBreadCrumb = true) {
    const newRoot = this.products.get(id);
    // if (!newRoot) {
    //   console.log('Invalid new root product');
    //   return;
    // }
    this.currRootProductFull = newRoot;
    if (newRoot && !newRoot?.subcategories?.length) {
      alert('Return root ' + id);
      return;
    }
    if (saveBreadCrumb) {
      this.breadCrumbs.push(this.currRootProductId);
    }
    this.currRootProductId = id;
    this.currRootProductChanged$.next(id);
    this.setCurrProductsByRoot(id);
  }

  updateFilters() {
    this.server.getFilters().pipe(
      take(1),
    ).subscribe(
      filters => {
        this.filters = new Map();
        filters.forEach(filter => this.filters.set(filter.id, filter));
        this.onChangeFilters();
      },
      _ => alert('Error while getting filters!')
    );
  }

  selectProduct(productId: number, necessity: ProductNecessity, needUpdate: boolean = true) {
    const product = this.products?.get(productId);
    if (product) {
      product.necessity = necessity;
      // TO DO: check for forbidden
      if (needUpdate) {
        this.onProductsUpdated$.next(true);
      }
    }
  }

  returnBack() {
    if (this.hasBreadCrumbs) {
      this.setRootProduct(this.breadCrumbs.pop(), false);
    }
  }

  displayFilter(filterId: number) {
    const filter = this.filters.get(filterId);
    if (!filter?.loadDetails) {
      this.server.getFilter(filterId).pipe(take(1)).subscribe(
        filterModel => {
          if (!filterModel) {
            return; // DISPLAY error?
          }
          const newFilter = (filterModel as IFilter);
          newFilter.loadDetails = true;
          this.filters.set(filterId, newFilter);
          this.currFilter = newFilter; // TO DO: clear ingredients and tags?
          this.updateProductsNecessity(newFilter.ingredients, newFilter.byAvailableProducts);
        },
        _ => alert('Error during getting filter details')
      );
    }
  }

  updateProductsNecessity(ingredients: IFilterIngredientModel[], byAvailableProducts: boolean) {
    this.clearProductsNecessity(false);
    ingredients?.filter(x => x?.productId).forEach(ingredient => {
      const necessity = ingredient.necessity
        ? ProductNecessity.Required
        : byAvailableProducts
          ? ProductNecessity.Available
          : ProductNecessity.Forbidden;
      this.selectProduct(ingredient.productId, necessity, false);
    });
    this.onProductsUpdated$.next(true);
  }

  clearProductsNecessity(needUpdate = true) {
    // const necessity = byAvailableProducts ? ProductNecessity.Forbidden : ProductNecessity.Available;
    this.products?.forEach(product => product.necessity = ProductNecessity.Undefined);
    if (needUpdate) {
      this.onProductsUpdated$.next(true);
    }
  }

  setByAvailableProducts(byAvailableProducts: boolean) {
    // if (this.currFilter.byAvailableProducts === byAvailableProducts) {
    //   return;
    // }
    this.currFilter.byAvailableProducts = byAvailableProducts;
    this.clearProductsNecessity();
      // TO DO: functionality reverting byAvailableProducts
  }

  getProductsByNecessity(necessity: ProductNecessity): IFilterProduct[] {
    return [...this.products.values()].filter(x => x.necessity === necessity);
  }

  private onChangeFilters() {
    this.filtersChanged$.next([...this.filters.values()]);
  }

  getProduct(id: number): IFilterProduct {
    return this.products.get(id);
  }
}

