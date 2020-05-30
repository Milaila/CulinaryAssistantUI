import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { IFilterModel, IFilter, IFilterIngredientModel, IFilterTagModel, IFilterGeneralModel, IFilterProduct, ProductNecessity, IFilterGeneralProduct } from '../models/server/filter-models';
import { AuthService } from './auth.service';
import { ServerHttpService } from './server-http.service';
import { Subscription, BehaviorSubject, Subject, Observable } from 'rxjs';
import { take, catchError, map, filter } from 'rxjs/operators';
import { IRecipeModel, IRecipeGeneralModel, IRecipeTagModel } from '../models/server/recipe-models';
import { ImagesService } from './images.service';
import { IProductView, IProductModel } from '../models/server/product-model';
import { ProductsService } from './products.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters: Map<number, IFilterModel> = new Map();
  private currRootProductId: number;
  private breadCrumbs: number[] = [];
  private currProducts: number[] = [];
  readonly products: Map<number, IFilterProduct> = new Map();
  // get products():

  readonly filtersChanged$: BehaviorSubject<IFilterGeneralModel[]> = new BehaviorSubject<IFilterGeneralModel[]>(null);
  // productsChanged: BehaviorSubject<IFilterGeneralProduct[]> = new BehaviorSubject<IFilterGeneralProduct[]>(null);
  // filtersChanged$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  readonly currProductsChanged$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  readonly onProductsUpdated$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  readonly currRootProductChanged$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  readonly requiredTags: Set<string> = new Set();
  readonly forbiddenTags: Set<string> = new Set();
  readonly onCurrFilterChanged$: BehaviorSubject<IFilterModel> = new BehaviorSubject(null);

  currFilter: IFilterModel;
  private areProductsUpdated = false;

  constructor(
    private auth: AuthService,
    private server: ServerHttpService,
    private notifications: NotificationsService,
    private productStore: ProductsService,
    private imageStore: ImagesService
  ) {
    this.initCurrFilter();
  }

  get hasBreadCrumbs(): boolean {
    return !!this.breadCrumbs?.length;
  }

  get needUpdate() {
    return !(this.areProductsUpdated && this.productStore.isUpdated);
  }

  updateProducts() {
    this.areProductsUpdated = false;
    if (this.productStore.isUpdated) {
      this.updateByProducts(this.productStore.store.values());
    }
    else {
      this.productStore.updateProducts()
        .subscribe(products => this.updateByProducts(products));
    }
  }

  private updateByProducts(newProducts: IterableIterator<IProductModel> | IProductModel[]) {
    this.products.clear();
    const necessity = ProductNecessity.Undefined;
    for (const product of newProducts) {
      this.products.set(product.id, {...product, necessity});
    }
    this.setRootProduct(0, false);
    this.onProductsUpdated$.next(null);
    this.areProductsUpdated = true;
  }

  clearProducts() {
    this.products.clear();
    this.areProductsUpdated = false;
    this.onProductsUpdated$.next(null);
  }

  private setCurrProductsByRoot(rootProduct?: number) {
    let products = [...this.products.values()];
    if (rootProduct) {
      products = products.filter(x => x?.categories?.includes(rootProduct));
    }
    else if (rootProduct === 0) {
      products = products.filter(x => !x.categories?.length);
    }
    this.currProducts = this.sortProductsByNameAndType(products);
    this.currProductsChanged$.next(this.currProducts);
  }

  getProductViewDetails(productId: number): IProductView {
    const product = this.products.get(productId);
    if (!product) {
      return null;
    }
    return {
      ...product,
      categories: null,
      subcategories: null,
      imageSrc$: this.imageStore.getImage(product.imageId),
      categoryNames: product.categories?.map(x => this.products.get(x)),
      subcategoryNames: product.subcategories?.map(x => this.products.get(x)),
    };
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
    this.currProducts = this.sortProductsByNameAndType(products);
    this.currProductsChanged$.next(this.currProducts);
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

  // getProductNecessity(productId: number): boolean {
  //   const necessity = this.products.get(productId)?.necessity;
  //   switch (necessity) {
  //     case ProductNecessity.Required: return true;
  //     case ProductNecessity.NotRequired: return false;
  //     default: return null;
  //   }
  // }

  isProductSelected(productId: number, necessity: ProductNecessity): boolean {
    return this.products.get(productId)?.necessity === necessity;
  }

  areAllCurrentProductsSelected(necessity: ProductNecessity): boolean {
    for (const id of this.currProducts) {
      if (this.products.get(id).necessity !== necessity) {
        return false;
      }
    }
    return true;
  }

  areNotAllCurrentProductsSelected(necessity: ProductNecessity): boolean {
    let anySelected = false;
    let anyNotSelected = false;
    for (const id of this.currProducts) {
      if (this.products.get(id).necessity === necessity) {
        if (!anySelected) {
          if (anyNotSelected) {
            return true;
          }
          anySelected = true;
        }
      } else if (!anyNotSelected) {
        if (anySelected) {
          return true;
        }
        anyNotSelected = true;
      }
    }
    return false;
  }

  selectAllCurrentProducts(necessity: ProductNecessity) {
    this.currProducts.forEach(id => this.products.get(id).necessity = necessity);
    this.onProductsUpdated$.next(true);
  }

  unselectAllCurrentProductsByNecessity(necessity: ProductNecessity){
    this.currProducts.forEach(id => {
      const product = this.products.get(id);
      if (product.necessity === necessity){
        product.necessity = ProductNecessity.Undefined;
      }
    });
    this.onProductsUpdated$.next(true);
  }

  removeTag(tag: string) {
    this.forbiddenTags.delete(tag);
    this.requiredTags.delete(tag);
  }

  private sortProductsByNameAndType(products: IFilterProduct[]): number[] {
    return products
      .sort((x, y) => {
        const xChildren = x.subcategories?.length ? 1 : 0;
        const yChildren = y.subcategories?.length ? 1 : 0;
        if (xChildren === yChildren) {
          return x.name?.localeCompare(y.name);
        }
        return yChildren - xChildren;
      })
      .map(product => product.id);
  }

  setRootProduct(id: number, saveBreadCrumb = true) {
    // if (this.currRootProductId === id) {
    //   return;
    // }
    if (!id) {
      this.breadCrumbs = [];
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
        filters.forEach(f => this.filters.set(f.id, f));
        this.onChangeFilters();
      },
      _ => this.createNotification('Помилка під час завантаження фільтрів')
    );
  }

  setProductNecessity(productId: number, necessity: ProductNecessity, needUpdate: boolean = true) {
    const product = this.products?.get(productId);
    if (product) {
      product.necessity = necessity;
      // TO DO: check for forbidden
      if (needUpdate) {
        this.onProductsUpdated$.next(productId);
      }
    }
  }

  selectProduct(productId: number) {
    const product = this.products?.get(productId);
    if (product) {
      const currNecessity = product.necessity;
      switch (product.necessity) {
        case ProductNecessity.Required: product.necessity = ProductNecessity.NotRequired; break;
        case ProductNecessity.NotRequired: product.necessity = ProductNecessity.Undefined; break;
        default: product.necessity = ProductNecessity.Required;
      }
      this.onProductsUpdated$.next(productId);
    }
  }

  returnBack() {
    if (this.hasBreadCrumbs) {
      this.setRootProduct(this.breadCrumbs.pop(), false);
    }
  }

  applyFilter(filterId: number) {
    if (!filterId) {
      this.resetCurrentFilter();
      return;
    }

    this.server.getFilter(filterId).pipe(take(1), filter(f => !!f)).subscribe(
      filterModel => {
        const newFilter = (filterModel as IFilter);
        this.filters.set(filterId, newFilter);
        this.currFilter = newFilter; // TO DO: clear ingredients and tags?
        this.onCurrFilterChanged$.next(this.currFilter);
        this.updateProductsNecessity(newFilter.ingredients, newFilter.byAvailableProducts);
        this.updateTags(this.currFilter.tags);
        this.createNotification('Фільтр встановлено', `Фільтр: "${newFilter.filterTitle}"`, NotificationType.Success);
      },
      _ => this.createNotification('Фільтр не встановлено', 'Помилка під час завантаження фільтру')
    );
  }

  removeFilter(filterId: number) {
    if (this.currFilter.id === filterId) {
      this.currFilter.filterTitle = '';
      this.currFilter.id = 0;
    }

    this.filters.delete(filterId);
    this.onChangeFilters();
    this.server.deleteFilter(filterId).subscribe(
      _ => this.createNotification('Фільтр успішно видалено', '', NotificationType.Success),
      error => this.createNotification('Фільтр не видалено', 'Помилка під час видалення фільтру')
    );
  }

  resetCurrentFilter() {
    this.initCurrFilter();
    this.updateProductsNecessity([], false);
    this.updateTags([]);
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
        : ProductNecessity.NotRequired;
      this.setProductNecessity(ingredient.productId, necessity, false);
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

  changeByAvailableProducts(byAvailable: boolean) {
    this.currFilter.byAvailableProducts = byAvailable;
    this.products?.forEach(product => {
      if (product.necessity === ProductNecessity.NotRequired) {
        product.necessity = ProductNecessity.Undefined;
      }
    });
    this.onProductsUpdated$.next(true);
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

  getRecipesByFilter(filterId: number): Observable<IRecipeGeneralModel[]> {
    return this.server.getRecipesByFilterId(filterId);
  }

  saveCurrFilter(filterName: string) {
    const filterModel = this.getCurrentFilterModel(filterName);
    if (this.auth.isAdmin) {
      filterModel.isDefault = true;
    }
    return this.server.createFilter(filterModel).pipe(take(1))
      .subscribe(
        id => {
          filterModel.id = id;
          this.filters.set(id, filterModel);
          this.currFilter.id = 0;
          this.onChangeFilters();
          this.createNotification(`Фільтр "${filterName}" збережено`, '', NotificationType.Success, 300);
        },
        _ => this.createNotification('Фільтр не збережено', 'Помилка під час збереження фільтру')
      );
  }

  private getCurrentFilterModel(filterTitle: string = ''): IFilterModel {
    const products = [...this.products.values()];
    const tags: IFilterTagModel[] = [];
    const ingredients: IFilterIngredientModel[] = [];
    products.filter(p => p.necessity !== ProductNecessity.Undefined && p.necessity)
      .forEach(product => {
        ingredients.push({
          id: 0,
          productId: product.id,
          necessity: product.necessity === ProductNecessity.Required
        });
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

  private initCurrFilter() {
    this.currFilter = {
      id: 0,
      filterTitle: '',
      isDefault: false,
      onlyProducts: false,
      byAvailableProducts: false,
    };
    this.onCurrFilterChanged$.next(this.currFilter);
  }

  createNotification(title: string, content: string = '', type = NotificationType.Error, time: number = 3000) {
    this.notifications.create(title, content, type, {
      timeOut: time,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }
}

