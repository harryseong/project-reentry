import {Component, NgZone, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';
import {SnackBarService} from '../../../../core/services/snack-bar/snack-bar.service';
import {GoogleMapsService} from '../../../../core/services/google-maps/google-maps.service';
import {BehaviorSubject} from 'rxjs';
import {CodedLocation} from '../../../../shared/interfaces/coded-location';
import {OrgFilters} from '../../../../shared/interfaces/org-filters';
declare var google: any;

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
  serviceCategories$ = new BehaviorSubject([]);
  selectedServiceCategories: any[] = [];
  selectAll = false;

  servicesNearMeForm: FormGroup;
  codedLocation: CodedLocation = {placeId: null, formattedAddress: null};

  // Stores orgs found by service categories.
  foundOrgs: any[] = [];
  filteredOrgs$ = new BehaviorSubject([]);
  searchStatus$ = new BehaviorSubject('ready');

  orgFilters: OrgFilters = {
    distanceRadius: 25,
    noEligibilityRequirements: false,
    includeReligiousOrgs: true,
    showOnlyOrgsWithTransport: false
  };
  showFilterControls = false;

  constructor(private db: FirestoreService,
              private snackBarService: SnackBarService,
              private router: Router,
              private googleMapsService: GoogleMapsService,
              private zone: NgZone) {
    this.serviceCategories$ = db.serviceCategories$;
  }

  ngOnInit() {
    this.loadServicesNearMeForm();
  }

  loadServicesNearMeForm() {
    this.servicesNearMeForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
      serviceCategories: new FormControl([], [Validators.required]),
    });
  }

  selectAllToggle() {
    const selectedServicesCategories = this.servicesNearMeForm.get('serviceCategories');
    if (selectedServicesCategories.value.includes('All Services')) {
      selectedServicesCategories.setValue([...this.serviceCategories$.value.map(service => service.name), 'All Services']);
      this.selectAll = true;
    } else {
      selectedServicesCategories.setValue([]);
    }
  }

  selectServiceCategory() {
    const selectedServiceCategories = this.servicesNearMeForm.get('serviceCategories').value;

    // If "Select All" is selected and one option is unselected.
    if (this.selectAll === true && selectedServiceCategories.length === this.serviceCategories$.value.length) {
      this.selectAll = false;
      const index = selectedServiceCategories.indexOf('All Services');
      if (index > -1) {
        selectedServiceCategories.splice(index, 1);
        this.servicesNearMeForm.get('serviceCategories').setValue(selectedServiceCategories);
      }
    } else if (this.selectAll === false && selectedServiceCategories.length === this.serviceCategories$.value.length) {
      this.selectAll = true;
      selectedServiceCategories.push('All Services');
      this.servicesNearMeForm.get('serviceCategories').setValue(selectedServiceCategories);
    }
  }

  findOrgs() {
    this.searchStatus$.next('searching');
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
    this.geocoder.geocode({address}, (results, status) => {
      if (status.toString() === 'OK') {
        const stateAddressComponent = results[0].address_components.find(ac => ac.types.includes('administrative_area_level_1'));
        const state = stateAddressComponent !== undefined ? stateAddressComponent.short_name : null;
        if (state === 'MI') {
          this.codedLocation = this.locationValid(results);
        } else if (state !== 'MI') {
          this.locationNotInMichigan();
        }
      } else {
        return this.locationInvalid(results, status);
      }
    });
  }

  locationValid(results): CodedLocation {
    const selectedServices = this.servicesNearMeForm.get('serviceCategories').value;
    this.selectedServiceCategories = selectedServices.includes('All Services') ? ['All Services'] : selectedServices;
    this.getOrgsByServicesCategories();
    const formattedAddress = results[0].formatted_address;
    const placeId = results[0].place_id;
    return {placeId, formattedAddress};
  }

  locationNotInMichigan() {
    this.searchStatus$.next('done');
    this.servicesNearMeForm.get('location').reset();
    const message = 'The location provided was not found to be in Michigan. Please input a Michigan city or address.';
    const action = 'OK';
    this.zone.run(() => this.snackBarService.openSnackBar(message, action));
    console.warn('Provided location is outside of Michigan.');
  }

  locationInvalid(results, status) {
    this.searchStatus$.next('done');
    this.servicesNearMeForm.get('location').reset();
    const message = results.length === 0 ? 'The provided location is not valid. Please try again.' :
      'The app could not reach geocoding services. Please refresh the page and try again.';
    const action = 'OK';
    this.zone.run(() => this.snackBarService.openSnackBar(message, action));
    console.warn('Geocode was not successful for the following reason: ' + status);
    return null;
  }

  getOrgsByServicesCategories() {
    const foundOrgs = this.db.getOrgsByServiceCategories(this.selectedServiceCategories);

    if (foundOrgs.length > 0) {
      const foundOrgsWithDist = [];
      let orgCount = 0;
      foundOrgs.forEach(org => {

        this.googleMapsService.distanceMatrixService.getDistanceMatrix({
            origins: [this.codedLocation.formattedAddress],
            destinations: [org.address.gpsCoords],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, (response, status) => {
            if (status.toString() === 'OK') {
              org.distance = response.rows[0].elements[0].distance.text;
              foundOrgsWithDist.push(org);
              orgCount++;

              if (orgCount === foundOrgsWithDist.length) {
                this.foundOrgs = this.sortOrgsByDistance(foundOrgsWithDist);
                this.applyOrgFilters();
                this.zone.run(() => this.searchStatus$.next('done'));
              }
            }
          }
        );

      });
    }
  }

  sortOrgsByDistance(orgs) {
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    return orgs.sort((a, b) => collator.compare(a.distance, b.distance));
  }

  applyOrgFilters() {
    let filteredOrgs = Object.assign([], this.foundOrgs)
      .filter(org => org.distance.split(' mi')[0] <= this.orgFilters.distanceRadius);

    if (this.orgFilters.includeReligiousOrgs === false) {
      filteredOrgs = filteredOrgs.filter(org => !org.services.includes('Religious Organization'));
    }

    if (this.orgFilters.noEligibilityRequirements === true) {
      filteredOrgs = filteredOrgs.filter(org => !org.eligibilityRequirements && !org.seniorRequirements);
    }

    if (this.orgFilters.showOnlyOrgsWithTransport === true) {
      filteredOrgs = filteredOrgs.filter(org => org.transportation);
    }

    this.filteredOrgs$.next(filteredOrgs);
  }

  tryAnotherSearch() {
    this.codedLocation = {placeId: null, formattedAddress: []};
    this.selectedServiceCategories = [];
    this.foundOrgs = [];
    this.searchStatus$.next('ready');
    this.filteredOrgs$.next([]);
    this.orgFilters = {distanceRadius: 25, noEligibilityRequirements: false, includeReligiousOrgs: true, showOnlyOrgsWithTransport: false};
    this.showFilterControls = false;
    this.servicesNearMeForm.get('location').reset('');
    this.servicesNearMeForm.get('serviceCategories').reset([]);
  }
}
