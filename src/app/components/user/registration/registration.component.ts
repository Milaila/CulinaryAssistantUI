import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { error } from 'protractor';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    // this.userService.formModel.reset();
  }

  onSubmit() {
    this.userService.register().subscribe(
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
