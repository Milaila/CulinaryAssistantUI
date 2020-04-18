import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { $ } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.serverBaseUrl + 'tags', {
      headers:
        new HttpHeaders(
          {
            'Content-Type': 'application/json',
            // 'X-Requested-With': 'XMLHttpRequest',
            'MyClientCert': '',        // This is empty
            'MyToken': ''              // This is empty
          }
        )
    })
      .pipe(
        map(x => {
          return x;
        }),
        catchError(error => {
          alert('error');
          return throwError({})
        })
      );
  } 

  getTags2(): Observable<any> {
    return this.http.get(environment.serverBaseUrl + 'tags', {
      headers:
        new HttpHeaders(
          {
            'Content-Type': 'application/json',
            // 'X-Requested-With': 'XMLHttpRequest',
            'MyClientCert': '',        // This is empty
            'MyToken': ''              // This is empty
          }
        )
    })
      .pipe(
        map(x => {
          return x;
        }),
        catchError(error => {
          alert('error');
          return throwError({})
        })
      );
  } 

  sendTag(tag: string): Observable<any> {
    var url = environment.serverBaseUrl + `tags/${tag}`;
    // alert(url);
    return this.http.post<string>(url, "anyvalue")
      .pipe(
        map(x => {
          // alert('Get')
          return x;
        }),
        catchError(error => {
          alert('error');
          return throwError({})
        })
      );
  }
}

export class Tag {
  id: number;
  title: string;
}
