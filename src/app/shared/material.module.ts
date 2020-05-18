import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLineModule, MatOptionModule, MatCommonModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ukrainianPaginatorIntl } from './ukrainian-paginator-intl';

@NgModule({
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatTabsModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatLineModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatDialogModule,
    MatRadioModule,
    MatTooltipModule,
    MatCommonModule,
    MatTreeModule,
    MatDividerModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonModule,
    NgxMatSelectSearchModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  exports: [
    MatListModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatLineModule,
    MatOptionModule,
    MatRadioModule,
    MatCommonModule,
    MatTreeModule,
    MatDividerModule,
    MatToolbarModule,
    MatChipsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: ukrainianPaginatorIntl() }
  ]
})
export class MaterialModule { }
