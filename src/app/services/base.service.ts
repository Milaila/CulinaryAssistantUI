import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { $ } from 'protractor';
import { IImageModel } from '../models/server/image-model';
import { IProductModel } from '../models/server/product-model';
import { IRecipeModel } from '../models/server/recipe-models';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient) { }

  // getTags(): Observable<Tag[]> {
  //   return this.http.get<Tag[]>(environment.serverBaseUrl + 'tags', {
  //     headers:
  //       new HttpHeaders(
  //         {
  //           'Content-Type': 'application/json',
  //           // 'X-Requested-With': 'XMLHttpRequest',
  //           'MyClientCert': '',        // This is empty
  //           'MyToken': ''              // This is empty
  //         }
  //       )
  //   })
  //     .pipe(
  //       map(x => {
  //         return x;
  //       }),
  //       catchError(error => {
  //         alert('error');
  //         return throwError({})
  //       })
  //     );
  // }

  // getTags2(): Observable<any> {
  //   return this.http.get(environment.serverBaseUrl + 'tags', {
  //     headers:
  //       new HttpHeaders(
  //         {
  //           'Content-Type': 'application/json',
  //           // 'X-Requested-With': 'XMLHttpRequest',
  //           'MyClientCert': '',        // This is empty
  //           'MyToken': ''              // This is empty
  //         }
  //       )
  //   })
  //     .pipe(
  //       map(x => {
  //         return x;
  //       }),
  //       catchError(error => {
  //         alert('error');
  //         return throwError({})
  //       })
  //     );
  // }

  // sendTag(tag: string): Observable<any> {
  //   const url = environment.serverBaseUrl + `tags/${tag}`;
  //   // alert(url);
  //   return this.http.post<string>(url, null)
  //     .pipe(
  //       map(x => {
  //         // alert('Get')
  //         return x;
  //       }),
  //       catchError(error => {
  //         alert('error');
  //         return throwError({});
  //       })
  //     );
  // }

  // sendImage(image: IImageModel): Observable<number> {
  //   const url = environment.serverBaseUrl + `images`;
  //   // alert(url);
  //   return this.http.post<number>(url, image)
  //     .pipe(
  //       map(x => {
  //         // alert('Get')
  //         return x;
  //       }),
  //       catchError(error => {
  //         alert('image send error');
  //         return throwError({});
  //       })
  //     );
  // }

  // getImages(): Observable<IImageModel[]> {
  //   const url = environment.serverBaseUrl + `images`;
  //   // alert(url);
  //   return this.http.get<IImageModel[]>(url)
  //     .pipe(
  //       map(x => {
  //         // alert('Get')
  //         return x;
  //       }),
  //       catchError(error => {
  //         alert('images get error');
  //         return throwError({});
  //       })
  //     );
  // }

  // getProducts(): Observable<IProductModel[]> {
  //   const url = environment.productsUrl;
  //   return this.http.get<IProductModel[]>(url)
  //     .pipe(
  //       catchError(error => {
  //         alert('products get error');
  //         return throwError({});
  //       })
  //     );
  // }

  // sendRecipe(recipe: IRecipeModel): Observable<number> {
  //   const url = environment.serverBaseUrl + 'recipes/create';

  //   return this.http.post<number>(url, recipe)
  //     .pipe(
  //       catchError(() => {
  //         alert('recipe send error');
  //         return throwError({});
  //       })
  //     );
  // }

  // getRecipe(id: number): Observable<IRecipeModel> {
  //   const url = environment.serverBaseUrl + `recipes/${id}/details`;

  //   return this.http.get<IRecipeModel>(url)
  //     .pipe(
  //       catchError(error => {
  //         alert('recipe get error');
  //         return throwError({});
  //       })
  //     );
  // }
}

export class Tag {
  id: number;
  title: string;
}
