import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRecipeModel, IRecipeDetails, IIngredientModel } from 'src/app/models/server/recipe-models';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { Observable, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from 'src/app/products/product-details/product-details.component';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {

  recipeId: number;
  recipe: IRecipeModel;
  readonly subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private server: ServerHttpService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.recipeId = +this.route.snapshot.params.id;
    this.subscriptions.add(this.server.getRecipeWithDetails(this.recipeId).subscribe(
      recipe => this.recipe = {
        ...recipe,
        steps: recipe.steps?.sort((x, y) => x.orderNumber > y.orderNumber ? 1 : -1)
      },
      error => this.router.navigate(['/404'])
    ));
  }

  openProduct(productId: number): void {
    const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      data: productId
    });

    this.subscriptions.add(dialogRef.afterClosed().subscribe());
  }
}
