import { Injectable } from '@angular/core';
import { ServerHttpService } from './server-http.sevice';
import { AuthService } from './auth.service';
import { IImageModel } from '../models/server/image-model';
import { Observable, of, Subject, BehaviorSubject, iif, from } from 'rxjs';
import { take, filter, switchMap, switchMapTo, map, tap } from 'rxjs/operators';
import { NotificationType, NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  // private readonly images: Map<number, IImageModel> = new Map();
  private readonly images: Map<number, BehaviorSubject<string>> = new Map();
  imageLimitKb = 1024;
  allowedExtensions: string[] = ['png', 'jpeg', 'jpg'];
  defaultInvalidExtensionContent = this.allowedExtensionsString;
  defaultInvalidExtensionTitle = 'Некоректний формат зображення';
  defaultInvalidSizeTitle = 'Зображення надто велике';
  defaultInvalidSizeContent = 'Зображення має не перевищувати 1 МБ';

  constructor(
    private server: ServerHttpService,
    private auth: AuthService,
    private notificationService: NotificationsService
  ) { }

  deleteImage(id: number) {
    if (this.auth.isAuthorized) {
      this.server.deleteImage(id).pipe(take(1)).subscribe(
        res => this.images.get(id)?.next(null)
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

  transformFileToImage(imageFile: File): Observable<IImageModel> {
    const sbj = new Subject<IImageModel>();
    if (!imageFile) {
      return sbj;
    }
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const src = e.target.result;
      const image = {
        id: 0,
        data: src.slice(src.indexOf(',') + 1),
        title: imageFile.name
      };
      sbj.next(image);
    };
    reader.readAsDataURL(imageFile);
    return sbj;
  }

  validateImageSize(file: File, sizeLimit: number = this.imageLimitKb): boolean {
    return !sizeLimit || file.size <= sizeLimit * 1024;
  }

  validateFileExtension(file: File) {
    if (this.allowedExtensions?.length > 0) {
      return this.allowedExtensions.some(ext => file.name.toLocaleLowerCase().endsWith(
        (ext.startsWith('.') ? '' : '.') + ext.toLowerCase())
      );
    }
    return true;
  }

  validateImageWithNotifications(file: File): boolean {
    if (!this.validateFileExtension(file)) {
      this.createNotification(this.defaultInvalidExtensionTitle, this.defaultInvalidExtensionContent);
      return false;
    }
    if (!this.validateImageSize(file)) {
      this.createNotification(this.defaultInvalidSizeTitle, NotificationType.Error);
      return false;
    }
    return true;
  }

  get allowedExtensionsString(): string {
    let allowedExtensionsListText;
    if (this.allowedExtensions?.length > 0){
      allowedExtensionsListText = `.${this.allowedExtensions[0]}`;
      for (let i = 1; i < this.allowedExtensions.length; i++) {
        allowedExtensionsListText += `, .${this.allowedExtensions[i]}`;
      }
    }
    return 'Дозволені формати зображень: ' + allowedExtensionsListText;
  }

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

  createNotification(title: string, content: string = '', type = NotificationType.Error) {
    this.notificationService.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }
}
