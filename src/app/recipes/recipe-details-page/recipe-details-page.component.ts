import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRecipeModel, IRecipeDetails, IIngredientModel } from 'src/app/models/server/recipe-models';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { Observable, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { IConfirmData } from 'src/app/models/else/confirm-data';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recipe-details-page',
  templateUrl: './recipe-details-page.component.html',
  styleUrls: ['./recipe-details-page.component.scss']
})
export class RecipeDetailsPageComponent implements OnInit, OnDestroy {

  recipeId: number;
  backParam: string;
  recipe: IRecipeModel;
  readonly subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationsService,
    private dialog: MatDialog,
    private server: ServerHttpService,
    public auth: AuthService,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.recipeId = +this.route.snapshot.params.id;
    this.backParam = this.route.snapshot.queryParams?.back;
  }

  get backUrl(): string[] | string {
    if (+this.backParam) {
      return ['/recipes', 'profile', this.backParam ];
    }
    return this.backParam ? ['/recipes', this.backParam ] : null;
  }

  deleteRecipe() {
    const id = this.recipe?.id;
    const name = this.recipe?.title;
    const data: IConfirmData = {
      question: `Видалити рецепт "${name}"?`,
      confirmation: 'Видалити',
      cancellation: 'Скасувати'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px', data });

    dialogRef.afterClosed().subscribe(answer => {
      if (!answer) {
        return;
      }
      this.server.deleteRecipe(id).subscribe(_ => {
        this.notifications.create('Рецепт успішно видалено', '', NotificationType.Success, {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true
        });
      });
    });
  }
}
