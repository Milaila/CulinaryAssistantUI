import { Injectable } from '@angular/core';
import { ServerHttpService } from './server-http.sevice';
import { AuthService } from './auth.service';
import { IImageModel } from '../models/server/image-model';
import { Observable, of, Subject, BehaviorSubject, iif, from } from 'rxjs';
import { take, filter, switchMap, switchMapTo, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  // private readonly images: Map<number, IImageModel> = new Map();
  private readonly images: Map<number, BehaviorSubject<string>> = new Map();

  constructor(
    private server: ServerHttpService,
    private auth: AuthService
  ) { }

  deleteImage(id: number) {
    if (this.auth.isAuthorized) {
      this.server.deleteImage(id).pipe(take(1)).subscribe(
        res => {
          this.images.get(id)?.next(null);
          console.log('Image deleted successfully');
        },
        error => alert('Error during deleting image')
      );
    }
  }

  deleteImages(ids: number[]) {
    if (this.auth.isAuthorized) {
      ids.forEach(id => this.server.deleteImage(id).pipe(take(1))
        .subscribe(res => this.images.get(id)?.next(null)));
    }
  }

  getImage(id: number): Observable<string> {
    if (!id) {
      return of(null);
    }
    let imageSubj = this.images.get(id);
    if (!imageSubj) {
      imageSubj = new BehaviorSubject<string>(null);
      this.images.set(id, imageSubj);
      this.server.getImage(id).pipe(
        take(1),
        filter(image => !!image?.data),
        map(image => 'data:image/jpeg;base64,' + image.data),
        tap(newImage => imageSubj.next(newImage))
      ).subscribe();
    }
    return imageSubj;
  }

  updateImage(id: number) {
    this.updateImageFromServer(id, this.images.get(id));
  }

  // getImages(ids: number[]): Observable<string[]> {
  //   const im = from(ids.map(id => this.getImage(id)))
  // }

  // setImages(images: number[]) {
  //   images.
  // }

  // updateImages(images: number[]) {
  //   images.forEach(id => images.)
  //   this.updateImageFromServer(id, this.images.get(id));
  // }

  private updateImageFromServer(id: number, imageSubj: BehaviorSubject<string>) {
    if (!imageSubj) {
      imageSubj = new BehaviorSubject<string>(null);
      this.images.set(id, imageSubj);
    }
    this.server.getImage(id).pipe(
      take(1),
      filter(image => !!image?.data),
      map(image => 'data:image/jpeg;base64,' + image.data)
    ).subscribe(
      newImage => imageSubj.next(newImage),
      _ => alert('Error during getting image')
    );
  }

  clearImages() {
    this.images.clear();
  }
}
