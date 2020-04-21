import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { IRecipeDetailsModel, IRecipeStepModel, IRecipeModel, IProductModel } from 'src/app/models/IRecipeModel';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RecipeService } from 'src/app/services/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent implements OnInit, OnDestroy {

  currRecipe: IRecipeDetailsModel;
  products: IProductModel[] = [];
  newRecipe: IRecipeDetailsModel;
  subscription = new Subscription();

  recipeForm: FormGroup;

  constructor(
    private baseService: BaseService,
    private recipeService: RecipeService,
    private formBuilder: FormBuilder,
    // private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.baseService.getProducts().subscribe(products => {
      this.products = products;
    }));
    this.currRecipe = {
      title: '',
      ingredients: [],
      steps: [],
      tags: [],
      image: {
        data: '',
      },
    };
    this.addIngredient();
    this.addTag();
    this.addStep();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addIngredient() {
    this.currRecipe.ingredients.push({
      // product: null
      // productId: null,
      weight: 0,
      necessity: true,
    });
  }

  addTag() {
    this.currRecipe.tags.push({
      title: '',
    });
  }

  addStep() {
    this.currRecipe.steps.push({
      order: this.currRecipe.steps.length + 1,
      image: {
        data: '',
      }
    });
  }

  removeStep(stepIndex: number) {
    this.currRecipe.steps.splice(stepIndex, 1);
  }

  removeIngredient(ingredientIndex: number) {
    this.currRecipe.ingredients.splice(ingredientIndex, 1);
  }

  removeTag(tagIndex: number) {
    this.currRecipe.tags.splice(tagIndex, 1);
  }

  removeRecipeImage() {
    this.currRecipe.image = null;
  }

  removeStepImage(stepIndex: number) {
    this.currRecipe.steps[stepIndex].image = null;
  }

  onSave(): void {
    // this.recipeService.currRecipe = {
    //   title: for
    // }
  }

  uploadStepImage(stepIndex: number, event: any) {
    const image = event?.target?.files[0];
    const reader = new FileReader();
    if (!image) {
      return;
    }

    reader.onload = (e: any) => {
      this.currRecipe.steps[stepIndex].image = {
        data: e.target.result,
        title: image.name
      };
    };
    reader.readAsDataURL(image);
  }

  uploadRecipeImage(event: any) {
    const image = event?.target?.files[0];
    const reader = new FileReader();
    if (!image) {
      return;
    }

    reader.onload = (e: any) => {
      this.currRecipe.image = {
        data: e.target.result,
        title: image.name
      };
    };
    reader.readAsDataURL(image);
  }
}
