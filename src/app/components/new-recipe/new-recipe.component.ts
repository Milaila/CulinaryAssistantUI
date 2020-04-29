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
      // id: 8,
      title: '',
      ingredients: [],
      steps: [],
      tags: [],
    };
    // this.addIngredient();
    // this.addTag();
    // this.addStep();
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
      tag: '',
    });
  }

  addStep() {
    this.currRecipe.steps.push({
      orderNumber: this.currRecipe.steps.length + 1,
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
    this.currRecipe.steps?.forEach((step, index) => {
      step.orderNumber = index + 1;
    });
    this.subscription.add(this.baseService.sendRecipe(this.currRecipe)
      .subscribe(x => alert(x)));
  }

  uploadStepImage(stepIndex: number, event: any) {
    const image = event?.target?.files[0];
    const reader = new FileReader();
    if (!image) {
      return;
    }

    reader.onload = (e: any) => {
      const src = e.target.result;
      this.currRecipe.steps[stepIndex].image = {
        data: src.slice(src.indexOf(',') + 1),
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
      const src = e.target.result;
      this.currRecipe.image = {
        data: src.slice(src.indexOf(',') + 1),
        title: image.name
      };
    };
    reader.readAsDataURL(image);
  }
}
