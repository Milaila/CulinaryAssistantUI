import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ServerHttpService } from '../../services/server-http.service';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  checkSubs = new Subscription();
  loginCtrl = this.formBuilder.control('', Validators.required);
  formModel: FormGroup = this.formBuilder.group({
    login: this.loginCtrl,
    email: ['', Validators.email],
    fullName: [''],
    passwords: this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
    }, { validator: this.comparePasswords }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private notifications: NotificationsService,
    private serverService: ServerHttpService
  ) { }

  ngOnDestroy(): void {
    this.checkSubs.unsubscribe();
  }

  ngOnInit(): void {
    // this.userService.formModel.reset();
  }

  onSubmit() {
    this.serverService.signUp({
      login: this.formModel.value.login,
      email: this.formModel.value.email,
      fullName: this.formModel.value.fullName,
      password: this.formModel.value.passwords.password,
    }).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.formModel.reset();
          this.createNotification('Реєстрація пройшла успішно', '', NotificationType.Success);
        }
        else {
          this.createNotification('Помилка під час реєстрації');
          res.errors.array.forEach(err => {
            console.log(err);
          });
        }
      },
      err => {
        if (err.status === 400) {
          this.createNotification('Реєстрація провалена', 'Некоректні дані');
        }
        else {
          this.createNotification('Помилка під час реєстрації');
        }
      }
    );
  }



  // onSubm44it() {
  //   this.serverService.signIn(this.formModel).subscribe(
  //     res => {
  //       this.authService.signIn(res);
  //       this.createNotification('Успішна авторизація', '', NotificationType.Success);
  //       this.router.navigateByUrl('/home');
  //     },
  //     err => {
  //       if (err.status === 400) {
  //         this.createNotification('Вхід не виконан', 'Некоректні дані');
  //       }
  //       else if (err.status === 401) {
  //         this.createNotification('Вхід не виконан', 'Неправильний логін чи пароль');
  //       }
  //       else {
  //         this.createNotification('Вхід не виконан', 'Помилка авторизації');
  //       }
  //     }
  //   );
  // }

  createNotification(title: string, content: string = '', type = NotificationType.Error) {
    this.notifications.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }

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

  checkLogin() {
    const login = this.loginCtrl.value;
    if (login) {
      // this.checkSubs.unsubscribe();
      this.checkSubs = this.serverService.isLoginUnique(login)
        .subscribe(unique => this.loginCtrl.setErrors(unique ? null : { unique: true }));
    }
  }

  // register() {
  //   const body = {
  //     userName: this.formModel.value.userName,
  //     email: this.formModel.value.email,
  //     fullName: this.formModel.value.fullName,
  //     password: this.formModel.value.passwords.password,
  //   };
  //   return this.http.post('https://localhost:44351/api/auth/signup', body);
  // }

  // login(model: { userName: string, password: string}) {
  //   const body = {
  //     userName: model.userName,
  //     password: model.password,
  //   };
  //   return this.http.post('https://localhost:44351/api/auth/signin', body);
  // }

  // getUserProfile() {
  //   // const tokenHeader = new HttpHeaders({
  //   //   Authorization: `Bearer ${localStorage.getItem('token')}`
  //   // });
  //   return this.http.get('https://localhost:44351/api/profiles/current'); // , { headers: tokenHeader });
  // }
}
