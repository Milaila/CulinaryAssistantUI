import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { ImageDialogComponent } from '../components/image-dialog/image-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ExpansionPanelComponent } from '../components/expansion-panel/expansion-panel.component';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  // declarations: [
  //   OwnTestComponent,
  //   HeaderComponent,
  //   NotFoundComponent,
  //   ImageDialogComponent,
  //   ConfirmDialogComponent,
  //   ExpansionPanelComponent
  // ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SharedModule { }
