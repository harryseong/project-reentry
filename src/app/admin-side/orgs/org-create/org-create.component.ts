import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../../../core/services/firestore/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import {Constants} from '../../../shared/constants/constants';
import {SubscribeErrorStateMatcher} from '../../../shared/classes/subscribe-error-state-matcher';
import {DialogService} from '../../../core/services/dialog/dialog.service';
import {GoogleMapsService} from '../../../core/services/google-maps/google-maps.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-org-create',
  templateUrl: './org-create.component.html',
  styleUrls: ['./org-create.component.scss']
})
export class OrgCreateComponent implements OnInit {
  languages$: BehaviorSubject<any[]> = null;
  serviceCategories$: BehaviorSubject<any[]> = null;

  matcher: SubscribeErrorStateMatcher; // For form error matching.
  orgForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    services: new FormControl([], [Validators.required]),
    hours: new FormGroup({
      specifyHours: new FormControl(false),
      sunday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
      monday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
      tuesday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
      wednesday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
      thursday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
      friday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
      saturday: new FormGroup({
        open: new FormControl(false),
        start: new FormControl(''),
        end: new FormControl('')
      }),
    }),
    address: new FormGroup({
      streetAddress1: new FormControl('', [Validators.required]),
      streetAddress2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      county: new FormControl(null),
      state: new FormControl('MI', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.pattern(Constants.REGEX_PATTERN.zipCode)]),
      gpsCoords: new FormGroup({
        lat: new FormControl(''),
        lng: new FormControl(''),
      })
    }),
    formattedAddress: new FormControl(null),
    website: new FormControl('', [
      Validators.pattern(Constants.REGEX_PATTERN.url)
      ]),
    contact: new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      phone: new FormControl('', [Validators.pattern(Constants.REGEX_PATTERN.phone)]),
    }),
    languages: new FormControl([]),
    payment: new FormControl(''),
    transportation: new FormControl(''),
    seniorRequirements: new FormControl(''),
    eligibilityRequirements: new FormControl(''),
    bringWithYou: new FormControl(''),
    additionalNotes: new FormControl('')
  });
  daysOfWeek = Constants.DAYS_OF_WEEK;
  paymentOptions = Constants.PAYMENT_OPTIONS;

  constructor(private db: FirestoreService,
              public dialog: MatDialog,
              private dialogService: DialogService,
              private googleMapsService: GoogleMapsService) {
    this.languages$ = this.db.languages$;
    this.serviceCategories$ = this.db.serviceCategories$;
  }

  ngOnInit() {
    this.daysOfWeek.forEach(day => {
      this.toggleDay(day);
    });
  }

  specifyHours() {
    const hoursFormGroup = this.orgForm.get('hours');
    const specifyHours = hoursFormGroup.get('specifyHours').value;
    if (specifyHours === true) {
      this.daysOfWeek.forEach((day: string) => {
        hoursFormGroup.get(day.toLowerCase()).get('open').setValue(false);
        this.toggleDay(day.toLowerCase());
      });
    } else {
      this.daysOfWeek.forEach((day: string) => {
        hoursFormGroup.get(day.toLowerCase()).get('open').setValue(false);
        this.toggleDay(day.toLowerCase());
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
    this.dialogService.openEditLanguagesDialog(this.languages$.value);
  }

  editServiceCategories(): void {
    this.dialogService.openEditServiceCategoriesDialog(this.serviceCategories$.value);
  }

  onSubmit() {
    this.googleMapsService.codeAddressAndSave(this.orgForm.value, true);
  }
}
