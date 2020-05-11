import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwnTestComponent } from './components/own-test/own-test.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
// tslint:disable-next-line: max-line-length
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { CommonModule } from '@angular/common';
import { NewRecipeComponent } from './recipes/new-recipe/new-recipe.component';
import { UserComponent } from './components/user/user.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { UserService } from './services/user.service';
import { BaseService } from './services/base.service';
import { LoginComponent } from './components/user/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ServerHttpService } from './services/server-http.sevice';
import { MatLineModule, MatOptionModule, MatCommonModule } from '@angular/material/core';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ImagesService } from './services/images.service';

@NgModule({
  declarations: [
    AppComponent,
    OwnTestComponent,
    ImageUploadComponent,
    // NewRecipeComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    NotFoundComponent,
    // ExpansionPanelComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatLineModule,
    MatOptionModule,
    MatCommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatExpansionModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
  ],
  exports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    MatLineModule,
    MatOptionModule,
    MatCommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
  ],
  providers: [
    UserService,
    AuthService,
    ImagesService,
    ServerHttpService,
    BaseService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
