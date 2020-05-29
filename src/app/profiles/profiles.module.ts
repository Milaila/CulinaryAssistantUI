import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';

import { HttpClientModule } from '@angular/common/http';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user/user.component';
import { MaterialModule } from '../shared/material.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
// import { AuthService } from 'app/services/auth.service';


@NgModule({
  declarations: [
    ProfileDetailsComponent,
    SignUpComponent,
    SignInComponent,
    ProfileEditorComponent,
    UserComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ProfilesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  // providers: [
  //   AuthService
  // ]
})
export class ProfilesModule { }
