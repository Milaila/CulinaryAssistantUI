import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';
import { ServerHttpService } from '../services/server-http.service';
import { AuthService } from '../services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FiltersSearchSectionComponent } from './filters-search-section/filters-search-section.component';
import { IngredientsSearchSectionComponent } from './ingredients-search-section/ingredients-search-section.component';
import { TagsSearchSectionComponent } from './tags-search-section/tags-search-section.component';
import { LimitsSearchSectionComponent } from './limits-search-section/limits-search-section.component';
import { PreviewSearchSectionComponent } from './preview-search-section/preview-search-section.component';
import { ExpansionPanelComponent } from '../components/expansion-panel/expansion-panel.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from '../shared/material.module';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { FiltersService } from '../services/filters.service';
import { ProductDetailsDialogComponent } from '../products/product-details/product-details.component';
import { SharedModule } from '../shared/shared.module';
import { RecipeDetailsPageComponent } from './recipe-details-page/recipe-details-page.component';
import { RecipeDetailsDialogComponent } from './recipe-details-dialog/recipe-details-dialog.component';
// import { ImageDialogComponent } from '../components/image-dialog/image-dialog.component';


@NgModule({
  declarations: [
    RecipeDetailsComponent,
    RecipeSearchComponent,
    // ImageDialogComponent,
    RecipeListComponent,
    ExpansionPanelComponent,
    RecipeEditorComponent,
    FiltersSearchSectionComponent,
    IngredientsSearchSectionComponent,
    TagsSearchSectionComponent,
    LimitsSearchSectionComponent,
    PreviewSearchSectionComponent,
    MyRecipesComponent,
    RecipeDetailsPageComponent,
    RecipeDetailsDialogComponent,
  ],
  imports: [
    RecipesRoutingModule,
    SharedModule,
    // BrowserModule,
    CommonModule,
    // ReactiveFormsModule,
    // FormsModule,
    MaterialModule,
    HttpClientModule,
    // BrowserAnimationsModule,
  ],
  providers: [
    FiltersService
  ],
  entryComponents: [
    ProductDetailsDialogComponent
  ]
})
export class RecipesModule { }
