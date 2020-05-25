import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAdmin$ = null;

  constructor(
    private userService: UserService) {
    this.isAdmin$ = this.userService.isAdmin$;
  }

  ngOnInit() {}
}
