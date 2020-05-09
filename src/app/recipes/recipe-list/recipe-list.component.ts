import { Component, OnInit, Input } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { ImagesService } from 'src/app/services/images.service';
import { Observable } from 'rxjs';
import { IImageModel } from 'src/app/models/server/image-model';
import { map, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  @Input() recipes: IRecipeGeneralModel[] = [];

  constructor(
    public auth: AuthService,
    private imageStore: ImagesService
  ) { }

  ngOnInit(): void {
  }

  getImageSrc(id: number): Observable<string> {
    console.log('Observe image: ', id);
    return this.imageStore.getImage(id).pipe(
      filter(data => !!data),
      map(data => 'data:image/jpeg;base64,' + data)
    );
  }

}
