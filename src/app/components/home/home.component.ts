import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userDetails: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private serverService: ServerHttpService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  onLogout() {
    this.authService.clearToken();
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
