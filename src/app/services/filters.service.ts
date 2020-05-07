import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { IFilterModel, IFilter, IFilterIngredientModel, IFilterTagModel, IFilterGeneralModel, IFilterProduct, ProductNecessity, IFilterGeneralProduct } from '../models/server/filter-models';
import { AuthService } from './auth.service';
import { ServerHttpService } from './server-http.sevice';
import { Subscription, BehaviorSubject } from 'rxjs';
import { take, catchError, map } from 'rxjs/operators';
import { IProductGeneralModel, IProductModel } from '../models/server/product-model';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters: Map<number, IFilter> = new Map();
  private products: Map<number, IFilterProduct> = new Map();
  private currRootProductFull: IProductModel;
  private currRootProductId: number;
  private breadCrumbs: number[] = [];

  filtersChanged: BehaviorSubject<IFilterGeneralModel[]> = new BehaviorSubject<IFilterGeneralModel[]>(null);
  // productsChanged: BehaviorSubject<IFilterGeneralProduct[]> = new BehaviorSubject<IFilterGeneralProduct[]>(null);
  // filtersChanged: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  currProductsChanged: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  currRootProductChanged: BehaviorSubject<number> = new BehaviorSubject<number>(null);

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

  // getFiltersArray(): IFilterGeneralModel[] {
  //   console.log('Get filters array');
  //   return [...(this.filters.values())];
  // }

  // getProductsArray(): IFilterProduct[] {
  //   console.log('Get products array');
  //   return [...(this.products.values())];
  // }

  updateProducts() {
    this.server.getProductsWithRelations().pipe(
      take(1),
    ).subscribe(
      products => {
        this.products = new Map();
        const necessity = ProductNecessity.Available;
        products.forEach(product => this.products.set(product.id, {...product, necessity}));
        // const currProducts = this.filterProductsByChildren([...this.products.values()])
        //   .map(product => product.id);
        // this.currProductsChanged.next(currProducts);
        this.setCurrProducts();
      },
      _ => alert('Error while getting products!')
    );
  }

  // private filterProductsByChildren(products: IFilterProduct[]) {
  //   return products.sort((x, y) => x?.subcategories?.length - y?.subcategories?.length);
  // }

  private setCurrProducts(rootProduct?: number) {
    let products = [...this.products.values()];
    if (rootProduct){
      products = products.filter(x => x?.categories?.includes(rootProduct));
    }
    const currProducts = products
      .sort((x, y) => {
        // (x?.subcategories?.length !!y?.subcategories?.length) ?
        // -1 : (x?.categories?.length - y?.categories?.length)
        return (!x?.subcategories?.length && !!y?.subcategories?.length)
          ? 1
          : (x?.categories?.length - y?.categories?.length);
      })
      .map(product => product.id);
    this.currProductsChanged.next(currProducts);
  }

  setRootProduct(id: number, saveBreadCrumb = true) {
    const newRoot = this.products.get(id);
    // if (!newRoot) {
    //   console.log('Invalid new root product');
    //   return;
    // }
    this.currRootProductFull = newRoot;
    if (newRoot && !newRoot?.subcategories?.length) {
      return;
    }
    if (saveBreadCrumb) {
      this.breadCrumbs.push(this.currRootProductId);
    }
    this.currRootProductId = id;
    this.currRootProductChanged.next(id);
    this.setCurrProducts(id);
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

  selectProduct(productId: number, necessity: ProductNecessity, needUpdate: boolean = false) {
    const product = this.products?.get(productId);
    if (product) {
      product.necessity = necessity;
      // TO DO: check for forbidden
      // if (needUpdate) {
      //   this.onChangeProducts();
      // }
    }
  }

  returnBack() {
    this.setRootProduct(this.breadCrumbs.pop(), false);
    // if (this.hasBreadCrumbs) {
    //   this.setRootProduct(this.breadCrumbs.pop(), false);
    // }
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
          // this.onChangeProducts();
        },
        _ => alert('Error during getting filter details')
      );
    }
  }

  updateProductsNecessity(ingredients: IFilterIngredientModel[], byAvailableProducts: boolean) {
    this.clearProductsNecessity(byAvailableProducts);
    ingredients?.filter(x => x?.productId).forEach(ingredient => {
      const necessity = ingredient.necessity
        ? ProductNecessity.Required
        : byAvailableProducts
          ? ProductNecessity.Available
          : ProductNecessity.Forbidden;
      this.selectProduct(ingredient.productId, necessity);
    });
  }

  clearProductsNecessity(byAvailableProducts: boolean, needUpdate = false) {
    const necessity = byAvailableProducts ? ProductNecessity.Forbidden : ProductNecessity.Available;
    this.products?.forEach(product => product.necessity = necessity);
    // if (needUpdate) {
    //   this.onChangeProducts();
    // }
  }
  // TO DO: functionality reverting byAvailableProducts

  // private onChangeProducts() {
  //   this.productsChanged.next([...this.products.values()]);
  // }

  private onChangeFilters() {
    this.filtersChanged.next([...this.filters.values()]);
  }

  getProduct(id: number): IFilterProduct {
    return this.products.get(id);
  }
}

// export class FilterProduct implements IProductModel {
//   id = 0;
//   name: string;
//   necessity: ProductNecessity = ProductNecessity.Available;
//   expanded = false;
//   subcategories?: number[];
//   categories?: number[];
//   childrenLength = () => this.subcategories.length;
// }

export interface CurrFilter extends IFilterGeneralModel {
  recipeTitle: string;
  filterTitle: string;
  description?: string;
  isDefault: boolean;
  onlyProducts: boolean;
  byAvailableProducts: boolean;
  authorId?: number;
  minDuration?: number;
  maxDuration?: number;
  minCalories?: number;
  maxCalories?: number;
  ingredients?: () => IFilterIngredientModel[];
  tags?: IFilterTagModel[];
}
