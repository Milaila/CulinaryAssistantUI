import { Injectable } from '@angular/core';
import { ServerHttpService } from './server-http.sevice';
import { AuthService } from './auth.service';
import { IImageModel } from '../models/server/image-model';
import { Observable, of, Subject, BehaviorSubject, iif } from 'rxjs';
import { take, filter, switchMap, switchMapTo, map } from 'rxjs/operators';

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

  // getImage2(id: number): string {
  //   const image = this.images.get(id);
  //   if (!image) {
  //     this.server.getImage(id).pipe(take(1), filter(x => !!x)).subscribe(
  //       newImage => this.images.set(newImage.id, newImage),
  //       _ => alert('Error during getting image')
  //     );
  //   }
  //   return image.data;
  // }

  getImage(id: number): Observable<string> {
    if (!id) {
      return of(null);
    }
    if (!this.images.get(id)) {
      this.updateImageFromServer(id, null);
    }
    return this.images.get(id);
  }

  updateImage(id: number) {
    this.updateImageFromServer(id, this.images.get(id));
  }

  // updateImages(images: number[]) {
  //   images.forEach(id => images.)
  //   this.updateImageFromServer(id, this.images.get(id));
  // }

  private updateImageFromServer(id: number, imageSubj: BehaviorSubject<string>) {
    if (!imageSubj) {
      imageSubj = new BehaviorSubject<string>(null);
      this.images.set(id, imageSubj);
    }
    this.server.getImage(id).pipe(take(1)).subscribe(
      newImage => imageSubj.next(newImage?.data),
      _ => alert('Error during getting image')
    );
  }

  clearImages() {
    this.images.clear();
  }

}
