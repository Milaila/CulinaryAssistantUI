import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';
import { AuthUtils } from 'src/app/shared/auth-utils';
import { ServerHttpService } from 'src/app/services/server-http.sevice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userDetails: any;

  constructor(private router: Router, private serverService: ServerHttpService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  onLogout() {
    AuthUtils.clearToken();
    this.router.navigate(['/user/login']);
  }

  getUserProfile() {
    this.serverService.getCurrentProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        alert('Get profile ERROR');
      }
    );
  }
}
