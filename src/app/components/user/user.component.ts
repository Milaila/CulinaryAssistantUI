import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  // formModel: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.formModel = this.fb.group({
    //   userName: [''],
    //   email: [''],
    //   fullName: [''],
    //   passwords: this.fb.group({
    //     password: [''],
    //     confirmPassword: [''],
    //   }),
    // });
  }

}
