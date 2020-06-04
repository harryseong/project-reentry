import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {BehaviorSubject} from 'rxjs';
import {Org} from '../../../shared/interfaces/org';
import {OrgService} from '../org/org.service';
import * as moment from 'moment';
import {LocalStorageService} from "../local-storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  allOrgs$ = new BehaviorSubject(null);
  currentOrg$ = new BehaviorSubject(null);
  languages$ = new BehaviorSubject(null);
  serviceCategories$ = new BehaviorSubject(null);
  admins$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  users$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  organizations: AngularFirestoreCollection<any>;
  serviceCategories: AngularFirestoreCollection<any>;
  languages: AngularFirestoreCollection<any>;
  counties: AngularFirestoreCollection<any>;
  users: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore,
              private localStorageService: LocalStorageService,
              private ngZone: NgZone,
              private orgService: OrgService,
              private router: Router,
              private snackBarService: SnackBarService) {
    this.organizations = db.collection<any>('organizations');
    this.serviceCategories = db.collection<any>('serviceCategories');
    this.counties = db.collection<any>('counties');
    this.languages = db.collection<any>('languages');
    this.users = db.collection<any>('users');
  }

  /**
   * Sort an array of objects according to the defined parameter.
   * @param objectArray: Array of objects to sort.
   * @param parameter: String name of parameter by which to sort array of objects.
   */
  _sort(objectArray: any[], parameter: string): string[] {
    return Object.assign([], objectArray)
      .sort((a, b) => (a[parameter] > b[parameter]) ? 1 : ((b[parameter] > a[parameter] ? -1 : 0)));
  }

  getAllOrgs() {
    const localStorageOrgs = this.localStorageService.getItem('orgs');
    if (localStorageOrgs === null) {
      this.getAllOrgsFromFirestore();
      console.log('Fetched all orgs from Firestore and saved in local storage.')
    } else {
      const expiry = localStorageOrgs.expiry;
      const now = new Date().getTime();
      if (expiry !== null && expiry !== undefined) {
        if (now < expiry) {
          this.allOrgs$.next(localStorageOrgs.orgs);
          console.log('Fetched orgs from local storage.')
        } else {
          this.getAllOrgsFromFirestore();
          console.log('Local storage orgs expired. Fetched all orgs from Firestore and saved in local storage.')
        }
      } else {
        this.getAllOrgsFromFirestore();
        console.log('Expiry not found on local storage orgs. Fetched all orgs from Firestore and saved in local storage.')
      }
    }
  }

  getAllOrgsFromFirestore() {
    this.organizations.get().toPromise()
      .then(querySnapshot => {
        const sortedOrgs = this._sort(querySnapshot.docs.map(doc => doc.data()), 'name');
        this.allOrgs$.next(sortedOrgs);
        this.localStorageService.setItem('orgs', {orgs: sortedOrgs, expiry: this.setExpiry()});
      })
      .catch(err => this.snackBarService.openSnackBar('Something went wrong. Please refresh the page.', 'OK'));
  }

  setExpiry() {
    const ttl = 86400000; // One day.
    return (new Date().getTime() + ttl);
  }

  addToAllOrgs(org: Org) {
    const allOrgs = this.allOrgs$.value;
    allOrgs.push(org);
    this.allOrgs$.next(this._sort(allOrgs, 'name'));
  }

  getAllAdmins() {
    const adminsRef = this.users.ref.where('role', '==', 'admin');
    adminsRef.get()
      .then(querySnapshot => querySnapshot.docs.map(doc => doc.data()))
      .then(admins => this.admins$.next(admins))
      .catch(err => this.snackBarService.openSnackBar('Something went wrong. Please refresh the page.', 'OK'));
  }

  getAllUsers() {
    this.users.get().toPromise()
      .then(querySnapshot => {
        const sortedUsers = this._sort(querySnapshot.docs.map(doc => doc.data()), 'name');
        this.users$.next(sortedUsers);
      })
      .catch(err => this.snackBarService.openSnackBar('Something went wrong. Please refresh the page.', 'OK'));
  }

  updateUserRole(user) {
    const userDoc = this.users.doc(user.email);
    userDoc.get().toPromise()
      .then(doc => {
          userDoc.set({
            email: doc.data().email,
            name: user.name,
            role: (user.role === 'user' ? 'admin' : 'user')
          })
            .then(() => {
              this.users$.next(this.users$.value.map(u => {
                if (u.email === user.email) {
                  u.role = u.role === 'admin' ? 'user' : 'admin';
                }
                return u;
              }));
              this.snackBarService.openSnackBar('Role updated successfully.', 'OK', 3000);
            })
            .catch(() => this.snackBarService.openSnackBar('Something went wrong. Please refresh and try again.', 'OK'))
        }
      );
  }

  getAllLanguages() {
    this.languages.get().toPromise()
      .then(querySnapshot => {
        const sortedLanguages = this._sort(querySnapshot.docs.map(doc => doc.data()), 'language');
        this.languages$.next(sortedLanguages);
      })
  }

  // Run this once when Home component initiated.
  getAllServiceCategories() {
    this.serviceCategories.get().toPromise()
      .then(querySnapshot => {
        const sortedServiceCategories = this._sort(querySnapshot.docs.map(doc => doc.data()), 'name');
        this.serviceCategories$.next(sortedServiceCategories);
      })
      .catch(err => this.snackBarService.openSnackBar('Something went wrong. Please refresh the page.', 'OK'));
  }

  /**
   * Find single organization from allOrgs$ and store in currentOrg$.
   * @param orgCity: String city of organization.
   * @param orgName: String name of organization.
   */
  getOrg(orgCity: string, orgName: string) {
    this.currentOrg$.next(this.allOrgs$.value.find(org => org.address.city === orgCity && org.name === orgName));
  }

  getOrgsByServiceCategories(serviceCategories: any[]) {
    const allOrgs = this.allOrgs$.value;
    return serviceCategories.includes('All Services') ?
      allOrgs : allOrgs.filter(org => org.services.some(sc => serviceCategories.includes(sc)));
  }

  saveOrg(org: Org) {
    this.organizations.add(org)
      .then(() => {
        console.log('New organization was successfully saved: ' + org.name);
        this.orgService.updateOrgSaveSuccessCount();
      })
      .catch(err => {
        console.error('Error saving organization: ' + org.name);
        console.error('Error: ' + err);
      });
  }

  saveOrgFromForm(org: Org, showSnackBar: boolean) {
    this.organizations.add(org)
      .then(() => {
        this.currentOrg$.next(org);
        this.addToAllOrgs(org);

        this.ngZone.run(() => {
          if (showSnackBar === true) {
            const message = 'New org saved successfully: ' + org.name;
            const action = 'OK';
            this.snackBarService.openSnackBar(message, action, 3000);
          }
          this.router.navigate(['/', 'admin', 'orgs']);
        });
      });
  }

  updateOrg(org: Org, originalOrgCity: string, originalOrgName: string, showSnackBar: boolean) {
    const query = this.organizations.ref.where('address.city', '==', originalOrgCity).where('name', '==', originalOrgName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('No org documents found with city and name: ' + org.address.city + ', ' + org.name);
      } else {
        querySnapshot.forEach(docSnapshot => this.organizations.doc(docSnapshot.id).set(org));
        this.currentOrg$.next(org);
        this.allOrgs$.next(this.allOrgs$.value.map(o => {
          if (o.address.city === originalOrgCity && o.name === originalOrgName) {
            return org;
          } else {
            return o;
          }
        }));

        this.ngZone.run(() => {
          if (showSnackBar === true) {
            const message = 'Org updated successfully: ' + org.name;
            const action = 'OK';
            this.snackBarService.openSnackBar(message, action, 3000);
          }
          this.router.navigate(['/', 'admin', 'orgs', 'view', org.address.city, org.name]);
        });
      }
    });
  }

  deleteOrg(orgCity: string, orgName: string, showSnackBar: boolean) {
    const query = this.organizations.ref.where('address.city', '==', orgCity).where('name', '==', orgName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('No org documents found with city and name: ' + orgCity + ', ' + orgName);
      } else {
        querySnapshot.forEach(docSnapshot => this.organizations.doc(docSnapshot.id).delete());
        this.allOrgs$.next(this.allOrgs$.value.filter(org => {
          return !(org.address.city === orgCity && org.name === orgName);
        }));

        this.ngZone.run(() => {
          if (showSnackBar === true) {
            const message = 'Org deleted successfully: ' + orgName;
            const action = 'OK';
            this.snackBarService.openSnackBar(message, action, 3000);
          }
          this.router.navigate(['/admin/orgs']);
        });
      }
    });
  }

  /**
   * Update view count of the service category whenever user visits service category page.
   * @param serviceCategoryName: String name of service category.
   */
  updateServiceCategoryViewCount(serviceCategoryName: string) {
    const year = moment().year();
    const month = moment().month() + 1;
    const day = moment().date();

    const query = this.serviceCategories.ref.where('name', '==', serviceCategoryName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.warn('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => {
          const id = docSnapshot.id;
          const data = docSnapshot.data();

          const incrementCount = () => {
            if (data.viewData === undefined || data.viewData === null) {
              data.viewData = {};
            }

            if (data.viewData[year] !== undefined) {

              if (data.viewData[year][month] !== undefined) {

                if (data.viewData[year][month][day] !== undefined) {
                  data.viewData[year][month][day]++;
                } else {
                  // Create entry and set count to 1.
                  data.viewData[year][month][day] = 1;
                }
              } else {
                // Create entry and set count to 1.
                data.viewData[year][month] = {};
                data.viewData[year][month][day] = 1;
              }
            } else {
              // If year does not exist, create year entry.
              data.viewData[year] = {};
              data.viewData[year][month] = {};
              data.viewData[year][month][day] = 1;
            }

            this.serviceCategories.doc(id).set(data);
          };

          incrementCount();
        });
      }
    });
  }

  /**
   * Update view count of the organization whenever user visits organization page.
   * @param orgName: String name of organization.
   */
  updateOrgViewCount(org: Org) {
    const year = moment().year();
    const month = moment().month() + 1;
    const day = moment().date();

    const query = this.organizations.ref.where('address.city', '==', org.address.city).where('name', '==', org.name);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => {
          const id = docSnapshot.id;
          const data = docSnapshot.data();

          const incrementCount = () => {
            if (data.viewData === undefined || data.viewData === null) {
              data.viewData = {};
            }

            if (data.viewData[year] !== undefined) {

              if (data.viewData[year][month] !== undefined) {

                if (data.viewData[year][month][day] !== undefined) {
                  data.viewData[year][month][day]++;
                } else {
                  // Create entry and set count to 1.
                  data.viewData[year][month][day] = 1;
                }
              } else {
                // Create entry and set count to 1.
                data.viewData[year][month] = {};
                data.viewData[year][month][day] = 1;
              }
            } else {
              // If year does not exist, create year entry.
              data.viewData[year] = {};
              data.viewData[year][month] = {};
              data.viewData[year][month][day] = 1;
            }
            this.organizations.doc(id).set(data);
          };

          incrementCount();
        });
      }
    });
  }
}
