import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.auth.isAuthorized) {
      this.router.navigateByUrl('/profiles/user/signup');
    }
    else {
      this.router.navigateByUrl('/profiles/user/signin');
    }
  }

}
