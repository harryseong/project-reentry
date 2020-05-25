import {Injectable, NgZone} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from '../../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private userService: UserService,
              private zone: NgZone) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
      Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userService.isAdmin$.value === true) {
      return true;
    } else {
      this.zone.run(() => this.router.navigate(['/', 'admin']));
      return false;
    }
  }

}
