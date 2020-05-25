import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/services/user/user.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user$: BehaviorSubject<any>;
  isAdmin$: BehaviorSubject<boolean>;

  constructor(private userService: UserService) {
    this.user$ = userService.user$;
    this.isAdmin$ = userService.isAdmin$;
  }

  ngOnInit() {
    // Only confirm login status if user and admin status has not yet been determined.
    if (this.user$.value == null || this.isAdmin$.value == null) {
      this.userService.confirmLoginStatus();
    }
  }

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout();
  }
}
