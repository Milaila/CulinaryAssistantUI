import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ServerHttpService } from './services/server-http.service';
import { MatLineModule, MatOptionModule, MatCommonModule } from '@angular/material/core';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ImagesService } from './services/images.service';
import { ImageDialogComponent } from './components/image-dialog/image-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { ProductsService } from './services/products.service';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent,
    ImageDialogComponent,
    ConfirmDialogComponent,
    // UserComponent,
    // RegistrationComponent,
    // LoginComponent,
    // HomeComponent
    // OwnTestComponent,
    // UserComponent,
    // RegistrationComponent,
    // LoginComponent,
    // HomeComponent,
    // HeaderComponent,
    // NotFoundComponent,
    // ImageDialogComponent,
    // ConfirmDialogComponent,
    // ExpansionPanelComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    SharedModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    ProductsService,
    ImagesService,
    ServerHttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
