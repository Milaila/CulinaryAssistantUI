import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { IFilterModel, IFilter, IFilterIngredientModel, IFilterTagModel, IFilterGeneralModel, IFilterProduct, ProductNecessity, IFilterGeneralProduct } from '../models/server/filter-models';
import { AuthService } from './auth.service';
import { ServerHttpService } from './server-http.sevice';
import { Subscription, BehaviorSubject, Subject, Observable } from 'rxjs';
import { take, catchError, map } from 'rxjs/operators';
import { IProductGeneralModel, IProductModel } from '../models/server/product-model';
import { isNumber } from 'util';
import { MatRadioChange } from '@angular/material/radio';
import { EventEmitter } from 'protractor';
import { IRecipeModel, IRecipeGeneralModel, IRecipeTagModel } from '../models/server/recipe-models';
import { TagsSearchSectionComponent } from '../recipes/tags-search-section/tags-search-section.component';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters: Map<number, IFilterModel> = new Map();
  products: Map<number, IFilterProduct> = new Map();
  private currRootProductFull: IProductModel;
  private currRootProductId: number;
  private breadCrumbs: number[] = [];

  readonly filtersChanged$: BehaviorSubject<IFilterGeneralModel[]> = new BehaviorSubject<IFilterGeneralModel[]>(null);
  // productsChanged: BehaviorSubject<IFilterGeneralProduct[]> = new BehaviorSubject<IFilterGeneralProduct[]>(null);
  // filtersChanged$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  readonly currProductsChanged$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  readonly onProductsUpdated$: Subject<any> = new Subject();
  readonly currRootProductChanged$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  readonly requiredTags: Set<string> = new Set();
  readonly forbiddenTags: Set<string> = new Set();

  currFilter: IFilterModel = {
    filterTitle: '',
    isDefault: false,
    id: 0,
    onlyProducts: false,
    byAvailableProducts: false,
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
      : products; //products.filter(x => !x.categories?.length);
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

  selectTag(tag: string, isRequired: boolean) {
    if (isRequired) {
      this.forbiddenTags.delete(tag);
      this.requiredTags.add(tag);
    }
    else {
      this.forbiddenTags.add(tag);
      this.requiredTags.delete(tag);
    }
  }

  removeTag(tag: string) {
    this.forbiddenTags.delete(tag);
    this.requiredTags.delete(tag);
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

  applyFilter(filterId: number) {
    const filter = this.filters.get(filterId);
    this.server.getFilter(filterId).pipe(take(1)).subscribe(
      filterModel => {
        if (!filterModel) {
          return; // DISPLAY error?
        }
        const newFilter = (filterModel as IFilter);
        this.filters.set(filterId, newFilter);
        this.currFilter = newFilter; // TO DO: clear ingredients and tags?
        this.updateProductsNecessity(newFilter.ingredients, newFilter.byAvailableProducts);
        this.updateTags(this.currFilter.tags);
      },
      _ => alert('Error during getting filter details')
    );
  }

  private updateTags(tags: IFilterTagModel[]) {
    this.requiredTags.clear();
    this.forbiddenTags.clear();
    tags?.forEach(tag => this.selectTag(tag.tag.toLocaleLowerCase(), tag.necessity));
  }

  private updateProductsNecessity(ingredients: IFilterIngredientModel[], byAvailableProducts: boolean) {
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

  getRecipesByCurrentFilter(): Observable<IRecipeGeneralModel[]> {
    return this.server.getRecipesByFilter(this.getCurrentFilterModel());
  }

  saveCurrFilter(filterName: string) {
    const filterModel = this.getCurrentFilterModel(filterName);
    return this.server.createFilter(filterModel).pipe(take(1))
      .subscribe(
        id => {
          this.filters.set(id, { ...filterModel, loadDetails: true });
          this.onChangeFilters();
        },
        _ => alert('Error during saving filter')
      );
  }

  private getCurrentFilterModel(filterTitle: string = ''): IFilterModel {
    const products = [...this.products.values()];
    const tags: IFilterTagModel[] = [];
    const ingredients: IFilterIngredientModel[] = [];
    products.forEach(product => {
      if (product.necessity === ProductNecessity.Required) {
        ingredients.push({
          id: 0,
          productId: product.id,
          necessity: true
        });
      } else if (product.necessity === ProductNecessity.Available || product.necessity === ProductNecessity.Forbidden) {
        ingredients.push({
          id: 0,
          productId: product.id,
          necessity: false
        });
      }
    });
    this.requiredTags.forEach(tag => tags.push({ id: 0, tag, necessity: true }));
    this.forbiddenTags.forEach(tag => tags.push({ id: 0, tag, necessity: false }));

    return {
      id: 0,
      recipeTitle: this.currFilter.recipeTitle,
      onlyProducts: this.currFilter.onlyProducts,
      byAvailableProducts: this.currFilter.byAvailableProducts,
      authorId: this.currFilter.authorId,
      minDuration: this.currFilter.minDuration,
      maxDuration: this.currFilter.maxDuration,
      minCalories: this.currFilter.minCalories,
      maxCalories: this.currFilter.maxCalories,
      ingredients,
      tags,
      filterTitle,
      description: this.currFilter.description,
      isDefault: false,
    };
  }
}

