import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: '',
    component: ProfileDetailsComponent
  },
  {
    path: 'user', component: UserComponent,
    children: [
      {
        path: '',
        component: SignUpComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: 'signin',
        component: SignInComponent
      },
    ]
  },
  // {
  //   path: '',
  //   component: UserComponent
  // },
  // {
  //   path: 'signup',
  //   component: SignUpComponent
  // },
  // {
  //   path: 'signin',
  //   component: SignInComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
