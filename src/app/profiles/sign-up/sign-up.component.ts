import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerHttpService } from '../../services/server-http.service';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ISignUpModel } from 'src/app/models/server/sign-up-model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  checkSubs = new Subscription();
  subs = new Subscription();
  loginCtrl = this.formBuilder.control('', Validators.required);
  passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(4)]);
  confirmPswrdCtrl = this.formBuilder.control({ value: '', disabled: true },
    [Validators.required, Validators.minLength(4)]);
  hidePswrd = true;

  formModel: FormGroup = this.formBuilder.group({
    login: this.loginCtrl,
    email: ['', Validators.email],
    fullName: [''],
    passwords: this.formBuilder.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPswrdCtrl,
    }, { validator: this.comparePasswords }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private notifications: NotificationsService,
    private serverService: ServerHttpService,
    public auth: AuthService
  ) { }

  ngOnDestroy(): void {
    this.checkSubs.unsubscribe();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formModel.reset();
    this.subs.add(this.passwordCtrl.valueChanges.subscribe(password =>
      (!this.passwordCtrl?.errors && password)
        ? this.confirmPswrdCtrl.enable()
        : this.confirmPswrdCtrl.disable()
    ));
  }

  onSubmit(isAdmin = false) {
    this.getsignUpRequest(isAdmin).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.createNotification('Реєстрація пройшла успішно', '', NotificationType.Success);
        }
        else {
          this.createNotification('Помилка під час реєстрації');
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

  private getsignUpRequest(isAdmin: boolean): Observable<any> {
    const model: ISignUpModel = {
      login: this.formModel.value.login,
      email: this.formModel.value.email,
      fullName: this.formModel.value.fullName,
      password: this.formModel.value.passwords.password,
    };

    if (isAdmin && this.auth.isAdmin) {
      return this.serverService.signUpAdmin(model);
    }
    return this.serverService.signUp(model);
  }

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

  // get disableConfirmPassword(): boolean {
  //   return !(this.passwordCtrl?.errors && this.passwordCtrl.value);
  // }

  checkLogin() {
    const login = this.loginCtrl.value;
    if (login) {
      this.checkSubs = this.serverService.isLoginUnique(login)
        .subscribe(unique => this.loginCtrl.setErrors(unique ? null : { unique: true }));
    }
  }
}
