import { Component, OnInit, OnDestroy, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRecipeModel, IRecipeDetails, IIngredientModel, IRecipeModelView } from 'src/app/models/server/recipe-models';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { Observable, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from 'src/app/products/product-details/product-details.component';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {

  @Input()
  set recipeId(value: number) {
    this.updateRecipe(value);
  }
  @Output() loadRecipeTitle = new EventEmitter();
  recipe: IRecipeModelView;
  backParam: string;
  // @Input() recipe: IRecipeModel;
  readonly subscriptions = new Subscription();

  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private imageStore: ImagesService,
    private server: ServerHttpService,
    // @Inject(MAT_DIALOG_DATA) data: number
  ) {
    // if (data) {
    //   this.updateRecipe(+data);
    // }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
  }

  private updateRecipe(id: number) {
    if (!id) {
      this.recipe = null;
      return;
    }
    this.subscriptions.add(this.server.getRecipeWithDetails(+id).subscribe(
      recipe => {
        this.loadRecipeTitle.emit(recipe.title);
        this.recipe = {
          ...recipe,
          imageSrc$: this.imageStore.getImage(recipe.imageId),
          steps: recipe.steps
            ?.sort((x, y) => x.orderNumber > y.orderNumber ? 1 : -1)
            .map(step => ({
              ...step,
              imageSrc$: this.imageStore.getImage(step?.imageId)
            }))
        };
      },
      error => this.router.navigate(['/404']) // TO DO: only for details page?
    ));
  }

  openProduct(productId: number): void {
    const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      data: productId
    });

    this.subscriptions.add(dialogRef.afterClosed().subscribe());
  }
  //   this.recipeId = +this.route.snapshot.params.id;
  //   this.subscriptions.add(this.route.queryParams.subscribe(x => this.backParam = x?.back));
  //   this.subscriptions.add(this.server.getRecipeWithDetails(this.recipeId).subscribe(
  //     recipe => this.recipe = {
  //       ...recipe,
  //       steps: recipe.steps?.sort((x, y) => x.orderNumber > y.orderNumber ? 1 : -1)
  //     },
  //     error => this.router.navigate(['/404'])
  //   ));
  // }

  // get backUrl(): string[] | string {
  //   return this.backParam ? ['/recipes', this.backParam ] : null;
  // }

  // openProduct(productId: number): void {
  //   const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
  //     width: '600px',
  //     data: productId
  //   });

  //   this.subscriptions.add(dialogRef.afterClosed().subscribe());
  // }
}
