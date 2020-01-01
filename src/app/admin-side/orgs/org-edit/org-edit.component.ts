import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../../../core/services/firestore/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import {UserService} from '../../../core/services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {GoogleMapsService} from '../../../core/services/google-maps/google-maps.service';
import {Constants} from '../../../shared/constants/constants';
import {SubscribeErrorStateMatcher} from '../../../shared/classes/subscribe-error-state-matcher';
import {Subscription} from 'rxjs';
import {DialogService} from '../../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition('* => fadeIn', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ])
    ])
  ]
})
export class OrgEditComponent implements OnInit, OnDestroy {
  languagesSubscription$: Subscription;
  serviceCategoriesSubscription$: Subscription;

  matcher: SubscribeErrorStateMatcher; // For form error matching.
  orgForm: FormGroup;
  serviceCategories: any[] = [];
  languages: any[] = [];
  orgName = '';
  orgCity = '';
  org: any = null;
  daysOfWeek = Constants.DAYS_OF_WEEK;
  transition = '';
  pageReady = false;
  paymentOptions = Constants.PAYMENT_OPTIONS;

  constructor(private firestoreService: FirestoreService,
              public dialog: MatDialog,
              private dialogService: DialogService,
              private userService: UserService,
              private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private googleMapsService: GoogleMapsService) { }

  ngOnInit() {
    this.languagesSubscription$ = this.firestoreService.languages.valueChanges()
      .subscribe(rsp => this.languages = this.firestoreService._sort(rsp, 'language'));
    this.serviceCategoriesSubscription$ = this.firestoreService.serviceCategories.valueChanges()
      .subscribe(rsp => this.serviceCategories = this.firestoreService._sort(rsp, 'name'));

    this.orgCity = this.route.snapshot.params.city;
    this.orgName = this.route.snapshot.params.name;
    const query = this.firestoreService.organizations.ref.where('name', '==', this.orgName);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.warn('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => {
          this.firestoreService.organizations.doc(docSnapshot.id).ref.get().then(
            org => {
              this.org = org.data();
              this.orgForm = new FormGroup({
                name: new FormControl(this.org.name, [Validators.required]),
                description: new FormControl(this.org.description),
                services: new FormControl(this.org.services, [Validators.required]),
                hours: new FormGroup({
                  specifyHours: new FormControl(this.org.hours.specifyHours),
                  sunday: new FormGroup({
                    open: new FormControl(this.org.hours.sunday.open),
                    start: new FormControl(this.org.hours.sunday.start),
                    end: new FormControl(this.org.hours.sunday.end)
                  }),
                  monday: new FormGroup({
                    open: new FormControl(this.org.hours.monday.open),
                    start: new FormControl(this.org.hours.monday.start),
                    end: new FormControl(this.org.hours.monday.end)
                  }),
                  tuesday: new FormGroup({
                    open: new FormControl(this.org.hours.tuesday.open),
                    start: new FormControl(this.org.hours.tuesday.start),
                    end: new FormControl(this.org.hours.tuesday.end)
                  }),
                  wednesday: new FormGroup({
                    open: new FormControl(this.org.hours.wednesday.open),
                    start: new FormControl(this.org.hours.wednesday.start),
                    end: new FormControl(this.org.hours.wednesday.end)
                  }),
                  thursday: new FormGroup({
                    open: new FormControl(this.org.hours.thursday.open),
                    start: new FormControl(this.org.hours.thursday.start),
                    end: new FormControl(this.org.hours.thursday.end)
                  }),
                  friday: new FormGroup({
                    open: new FormControl(this.org.hours.friday.open),
                    start: new FormControl(this.org.hours.friday.start),
                    end: new FormControl(this.org.hours.friday.end)
                  }),
                  saturday: new FormGroup({
                    open: new FormControl(this.org.hours.saturday.open),
                    start: new FormControl(this.org.hours.saturday.start),
                    end: new FormControl(this.org.hours.saturday.end)
                  }),
                }),
                address: new FormGroup({
                  streetAddress1: new FormControl(this.org.address.streetAddress1, [Validators.required]),
                  streetAddress2: new FormControl(this.org.address.streetAddress2),
                  city: new FormControl(this.org.address.city, [Validators.required]),
                  state: new FormControl(this.org.address.state, [Validators.required]),
                  zipCode: new FormControl(this.org.address.zipCode, [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]),
                  gpsCoords: new FormGroup({
                    lat: new FormControl(''),
                    lng: new FormControl(''),
                  })
                }),
                website: new FormControl(this.org.website, [
                  Validators.pattern('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')
                ]),
                contact: new FormGroup({
                  name: new FormControl(this.org.contact.name),
                  email: new FormControl(this.org.contact.email, [Validators.email]),
                  phone: new FormControl(this.org.contact.phone,
                    [Validators.pattern('^\\(?([0-9]{3})\\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$')]),
                }),
                languages: new FormControl(this.org.languages),
                payment: new FormControl(this.org.payment),
                transportation: new FormControl(this.org.transportation),
                seniorRequirements: new FormControl(this.org.seniorRequirements),
                eligibilityRequirements: new FormControl(this.org.eligibilityRequirements),
                bringWithYou: new FormControl(this.org.bringWithYou),
                additionalNotes: new FormControl(this.org.additionalNotes)
              });
              this.daysOfWeek.forEach(day => {
                this.toggleDay(day);
              });
              this.pageReady = true;
              this.transition = 'fadeIn';
            });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.languagesSubscription$.unsubscribe();
    this.serviceCategoriesSubscription$.unsubscribe();
  }

  specifyHours() {
    const hoursFormGroup = this.orgForm.get('hours');
    const specifyHours = this.orgForm.get('specifyHours').value;
    if (specifyHours === true) {
      this.daysOfWeek.forEach(day => {
        hoursFormGroup.get(day).get('open').setValue(true);
        this.toggleDay(day);
      });
    } else {
      this.daysOfWeek.forEach(day => {
        hoursFormGroup.get(day).get('open').setValue(false);
        this.toggleDay(day);
      });
    }
  }

  toggleDay(day: string) {
    const dayFormGroup = this.orgForm.get('hours').get(day);
    if (dayFormGroup.get('open').value === true) {
      dayFormGroup.get('start').enable();
      dayFormGroup.get('end').enable();
    } else {
      dayFormGroup.get('start').reset();
      dayFormGroup.get('start').disable();
      dayFormGroup.get('end').reset();
      dayFormGroup.get('end').disable();
    }
  }

  editLanguages(): void {
    this.dialogService.openEditLanguagesDialog(this.languages);
  }

  editServiceCategories(): void {
    this.dialogService.openEditServiceCategoriesDialog(this.serviceCategories);
  }

  onSubmit() {
    const ac = this.orgForm.get('address');
    const fullAddress = ac.get('streetAddress1').value + ' ' + ac.get('streetAddress2').value +  ', ' +
      ac.get('city').value + ', ' + ac.get('state').value;
    // this.googleMapsService.codeAddressAndUpdate(fullAddress, this.orgName, this.orgForm);
  }
}
