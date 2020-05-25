import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {BehaviorSubject} from 'rxjs';
import {Org} from '../../../shared/interfaces/org';
import {OrgService} from '../org/org.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  allOrgs$ = new BehaviorSubject(null);
  currentOrg$ = new BehaviorSubject(null);
  serviceCategories$ = new BehaviorSubject(null);
  admins$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  organizations: AngularFirestoreCollection<any>;
  serviceCategories: AngularFirestoreCollection<any>;
  languages: AngularFirestoreCollection<any>;
  counties: AngularFirestoreCollection<any>;
  users: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore,
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

  // Run this once when Home component initiated.
  getAllOrgs() {
    this.organizations.get().toPromise()
      .then(querySnapshot => {
        const sortedOrgs = this._sort(querySnapshot.docs.map(doc => doc.data()), 'name');
        this.allOrgs$.next(sortedOrgs);
      })
      .catch(err => this.snackBarService.openSnackBar('Something went wrong. Please refresh the page.', 'OK'));
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

  saveOrgFromForm(orgForm: any, showSnackBar: boolean) {
    this.organizations.add(orgForm.value)
      .then(() => {
        console.log('New organization was successfully saved: ' + orgForm.get('name').value);
        if (showSnackBar === true) {
          const message = 'New organization was successfully saved.';
          const action = 'OK';
          this.snackBarService.openSnackBar(message, action, 4000);
          this.router.navigate(['/', 'admin', 'orgs']);
        }
      });
  }

  updateOrg(orgForm: any, originalOrgName: string, showSnackBar: boolean) {
    const query = this.organizations.ref.where('name', '==', originalOrgName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => this.organizations.doc(docSnapshot.id).set(orgForm.value));
        this.router.navigate(['/', 'admin', 'organization', 'view', orgForm.get('name').value]);
      }
    });
    console.log('Organization was successfully updated: ' + orgForm.get('name').value);
    if (showSnackBar === true) {
      const message = 'Organization was successfully updated.';
      const action = 'OK';
      this.snackBarService.openSnackBar(message, action, 4000);
    }
  }

  deleteOrg(orgCity: string, orgName: string, showSnackBar: boolean) {
    const query = this.organizations.ref.where('address.city', '==', orgCity).where('name', '==', orgName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('No documents found');
      } else {
        querySnapshot.forEach(docSnapshot => this.organizations.doc(docSnapshot.id).delete());
        console.log('Organization was deleted: ' + orgName);
        this.router.navigate(['/admin/orgs']);

        if (showSnackBar === true) {
          const message = orgName + ' has been deleted.';
          const action = 'OK';
          this.snackBarService.openSnackBar(message, action);
        }
      }
    });
  }

  /**
   * Update view count of the service category whenever user visits service category page.
   * @param serviceCategory: String name of service category.
   */
  updateServiceCategoryViewCount(serviceCategory: string) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const query = this.serviceCategories.ref.where('name', '==', serviceCategory);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.warn('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => {
          const id = docSnapshot.id;
          const data = docSnapshot.data();
          const incrementCount = () => {
            if (data.viewData[year] !== undefined) {
              if (data.viewData[year][month] !== undefined) {
                // Increment count for year-month.
                data.viewData[year][month]++;
              } else {
                // Create month entry and set count to 0.
                data.viewData[year][month] = 1;
              }
              // Update data on Firebase.
              this.serviceCategories.doc(id).set(data);
            } else {
              // If year does not exist, create year entry.
              data.viewData[year] = {};
              this.serviceCategories.doc(id).set(data).then(() => {
                // Create month entry and set count to 0.
                data.viewData[year][month] = 1;
                // Update data on Firebase.
                this.serviceCategories.doc(id).set(data);
              });
            }
          };
          if (data.viewData !== undefined) {
            incrementCount();
          } else {
            data.viewData = {};
            this.serviceCategories.doc(id).set(data).then(() => {
              incrementCount();
            });
          }
        });
      }
    });
  }

  /**
   * Update view count of the organization whenever user visits organization page.
   * @param orgName: String name of organization.
   */
  updateOrgViewCount(orgName: string) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const query = this.organizations.ref.where('name', '==', orgName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => {
          const id = docSnapshot.id;
          const data = docSnapshot.data();
          const incrementCount = () => {
            if (data.viewData[year] !== undefined) {
              if (data.viewData[year][month] !== undefined) {
                // Increment count for year-month.
                data.viewData[year][month]++;
              } else {
                // Create month entry and set count to 0.
                data.viewData[year][month] = 1;
              }
              // Update data on Firebase.
              this.organizations.doc(id).set(data);
            } else {
              // If year does not exist, create year entry.
              data.viewData[year] = {};
              this.organizations.doc(id).set(data).then(() => {
                // Create month entry and set count to 0.
                data.viewData[year][month] = 1;
                // Update data on Firebase.
                this.organizations.doc(id).set(data);
              });
            }
          };
          if (data.viewData !== undefined && data.viewData !== null) {
            incrementCount();
          } else {
            data.viewData = {};
            this.organizations.doc(id).set(data).then(() => {
              incrementCount();
            });
          }
        });
      }
    });
  }

  /**
   * Get a list of all admins.
   */
  getAllAdmins() {
    const adminsRef = this.users.ref.where('role', '==', 'admin');
    adminsRef.get()
      .then(querySnapshot => querySnapshot.docs.map(doc => doc.data()))
      .then(admins => this.admins$.next(admins))
      .catch(err => this.snackBarService.openSnackBar('Something went wrong. Please refresh the page.', 'OK'));
  }
}
