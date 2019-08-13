import {Component, NgZone, OnInit} from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';
import {SnackBarService} from '../../../../core/services/snack-bar/snack-bar.service';
import {GoogleMapsService} from '../../../../core/services/google-maps/google-maps.service';
declare var google: any;

/** Error when invalid control is dirty, touched, or submitted. */
export class SubscribeErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export interface CodedLocation {
  locationId: any;
  locationAddress: any;
}

export interface OrgFilters {
  distanceRadius: number;
  includeReligiousOrgs: boolean;
  noEligibilityRequirements: boolean;
  showOnlyOrgsWithTransport: boolean;
}

@Component({
  selector: 'app-near-me',
  templateUrl: './near-me.component.html',
  styleUrls: ['./near-me.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ])
    ])
  ]
})
export class NearMeComponent implements OnInit {
  geocoder = new google.maps.Geocoder();

  serviceCategoryOptions: any[] = [];
  selectedServiceCategories: any[] = [];
  selectAll = false;

  servicesNearMeForm = new FormGroup({
    location: new FormControl('', [Validators.required]),
    serviceCategories: new FormControl([], [Validators.required]),
  });
  codedLocation: CodedLocation = {locationId: null, locationAddress: null};

  // Stores orgs found by service categories.
  foundOrgs: any[] = [];

  // Stores filtered orgs.
  filteredOrgs: any[] = [];

  orgFilters: OrgFilters = {distanceRadius: 25, noEligibilityRequirements: false,
    includeReligiousOrgs: true, showOnlyOrgsWithTransport: false};
  showFilterControls = false;

  constructor(private db: FirestoreService,
              private snackBarService: SnackBarService,
              private router: Router,
              private googleMapsService: GoogleMapsService,
              private zone: NgZone) { }

  ngOnInit() {
    this.db.serviceCategories.valueChanges().subscribe(sc => this.serviceCategoryOptions = this.db._sort(sc, 'service'));
  }

  selectAllToggle() {
    const selectedServicesCategories = this.servicesNearMeForm.get('serviceCategories');
    if (selectedServicesCategories.value.includes('All Services')) {
      selectedServicesCategories.setValue([...this.serviceCategoryOptions.map(service => service.service), 'All Services']);
      this.selectAll = true;
    } else {
      selectedServicesCategories.setValue([]);
    }
  }

  selectServiceCategory() {
    const selectedServiceCategories = this.servicesNearMeForm.get('serviceCategories').value;

    // If "Select All" is selected and one option is unselected.
    if (this.selectAll === true && selectedServiceCategories.length === this.serviceCategoryOptions.length) {
      this.selectAll = false;
      const index = selectedServiceCategories.indexOf('All Services');
      if (index > -1) {
        selectedServiceCategories.splice(index, 1);
        this.servicesNearMeForm.get('serviceCategoryOptions').setValue(selectedServiceCategories);
      }
    } else if (this.selectAll === false && selectedServiceCategories.length === this.serviceCategoryOptions.length) {
      this.selectAll = true;
      selectedServiceCategories.push('All Services');
      this.servicesNearMeForm.get('serviceCategoryOptions').setValue(selectedServiceCategories);
    }
  }

  findServices() {
    const address = this.servicesNearMeForm.get('location').value;
    if (address !== '' && this.servicesNearMeForm.get('serviceCategories').value.length > 0) {
      this.codeAddress(address);
    }
  }

  /**
   * This function will take the inputted city or address and save the geocoded location id and location address.
   * @param address: city or address of user.
   */
  codeAddress(address: string) {
    this.geocoder.geocode( { address}, (results, status) => {
      if (status.toString() === 'OK') {
        const stateAddressComponent = results[0].address_components.find(ac => ac.types.includes('administrative_area_level_1'));
        const state = stateAddressComponent !== undefined ? stateAddressComponent.short_name : null;
        if (state === 'MI') {
          this.locationValid(results);
        } else if (state !== 'MI') {
          this.locationNotInMichigan();
        }
      } else {
        return this.locationInvalid(results, status);
      }
    });
  }

  locationValid(results) {
    const selectedServices = this.servicesNearMeForm.get('serviceCategories').value;
    this.codedLocation.locationAddress = results[0].formatted_address;
    this.codedLocation.locationId = results[0].place_id;
    this.selectedServiceCategories = selectedServices.includes('All Services') ? ['All Services'] : selectedServices;
    this.findOrgs();
  }

  locationNotInMichigan() {
    this.servicesNearMeForm.get('location').reset();
    const message = 'The location provided was not found to be in Michigan. Please input a Michigan city or address.';
    const action = 'OK';
    this.zone.run(() => this.snackBarService.openSnackBar(message, action));
    console.warn('Provided location is outside of Michigan.');
  }

  locationInvalid(results, status) {
    this.servicesNearMeForm.get('location').reset();
    const message = results.length === 0 ? 'The provided location is not valid. Please try again.' :
      'The app could not reach geocoding services. Please refresh the page and try again.';
    const action = 'OK';
    this.zone.run(() => this.snackBarService.openSnackBar(message, action));
    console.warn('Geocode was not successful for the following reason: ' + status);
    return null;
  }

  findOrgs() {
    this.db.organizations.valueChanges().subscribe(rsp => {
      const foundOrgs = this.servicesNearMeForm.get('serviceCategories').value.includes('All Services') ? rsp :
        rsp.filter(org => org.services.some(sc => this.selectedServiceCategories.includes(sc)));

      let orgCount = 0;

      if (foundOrgs.length > 0) {
        foundOrgs.forEach(org => {

          this.googleMapsService.distanceMatrixService.getDistanceMatrix({
            origins: [this.codedLocation.locationAddress],
            destinations: [org.address.gpsCoords],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL}, (response, status2) => {
              if (status2.toString() === 'OK') {
                org.distance = response.rows[0].elements[0].distance.text;
                this.foundOrgs.push(org);

                orgCount++;

                if (orgCount === foundOrgs.length) {
                  this.sortOrgsByDistance(foundOrgs);
                  this.applyOrgFilters();
                }
              }
            }
          );

        });
      }
    });
  }

  sortOrgsByDistance(foundOrgs) {
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    this.foundOrgs = foundOrgs.sort((a, b) => collator.compare(a.distance, b.distance));
  }

  applyOrgFilters() {
    this.filteredOrgs = Object.assign([], this.foundOrgs);
    this.filteredOrgs = this.filteredOrgs
      .filter(org => org.distance.split(' mi')[0] <= this.orgFilters.distanceRadius);

    if (this.orgFilters.includeReligiousOrgs === false) {
      this.filteredOrgs = this.filteredOrgs
        .filter(org => !org.services.includes('Religious Organization'));
    }

    if (this.orgFilters.noEligibilityRequirements === true) {
      this.filteredOrgs = this.filteredOrgs
        .filter(org => !org.eligibilityRequirements && !org.seniorRequirements);
    }

    if (this.orgFilters.showOnlyOrgsWithTransport === true) {
      this.filteredOrgs = this.filteredOrgs.filter(org => org.transportation);
    }
  }

  tryAnotherSearch() {
    this.codedLocation = {locationId: null, locationAddress: null};
    this.selectedServiceCategories = [];
    this.foundOrgs = [];
    this.filteredOrgs = [];
    this.orgFilters = {distanceRadius: 25, noEligibilityRequirements: false, includeReligiousOrgs: true, showOnlyOrgsWithTransport: false};
    this.showFilterControls = false;
    this.servicesNearMeForm.get('location').reset();
    this.servicesNearMeForm.get('serviceCategories').reset();
  }
}
