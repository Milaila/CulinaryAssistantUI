import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeEditorComponent } from './recipe-editor/recipe-editor.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { ServerHttpService } from '../services/server-http.sevice';
import { AuthService } from '../services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLineModule, MatOptionModule, MatCommonModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FiltersSearchSectionComponent } from './filters-search-section/filters-search-section.component';
import { IngredientsSearchSectionComponent } from './ingredients-search-section/ingredients-search-section.component';
import { TagsSearchSectionComponent } from './tags-search-section/tags-search-section.component';
import { LimitsSearchSectionComponent } from './limits-search-section/limits-search-section.component';
import { PreviewSearchSectionComponent } from './preview-search-section/preview-search-section.component';
import { ExpansionPanelComponent } from '../components/expansion-panel/expansion-panel.component';


@NgModule({
  declarations: [
    RecipeDetailsComponent,
    RecipeSearchComponent,
    RecipeListComponent,
    NewRecipeComponent,
    ExpansionPanelComponent,
    RecipeEditorComponent,
    FiltersSearchSectionComponent,
    IngredientsSearchSectionComponent,
    TagsSearchSectionComponent,
    LimitsSearchSectionComponent,
    PreviewSearchSectionComponent,
  ],
  imports: [
    RecipesRoutingModule,
    // BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatLineModule,
    MatOptionModule,
    MatRadioModule,
    MatCommonModule,
    MatTreeModule,
    MatDividerModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    // BrowserAnimationsModule,
  ],
  // providers: [
  //   ServerHttpService,
  //   AuthService,
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true
  //   }
  // ],
})
export class RecipesModule { }
