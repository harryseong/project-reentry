import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../core/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user$ = null;
  isAdmin$ = null;

  constructor(private userService: UserService) {
    this.user$ = userService.user$;
    this.isAdmin$ = userService.isAdmin$;
  }

  ngOnInit() {
    this.userService.confirmLoginStatus();
  }

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout();
  }
}
