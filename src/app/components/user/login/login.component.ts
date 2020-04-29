import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formModel = {
    userName: '',
    password: ''
  };

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.login(this.formModel).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        alert(res.token);
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
