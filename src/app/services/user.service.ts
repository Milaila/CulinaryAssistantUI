import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  formModel: FormGroup = this.formBuilder.group({
    login: ['', Validators.required],
    email: ['', Validators.email],
    fullName: [''],
    passwords: this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    }, { validator: this.comparePasswords }),
  });

  comparePasswords(fg: FormGroup) {
    const confirmPswrdCtrl = fg.get('confirmPassword');
    if (confirmPswrdCtrl.errors === null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fg.get('password').value !== confirmPswrdCtrl.value) {
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      }
      else {
        confirmPswrdCtrl.setErrors(null);
      }
    }
  }

  register() {
    const body = {
      userName: this.formModel.value.userName,
      email: this.formModel.value.email,
      fullName: this.formModel.value.fullName,
      password: this.formModel.value.passwords.password,
    };
    return this.http.post('https://localhost:44351/api/auth/signup', body);
  }

  login(model: { userName: string, password: string}) {
    const body = {
      userName: model.userName,
      password: model.password,
    };
    return this.http.post('https://localhost:44351/api/auth/signin', body);
  }

  getUserProfile() {
    // const tokenHeader = new HttpHeaders({
    //   Authorization: `Bearer ${localStorage.getItem('token')}`
    // });
    return this.http.get('https://localhost:44351/api/profiles/current'); // , { headers: tokenHeader });
  }
}
