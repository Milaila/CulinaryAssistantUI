import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ISignInModel } from 'src/app/models/server/sign-in-model';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formModel: ISignInModel = {
    login: '',
    password: ''
  };

  constructor(public userService: UserService,
              private authService: AuthService,
              private serverService: ServerHttpService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.serverService.signIn(this.formModel).subscribe(
      res => {
        this.authService.setToken(res.token);
        console.log(res);
        this.router.navigateByUrl('/home');
      },
      err => {
        if (err.status === 400) {
          alert('Incorrect user data!');
        }
        else if (err.status === 401){
          alert('Authenticate error');
        }
        else {
          alert('Server error');
        }
        console.log(err);
      }
    );
  }
}
