import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {UserService} from '../../../core/services/user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isAdmin$ = null;

  constructor(private location: Location,
              private userService: UserService) {
    this.isAdmin$ = this.userService.isAdmin$;
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
