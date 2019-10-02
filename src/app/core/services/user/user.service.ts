import { Injectable } from '@angular/core';
import {auth} from 'firebase';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';
import {FirestoreService} from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$ = new BehaviorSubject(null);
  isAdmin$ = new BehaviorSubject(null);

  constructor(private afAuth: AngularFireAuth,
              private db: FirestoreService,
              private router: Router,
              private snackBarService: SnackBarService) {
    afAuth.user.subscribe(user => {
      if (user !== null) {
        this.user$.next(user);
      }
    });
  }

  login() {
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
      .then(() => this.confirmLoginStatus());
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.user$.next(null);
        this.isAdmin$.next(null);
        this.router.navigateByUrl('');
        this.snackBarService.openSnackBar('You are now logged out.', 'OK', 3000);
      });
  }

  confirmLoginStatus() {
    this.afAuth.auth.getRedirectResult()
      .then(result => {
        console.log('LOGGED IN USER:');
        console.log(JSON.stringify(result));
        if (result.user !== null) {
          this.user$.next(result.user);
          this.isAdmin$.next(this.db.admins$.value.find(admin => admin.email === result.user.email) !== null);
          this.snackBarService.openSnackBar('You are logged in.', 'OK', 3000);
          this.router.navigate(['/', 'admin']);
        }
      });
  }

}
