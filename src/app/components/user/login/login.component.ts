import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ISignInModel } from 'src/app/models/server/sign-in-model';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

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
              private notifications: NotificationsService,
              private serverService: ServerHttpService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.serverService.signIn(this.formModel).subscribe(
      res => {
        this.authService.signIn(res);
        this.createNotification('Успішна авторизація', '', NotificationType.Success);
        this.router.navigateByUrl('/home');
      },
      err => {
        if (err.status === 400) {
          this.createNotification('Вхід не виконан', 'Некоректні дані');
        }
        else if (err.status === 401) {
          this.createNotification('Вхід не виконан', 'Неправильний логін чи пароль');
        }
        else {
          this.createNotification('Вхід не виконан', 'Помилка авторизації');
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
}
