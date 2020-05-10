import { Injectable } from '@angular/core';
import { IModel } from '../models/server/base-model';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRecipeModel, IRecipeGeneralModel } from '../models/server/recipe-models';
import { serverUrls } from '../shared/server-urls';
import { IFilterModel, IFilterGeneralModel } from '../models/server/filter-models';
import { error } from 'protractor';
import { ISignUpModel } from '../models/server/sign-in-response-model';
import { ISignInModel } from '../models/server/sign-in-model';
import { ISignInResponse } from '../models/server/sign-up-model copy';
import { map, tap } from 'rxjs/operators';
import { IProfileGeneralModel, IProfileModel } from '../models/server/profile-models';
import { IImageModel } from '../models/server/image-model';
import { IProductModel, IProductGeneralModel } from '../models/server/product-model';

@Injectable({
  providedIn: 'root'
})
export class ServerHttpService {

  constructor(private http: HttpClient) { }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(serverUrls.tags).pipe(tap(x => console.log(x)));
  }

  // RECIPES

  getRecipe(id: number): Observable<IRecipeGeneralModel> {
    return this.http.get<IRecipeGeneralModel>(serverUrls.recipes + id).pipe(tap(x => console.log(x)));
  }

  getRecipeWithDetails(id: number): Observable<IRecipeModel> {
    const url = `${serverUrls.recipes}/${id}/details`;
    return this.http.get<IRecipeModel>(url).pipe(tap(x => console.log(x)));
  }

  getRecipesByFilter(filter: IFilterModel): Observable<IRecipeGeneralModel[]> {
    const url = `${serverUrls.recipes}/filters`;
    return this.http.post<IRecipeGeneralModel[]>(url, filter).pipe(tap(x => console.log(x)));
  }

  getRecipesByProfileId(id: number): Observable<IRecipeGeneralModel[]> {
    const url = `${serverUrls.recipes}/profiles/${id}`;
    return this.http.get<IRecipeGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  getMyRecipes(id: number): Observable<IRecipeGeneralModel[]> {
    // if (AuthUtils.isAuthorized) {
    //   throw error();
    // }
    const url = `${serverUrls.recipes}/profiles/my`;
    return this.http.get<IRecipeGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  getRecipesByFilterId(id: number): Observable<IRecipeGeneralModel[]> {
    const url = `${serverUrls.recipes}/filters/${id}`;
    return this.http.get<IRecipeGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  getRecipes(): Observable<IRecipeGeneralModel[]> {
    return this.http.get<IRecipeGeneralModel[]>(serverUrls.recipes).pipe(tap(x => console.log(x)));
  }

  createRecipe(recipe: IRecipeModel): Observable<number> {
    const url = `${serverUrls.recipes}/create`;
    return this.http.post<number>(url, recipe).pipe(tap(x => console.log(x)));
  }

  editRecipe(recipe: IRecipeModel): Observable<any> {
    const url = `${serverUrls.recipes}/edit`;
    return this.http.put(url, recipe).pipe(tap(x => console.log(x)));
  }

  deleteRecipe(id: number): Observable<any> {
    const url = `${serverUrls.recipes}/${id}`;
    return this.http.delete(url).pipe(tap(x => console.log(x)));
  }

  deleteMyRecipes(id: number): Observable<any> {
    const url = `${serverUrls.recipes}/my`;
    return this.http.delete(url).pipe(tap(x => console.log(x)));
  }

  // AUTH

  signUp(model: ISignUpModel): Observable<any> {
    return this.http.post(`${serverUrls.auth}/signup`, model).pipe(tap(x => console.log(x)));
  }

  signIn(model: ISignInModel): Observable<ISignInResponse> {
    return this.http.post<ISignInResponse>(`${serverUrls.auth}/signin`, model).pipe(tap(x => console.log(x)));
  }

  getToken(model: ISignInModel): Observable<string> {
    return this.signIn(model).pipe(map(response => response.token)).pipe(tap(x => console.log(x)));
  }

  // PROFILES

  getCurrentProfileWithDetails(): Observable<IProfileModel> {
    const url = `${serverUrls.profiles}/current/details`;
    return this.http.get<IProfileModel>(url).pipe(tap(x => console.log(x)));
  }

  getCurrentProfile(): Observable<IProfileGeneralModel> {
    const url = `${serverUrls.profiles}/current`;
    return this.http.get<IProfileGeneralModel>(url).pipe(tap(x => console.log(x)));
  }

  getProfileById(id: number): Observable<IProfileGeneralModel> {
    const url = `${serverUrls.profiles}/${id}`;
    return this.http.get<IProfileGeneralModel>(url).pipe(tap(x => console.log(x)));
  }

  getProfileByIdDetails(id: number): Observable<IProfileModel> {
    const url = `${serverUrls.profiles}/${id}/details`;
    return this.http.get<IProfileModel>(url).pipe(tap(x => console.log(x)));
  }

  editProfile(profile: IProfileModel): Observable<any> {
    const url = `${serverUrls.profiles}/edit`;
    return this.http.put(url, profile).pipe(tap(x => console.log(x)));
  }

  deleteProfile(id: number): Observable<any> {
    const url = `${serverUrls.profiles}/${id}`;
    return this.http.delete(url).pipe(tap(x => console.log(x)));
  }

  // FILTERS

  getFilters(): Observable<IFilterGeneralModel[]> {
    return this.http.get<IFilterGeneralModel[]>(serverUrls.filters).pipe(tap(x => console.log(x)));
  }

  getFilter(id: number): Observable<IFilterModel> {
    const url = `${serverUrls.filters}/${id}/details`;
    return this.http.get<IFilterModel>(url).pipe(tap(x => console.log(x)));
  }

  getPublicFilters(): Observable<IFilterGeneralModel[]> {
    const url = serverUrls.filters + '/public';
    return this.http.get<IFilterGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  getMyFilters(): Observable<IFilterGeneralModel[]> {
    const url = serverUrls.filters + '/my';
    return this.http.get<IFilterGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  createFilter(filter: IFilterModel): Observable<number> {
    const url = serverUrls.filters + '/create';
    return this.http.post<number>(url, filter).pipe(tap(x => console.log(x)));
  }

  editFilter(filter: IFilterModel): Observable<number> {
    const url = serverUrls.filters + '/edit';
    return this.http.put<number>(url, filter).pipe(tap(x => console.log(x)));
  }

  deleteFilter(id: number): Observable<any> {
    const url = `${serverUrls.filters}/${id}`;
    return this.http.delete(url).pipe(tap(x => console.log(x)));
  }

  // IMAGES

  postImage(image: IImageModel): Observable<number> {
    return this.http.post<number>(serverUrls.images, image).pipe(tap(x => console.log(x)));
  }

  getImage(id: number): Observable<IImageModel> {
    const url = `${serverUrls.images}/${id}`;
    return this.http.get<IImageModel>(url).pipe(tap(x => console.log(x)));
  }

  getImages(images: number[]): Observable<IImageModel[]> {
    const url = `${serverUrls.images}/get/bulk`;
    return this.http.post<IImageModel[]>(url, images).pipe(tap(x => console.log(x)));
  }

  deleteImage(id: number): Observable<any> {
    const url = `${serverUrls.images}/${id}`;
    return this.http.delete(url).pipe(tap(x => console.log(x)));
  }

  // PRODUCTS

  getProducts(): Observable<IProductGeneralModel[]> {
    return this.http.get<IProductGeneralModel[]>(serverUrls.products).pipe(tap(x => console.log(x)));
  }

  getProductWithDetails(id: number): Observable<IProductModel> {
    const url = `${serverUrls.products}/${id}/details`;
    return this.http.get<IProductModel>(url).pipe(tap(x => console.log(x)));
  }

  getProductsWithRelations(): Observable<IProductModel[]> {
    const url = `${serverUrls.products}/withrelations`;
    return this.http.get<IProductModel[]>(url).pipe(tap(x => console.log(x)));
  }

  getProductCategories(productId: number): Observable<IProductGeneralModel[]> {
    const url = `${serverUrls.products}/${productId}/categories`;
    return this.http.get<IProductGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  getProductSubcategories(productId: number): Observable<IProductGeneralModel[]> {
    const url = `${serverUrls.products}/${productId}/subcategories`;
    return this.http.get<IProductGeneralModel[]>(url).pipe(tap(x => console.log(x)));
  }

  createProduct(product: IProductModel): Observable<number> {
    const url = serverUrls.products + '/create';
    return this.http.post<number>(url, product).pipe(tap(x => console.log(x)));
  }

  editProduct(product: IProductModel): Observable<any> {
    const url = serverUrls.products + '/edit';
    return this.http.put(url, product).pipe(tap(x => console.log(x)));
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${serverUrls.products}/${id}`;
    return this.http.delete(url).pipe(tap(x => console.log(x)));
  }
}
