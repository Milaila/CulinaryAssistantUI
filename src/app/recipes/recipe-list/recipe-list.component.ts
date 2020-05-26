import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { ImagesService } from 'src/app/services/images.service';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { RecipeDetailsDialogComponent } from '../recipe-details-dialog/recipe-details-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { IConfirmData } from 'src/app/models/else/confirm-data';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  @Input()
  set recipes(value: IRecipeGeneralModel[]) {
    this.allRecipes = value;
    this.currentPage = 0;
    this.displayRecipesInRange();
  }
  @Input() noRecipesLabel: string;
  @Input() enableEditing = false;

  allRecipes: IRecipeWithImage[];
  currRecipes: IRecipeWithImage[];
  itemsPerPage = 12;
  itemsOptions = [4, 12, 24, 36, 48, 64];
  currentPage = 0;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorFooter: MatPaginator;

  constructor(
    public auth: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private server: ServerHttpService,
    private snackBar: MatSnackBar,
    private imageStore: ImagesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getImageSrc(id: number): Observable<string> {
    if (!id) {
      return of(null);
    }
    return this.imageStore.getImage(id);
  }

  get recipesCount(): number {
    return this.allRecipes ? this.allRecipes.length : -1;
  }

  onChangePage(event: PageEvent) {
    this.currentPage = event?.pageIndex;
    this.itemsPerPage = event?.pageSize;

    this.displayRecipesInRange();
    return event;
  }

  get backParam(): string {
    return this.enableEditing ? 'my' : 'search';
  }

  openRecipeDialog(recipeId: number): void {
    const dialogRef = this.dialog.open(RecipeDetailsDialogComponent, {
      width: '700px',
      data: recipeId
    });
  }

  deleteRecipe(id: number, name: string) {
    const data: IConfirmData = {
      question: `Видалити рецепт "${name}"?`,
      confirmation: 'Видалити',
      cancellation: 'Скасувати'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { width: '350px', data });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.server.deleteRecipe(id).subscribe(_ => {
          this.notifications.create('Рецепт успішно видалено', '', NotificationType.Success, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true
          });
          const index = this.allRecipes.findIndex(x => x.id === id);
          this.currentPage = 0;
          this.allRecipes?.splice(index, 1);
          this.displayRecipesInRange();
        });
      }
    });
  }

  private displayRecipesInRange() {
    const start = this.currentPage * this.itemsPerPage;
    let end = start + this.itemsPerPage;
    const count = this.recipesCount;
    if (start >= count) {
      this.currRecipes = null;
      return;
    }
    if (end > count) {
      end = count;
    }
    this.currRecipes = this.allRecipes?.slice(start, end);
    this.currRecipes?.forEach(recipe => recipe.imageSrc$ = this.getImageSrc(recipe.imageId));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}

export interface IRecipeWithImage extends IRecipeGeneralModel {
  imageSrc$?: Observable<string>;
}
