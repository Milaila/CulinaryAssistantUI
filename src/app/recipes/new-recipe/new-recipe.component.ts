import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IRecipeModel } from 'src/app/models/server/recipe-models';
import { IProduct } from 'src/app/models/server/product-model';
import { ServerHttpService } from 'src/app/services/server-http.sevice';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent implements OnInit, OnDestroy {

  currRecipe: IRecipeModel;
  products: IProduct[] = [];
  // newRecipe: IRecipeModel;
  subscription = new Subscription();

  recipeForm: FormGroup;

  constructor(
    private serverService: ServerHttpService,
    // private baseService: BaseService,
    // private formBuilder: FormBuilder,
    // private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.serverService.getProducts().subscribe(products => {
      this.products = products;
    }));
    this.currRecipe = {
      id: 0,
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
      id: 0,
      // product: null
      // productId: null,
      weight: 0,
      necessity: true,
      productId: 0,
    });
  }

  addTag() {
    this.currRecipe.tags.push({
      id: 0,
      tag: '',
    });
  }

  addStep() {
    this.currRecipe.steps.push({
      id: 0,
      // orderNumber: this.currRecipe.steps.length + 1,
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
    this.currRecipe.id = 0;
    if (this.currRecipe.image?.id){
      this.currRecipe.image.id = null;
    }
    this.currRecipe.ingredients?.forEach(x => x.id = 0);
    this.currRecipe.steps?.forEach(x => x.id = 0);
    this.currRecipe.tags?.forEach(x => x.id = 0);
    this.currRecipe.steps?.forEach(x => {
      if (x?.image){
        x.image.id = 0;
      }
    });
    // this.currRecipe.steps?.forEach((step, index) => {
    //   step.orderNumber = index + 1;
    // });
    this.subscription.add(this.serverService.createRecipe(this.currRecipe)
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
        id: 0,
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
        id: 0,
        data: src.slice(src.indexOf(',') + 1),
        title: image.name
      };
    };
    reader.readAsDataURL(image);
  }

  getRecipe(id: number) {
    this.subscription.add(this.serverService.getRecipeWithDetails(id).subscribe(recipe => {
      console.log('Get recipe success', recipe);
      this.currRecipe = recipe;
      // if (recipe.image) {
      //   const resizebase64 = require('resize-base64');
      //   this.currRecipe.image = resizebase64(recipe.image, 50, 50);
      // }
    }));
  }
}
