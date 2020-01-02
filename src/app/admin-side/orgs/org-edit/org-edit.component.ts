import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../../../core/services/firestore/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import {UserService} from '../../../core/services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {GoogleMapsService} from '../../../core/services/google-maps/google-maps.service';
import {Constants} from '../../../shared/constants/constants';
import {SubscribeErrorStateMatcher} from '../../../shared/classes/subscribe-error-state-matcher';
import {BehaviorSubject, Subscription} from 'rxjs';
import {DialogService} from '../../../core/services/dialog/dialog.service';
import {Org} from '../../../shared/interfaces/org';
declare var google: any;

@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ])
    ])
  ]
})
export class OrgEditComponent implements OnInit, OnDestroy, AfterViewInit {
  currentOrg$: BehaviorSubject<Org> = null;
  languagesSubscription$: Subscription;
  serviceCategoriesSubscription$: Subscription;
  matcher: SubscribeErrorStateMatcher; // For form error matching.
  orgForm: FormGroup = null;
  serviceCategories: any[] = [];
  languages: any[] = [];
  daysOfWeek = Constants.DAYS_OF_WEEK;
  paymentOptions = Constants.PAYMENT_OPTIONS;

  constructor(private firestoreService: FirestoreService,
              public dialog: MatDialog,
              private dialogService: DialogService,
              private userService: UserService,
              private zone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private googleMapsService: GoogleMapsService) {
    this.currentOrg$ = firestoreService.currentOrg$;
  }

  ngOnInit() {
    this.languagesSubscription$ = this.firestoreService.languages.valueChanges()
      .subscribe(rsp => this.languages = this.firestoreService._sort(rsp, 'language'));
    this.serviceCategoriesSubscription$ = this.firestoreService.serviceCategories.valueChanges()
      .subscribe(rsp => this.serviceCategories = this.firestoreService._sort(rsp, 'name'));
    this.daysOfWeek.forEach(day => {
      this.toggleDay(day);
    });
    this.loadOrg();

    this.currentOrg$.subscribe(org => {
      this.orgForm = new FormGroup({
        name: new FormControl(org.name, [Validators.required]),
        description: new FormControl(org.description),
        services: new FormControl(org.services, [Validators.required]),
        hours: new FormGroup({
          specifyHours: new FormControl(org.hours.specifyHours),
          sunday: new FormGroup({
            open: new FormControl(org.hours.sunday.open),
            start: new FormControl(org.hours.sunday.start),
            end: new FormControl(org.hours.sunday.end)
          }),
          monday: new FormGroup({
            open: new FormControl(org.hours.monday.open),
            start: new FormControl(org.hours.monday.start),
            end: new FormControl(org.hours.monday.end)
          }),
          tuesday: new FormGroup({
            open: new FormControl(org.hours.tuesday.open),
            start: new FormControl(org.hours.tuesday.start),
            end: new FormControl(org.hours.tuesday.end)
          }),
          wednesday: new FormGroup({
            open: new FormControl(org.hours.wednesday.open),
            start: new FormControl(org.hours.wednesday.start),
            end: new FormControl(org.hours.wednesday.end)
          }),
          thursday: new FormGroup({
            open: new FormControl(org.hours.thursday.open),
            start: new FormControl(org.hours.thursday.start),
            end: new FormControl(org.hours.thursday.end)
          }),
          friday: new FormGroup({
            open: new FormControl(org.hours.friday.open),
            start: new FormControl(org.hours.friday.start),
            end: new FormControl(org.hours.friday.end)
          }),
          saturday: new FormGroup({
            open: new FormControl(org.hours.saturday.open),
            start: new FormControl(org.hours.saturday.start),
            end: new FormControl(org.hours.saturday.end)
          }),
        }),
        address: new FormGroup({
          streetAddress1: new FormControl(org.address.streetAddress1, [Validators.required]),
          streetAddress2: new FormControl(org.address.streetAddress2),
          city: new FormControl(org.address.city, [Validators.required]),
          state: new FormControl(org.address.state, [Validators.required]),
          zipCode: new FormControl(org.address.zipCode, [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]),
          gpsCoords: new FormGroup({
            lat: new FormControl(''),
            lng: new FormControl(''),
          })
        }),
        formattedAddress: new FormControl(org.formattedAddress),
        website: new FormControl(org.website, [
          Validators.pattern('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')
        ]),
        contact: new FormGroup({
          name: new FormControl(org.contact.name),
          email: new FormControl(org.contact.email, [Validators.email]),
          phone: new FormControl(org.contact.phone,
            [Validators.pattern('^\\(?([0-9]{3})\\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$')]),
        }),
        languages: new FormControl(org.languages),
        payment: new FormControl(org.payment),
        transportation: new FormControl(org.transportation),
        seniorRequirements: new FormControl(org.seniorRequirements),
        eligibilityRequirements: new FormControl(org.eligibilityRequirements),
        bringWithYou: new FormControl(org.bringWithYou),
        additionalNotes: new FormControl(org.additionalNotes)
      });
      this.daysOfWeek.forEach(day => {
        this.toggleDay(day);
      });
    });
  }

  ngOnDestroy(): void {
    this.languagesSubscription$.unsubscribe();
    this.serviceCategoriesSubscription$.unsubscribe();
  }

  ngAfterViewInit() {
    this.loadMap(this.currentOrg$.value);
  }

  loadMap(org) {
    const gpsCoords = org.address.gpsCoords;
    const mapOption = {
      zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP, draggable: false,
      clickableIcons: false, streetViewControl: false, streetViewControlOptions: false
    };
    const map = new google.maps.Map(document.getElementById('gMap'), mapOption);
    const marker = new google.maps.Marker({map, position: gpsCoords});
    map.setCenter(gpsCoords);
  }

  loadOrg() {
    const orgCity = this.route.snapshot.params.org_city;
    const orgName = this.route.snapshot.params.org_name;
    this.firestoreService.getOrg(orgCity, orgName);
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
    const dayFormGroup = this.orgForm.get('hours').get(day.toLowerCase());
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
    // this.googleMapsService.codeAddressAndUpdate(fullAddress, orgName, orgForm);
  }
}
