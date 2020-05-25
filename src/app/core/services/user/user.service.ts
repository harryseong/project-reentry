import { Injectable } from '@angular/core';
import {auth} from 'firebase';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FirestoreService} from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: BehaviorSubject<any> = new BehaviorSubject(null);
  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  afUserSubscription$: Subscription;

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
    this.afAuth.signInWithRedirect(new auth.GoogleAuthProvider())
      .then(() => this.confirmLoginStatus());
  }

  logout() {
    this.afAuth.signOut()
      .then(() => {
        this.user$.next(null);
        this.isAdmin$.next(null);
        this.router.navigate(['/', 'admin']);
        this.snackBarService.openSnackBar('You are now logged out.', 'OK', 3000);
      });
  }

  confirmLoginStatus() {
    this.afUserSubscription$ = this.afAuth.user.subscribe(rsp => {
      if (rsp != null && rsp.providerData != null && rsp.providerData.length > 0) {
        const email = rsp.providerData[0].email;
        this.user$.next(rsp.providerData[0]);
        this.checkIfUserExists(rsp);
        this.checkAdminStatus(email);
        this.snackBarService.openSnackBar('You are logged in.', 'OK', 3000);
      } else {
        console.warn('No provider data found in the afAuth.user response.')
      }
    });
  }

  checkAdminStatus(email: string) {
    const isAdmin = this.db.admins$.value.find(admin => admin.email === email) !== undefined;
    this.isAdmin$.next(isAdmin);
  }

  checkIfUserExists(afAuthUser: any) {
    this.db.users.doc(afAuthUser.email).ref.get()
      .then(userDoc => {
        if (!userDoc.exists) {
          this.saveNewUser(afAuthUser)
        }
      });
  }

  saveNewUser(afAuthUser: any) {
    const user = {
      name: afAuthUser.providerData[0].displayName,
      email: afAuthUser.providerData[0].email,
      role: 'user'
    };
    console.log('User does not exist in Firestore DB. Saving user: ' + JSON.stringify(user));
    this.db.users.doc(afAuthUser.email).set(user);
  }
}
