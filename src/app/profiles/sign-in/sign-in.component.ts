import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { ServerHttpService } from '../../services/server-http.service';
import { ISignInModel } from '../../models/server/sign-in-model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  formModel: ISignInModel = {
    login: '',
    password: ''
  };

  constructor(
    public userService: UserService,
    private authService: AuthService,
    private notifications: NotificationsService,
    private serverService: ServerHttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.serverService.signIn(this.formModel).subscribe(
      res => {
        this.authService.signIn(res);
        this.createNotification('Виконано вхід у систему', '', NotificationType.Success);
        this.router.navigateByUrl('/recipes');
      },
      err => {
        if (err.status === 400) {
          this.createNotification('Вхід не виконано', 'Некоректні дані');
        }
        else if (err.status === 401) {
          this.createNotification('Вхід не виконано', 'Неправильний логін чи пароль');
        }
        else {
          this.createNotification('Вхід не виконано', 'Помилка авторизації');
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
