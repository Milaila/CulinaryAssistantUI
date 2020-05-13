import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, NgForm } from '@angular/forms';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { IRecipeModel } from 'src/app/models/server/recipe-models';
import { IProduct } from 'src/app/models/server/product-model';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { ImagesService } from 'src/app/services/images.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { share, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from 'src/app/products/product-details/product-details.component';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-recipe-editor',
  templateUrl: './recipe-editor.component.html',
  styleUrls: ['./recipe-editor.component.scss']
})
export class RecipeEditorComponent implements OnInit, OnDestroy {

  removedImages: number[] = [];
  currRecipe: IRecipeModel;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  subscription = new Subscription();
  isNew = true;

  @ViewChild('recipeForm') recipeForm: ElementRef;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  tagsCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags$: Observable<string[]>;

  constructor(
    private server: ServerHttpService,
    private imageService: ImagesService,
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // const id = +this.route.snapshot.params.id;
    if (!this.auth.isAuthorized) {
      this.createNotification('Нема права доступу', NotificationType.Error, 'Необхідна авторизація');
      this.router.navigate(['users/signup']);
    }
    // this.initRecipe(id);
    this.subscription.add(this.route.params.subscribe(x => this.initRecipe(+x.id)));
    const existingTags$ = this.server.getTags().pipe(share());
    this.subscription.add(this.server.getProducts().subscribe(products => {
      this.filteredProducts = this.products = products.sort((x, y) => x.name > y.name ? 1 : -1);
    }));
    this.filteredTags$ = combineLatest([this.tagsCtrl.valueChanges, existingTags$]).pipe(
      map(([tag, tags]) => tag ? this.filterTags(tags, tag) : tags)
    );
  }

  private initRecipe(id: number) {
    if (id) {
      this.isNew = false;
      this.setRecipe(id);
    }
    else {
      this.currRecipe = {
        id: 0,
        title: '',
        ingredients: [],
        steps: [],
        tags: [],
      };
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const tag = event.value?.trim();

    if (tag) {
      this.currRecipe.tags.push({ id: 0, tag });
    }
    if (input) {
      input.value = '';
    }
    this.tagsCtrl.setValue(null);
  }

  selectTag(event: MatAutocompleteSelectedEvent): void {
    const tag = event.option?.viewValue?.toLocaleLowerCase();
    this.currRecipe.tags.push({ id: 0, tag });
    this.tagInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  private filterTags(tags: string[], tag: string): string[] {
    const check = new RegExp(tag?.trim(), 'i');
    return tags?.filter(t => check.test(t));
  }

  removeTag(tagIndex: number) {
    this.currRecipe.tags.splice(tagIndex, 1);
  }

  convertToNumber(input: any): number {
    const value = input.value;
    return +value || (value === '0' ? 0 : null);
  }

  addIngredient() {
    this.currRecipe.ingredients.push({
      id: 0,
      weight: 0,
      necessity: true,
      productId: null,
    });
  }

  filterMyProducts(name: string) {
    const check = new RegExp(name, 'i');
    this.filteredProducts = this.products.filter(x => check.test(x.name));
  }

  addStep() {
    this.currRecipe.steps.push({
      id: 0,
    });
  }

  removeStep(stepIndex: number) {
    const step = this.currRecipe.steps[stepIndex];
    const imageId = step?.image?.id || step?.imageId;
    if (imageId) {
      this.removedImages.push(imageId);
    }
    this.currRecipe.steps.splice(stepIndex, 1);
  }

  removeIngredient(ingredientIndex: number) {
    this.currRecipe.ingredients.splice(ingredientIndex, 1);
  }

  removeRecipeImage() {
    // const imageId = this.currRecipe.image?.id;
    // if (imageId) {
    //   this.removedImages.push(imageId);
    // }
    this.currRecipe.image = this.currRecipe.imageId = null;
  }

  removeStepImage(stepIndex: number) {
    const step = this.currRecipe.steps[stepIndex];
    // const imageId = step.image?.id || step.imageId;
    // if (imageId) {
    //   this.removedImages.push(imageId);
    // }
    step.image = step.image = null;
  }

  onCreate(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const id = 0;
    const recipe = {
      id,
      imageId: 0,
      title: this.currRecipe.title,
      description: this.currRecipe.description,
      image: this.currRecipe.image ? { ...this.currRecipe.image, id } : null,
      calories: this.currRecipe.calories,
      portions: this.currRecipe.portions,
      duration: this.currRecipe.duration,
      ingredients: this.currRecipe.ingredients?.map(x => ({ ...x, id })),
      ingredientsDescription: this.currRecipe.ingredientsDescription,
      steps: this.currRecipe.steps?.map(step => ({
        ...step,
        image: step.image ? { ...step.image, id } : null,
        imageId: 0,
        product: null,
        id,
      })),
      tags: this.currRecipe.tags?.map(x => ({ ...x, id })),
    };
    this.subscription.add(this.server.createRecipe(recipe)
      .subscribe(
        newId => {
          this.createNotification('Рецепт створен');
          this.router.navigate(['recipes', newId, 'edit']);
        },
        error => this.createNotification('Рецепт не створен', NotificationType.Error, 'Помилка при створенні рецепту')
      ));
  }

  onSave(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.subscription.add(this.server.editRecipe(this.currRecipe)
      .subscribe(
        x => this.createNotification('Рецепт оновлен'),
        _ => this.createNotification('Рецепт не оновлен', NotificationType.Error, 'Помилка при оновленні рецепту')
      ));
  }

  uploadStepImage(stepIndex: number, event: any) {
    const file = event?.target?.files[0];
    if (this.validateImage(file)) {
      this.subscription.add(this.imageService.transformFileToImage(file)
        .subscribe(image => this.currRecipe.steps[stepIndex].image = image));
    }
  }

  uploadRecipeImage(event: any) {
    const file = event?.target?.files[0];
    if (this.validateImage(file)) {
      this.subscription.add(this.imageService.transformFileToImage(file)
        .subscribe(image => this.currRecipe.image = image));
    }
  }

  private validateImage(file: File): boolean {
    if (!this.imageService.validateFileExtension(file)) {
      this.createNotification(
        this.imageService.defaultInvalidExtensionTitle,
        NotificationType.Error,
        this.imageService.defaultInvalidExtensionContent
      );
      return false;
    }
    if (!this.imageService.validateImageSize(file)) {
      this.createNotification(
        this.imageService.defaultInvalidSizeTitle,
        NotificationType.Error,
        this.imageService.defaultInvalidSizeContent
      );
      return false;
    }
    return true;
  }

  setRecipe(id: number) {
    this.subscription.add(this.server.getRecipeWithDetails(id).subscribe(recipe => {
      this.currRecipe = recipe;
    }));
  }

  openProduct(productId: number): void {
    const dialogRef = this.dialog.open(ProductDetailsDialogComponent, {
      width: '600px',
      data: { productId }
    });

    this.subscription.add(dialogRef.afterClosed().subscribe());
  }

  createNotification(title: string, type = NotificationType.Success, content: string = '') {
    this.notifications.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }
}
