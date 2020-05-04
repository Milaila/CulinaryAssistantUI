import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { error } from 'protractor';
import { ServerHttpService } from 'src/app/services/server-http.sevice';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(public userService: UserService, private serverService: ServerHttpService) { }

  ngOnInit(): void {
    // this.userService.formModel.reset();
  }

  onSubmit() {
    this.serverService.signUp({
      login: this.userService.formModel.value.login,
      email: this.userService.formModel.value.email,
      fullName: this.userService.formModel.value.fullName,
      password: this.userService.formModel.value.passwords.password,
    }).subscribe(
      (res: any) => {
        if (res.succeeded) {
          alert('Success');
          this.userService.formModel.reset();
        }
        else {
          res.errors.array.forEach(element => {
            alert(element.code);
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
