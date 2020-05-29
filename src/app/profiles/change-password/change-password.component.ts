import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { AuthService } from 'src/app/services/auth.service';
import { IChangePasswordModel } from 'src/app/models/server/change-password-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  subs = new Subscription();
  loginCtrl = this.formBuilder.control('', Validators.required);
  passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(4)]);
  confirmPswrdCtrl = this.formBuilder.control({ value: '', disabled: true },
    [Validators.required, Validators.minLength(4)]);
  hideNewPswrd = true;
  hideOldPswrd = true;

  formModel: FormGroup = this.formBuilder.group({
    login: this.loginCtrl,
    email: ['', Validators.email],
    oldPassword: ['', [Validators.required, Validators.minLength(4)]],
    newPassword: this.formBuilder.group({
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

  onSubmit() {
    const model: IChangePasswordModel = {
      login: this.formModel.value.login,
      email: this.formModel.value.email,
      newPassword: this.formModel.value.newPassword.password,
      oldPassword: this.formModel.value.oldPassword,
    };
    this.serverService.changePassword(model).subscribe(
      result => {
        if (result.succeeded) {
          this.createNotification('Пароль змінено', '', NotificationType.Success);
        }
      },
      error => {
        if (error.status === 403) {
          this.createNotification('Пароль не змінено', 'Для зміни паролю необхідно увійти в обліковий запис');
        }
        else {
          this.createNotification('Пароль не змінено', 'Некоректні дані');
        }
      }
    );
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

  // checkLogin() {
  //   const login = this.loginCtrl.value;
  //   if (login) {
  //     this.checkSubs = this.serverService.isLoginUnique(login)
  //       .subscribe(unique => this.loginCtrl.setErrors(unique ? null : { unique: true }));
  //   }
  // }
}
