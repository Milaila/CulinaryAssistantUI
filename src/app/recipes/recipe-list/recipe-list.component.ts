import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { ImagesService } from 'src/app/services/images.service';
import { Observable } from 'rxjs';
import { IImageModel } from 'src/app/models/server/image-model';
import { map, filter, tap, share } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  @Input()
  set recipes(value: IRecipeGeneralModel[]) {
    this.allRecipes = value || [];
    this.currentPage = 0;
    this.displayRecipesInRange();
  }

  allRecipes: IRecipeWithImage[] = [];
  currRecipes: IRecipeWithImage[] = [];
  itemsPerPage = 12;
  itemsOptions = [12, 24, 36, 48, 64];
  currentPage = 0;
  pageEvent: PageEvent;
  readonly images: Map<number, Observable<string>> = new Map();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public auth: AuthService,
    private imageStore: ImagesService
  ) { }

  ngOnInit(): void {
    // this.imageSrc$ = this.imageStore.getImage(1).pipe(
    //   filter(data => !!data),
    //   tap(d => console.log("tap image-", 0))
    // );
  }

  getImageSrc(id: number): Observable<string> {
    const res = this.images.get(id);
    return this.imageStore.getImage(id);
  }

  get recipesCount(): number {
    return this.allRecipes?.length;
  }

  onChangePage(event: PageEvent) {
    this.currentPage = event?.pageIndex;
    this.itemsPerPage = event?.pageSize;

    this.displayRecipesInRange();
    return event;
  }

  private displayRecipesInRange() {
    const start = this.currentPage * this.itemsPerPage;
    let end = start + this.itemsPerPage;
    const count = this.recipesCount;
    if (start >= count) {
      this.currRecipes = [];
      return;
    }
    if (end > count) {
      end = count;
    }
    this.currRecipes = this.allRecipes.slice(start, end);
    this.currRecipes.forEach(recipe => recipe.imageSrc = this.getImageSrc(recipe.imageId));
  }
}

export interface IRecipeWithImage extends IRecipeGeneralModel {
  imageSrc?: Observable<string>;
}
