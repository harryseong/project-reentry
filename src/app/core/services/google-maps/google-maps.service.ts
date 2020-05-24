import { Injectable } from '@angular/core';
import {FirestoreService} from '../firestore/firestore.service';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {Org} from '../../../shared/interfaces/org';
import {OrgService} from '../org/org.service';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  geocoder = new google.maps.Geocoder();
  distanceMatrixService = new google.maps.DistanceMatrixService();

  constructor(private firestoreService: FirestoreService,
              private orgService: OrgService,
              private snackBarService: SnackBarService) {}

  /**
   * Unused method for debugging purposes.
   * @param org: Org JSON object
   * @param showSnackBar: boolean
   */
  codeAddress(org: Org, showSnackBar: boolean) {
    const orgAddressString = this.orgService.extractOrgAddressString(org);
    console.log('Organization address string: ' + orgAddressString);
    this.geocoder.geocode({address: orgAddressString}, (results, status) => {
      if (status.toString() === 'OK') {
        if (results !== null && results.length > 0) {
          this.orgService.mapGeocodeDataToOrg(org, results[0].address_components,
            results[0].geometry.location, results[0].formatted_address, showSnackBar);
        } else {
          console.warn('No geocode results found for orgAddressString: ' + orgAddressString);
        }
      } else {
        console.warn('Geocode was not successful for the following reason: ' + status);
        if (showSnackBar === true) {
          this.showGeocodeErrorSnackBar(results);
        }
      }
    });
  }

  /**
   * Takes address of Org JSON object, geocodes the address, and then saves the new org in Firebase DB.
   * @param org: Org JSON object
   * @param showSnackBar: boolean
   */
  codeAddressAndSave(org: Org, showSnackBar: boolean) {
    const orgAddressString = this.orgService.extractOrgAddressString(org);
    this.geocoder.geocode({address: orgAddressString}, (results, status) => {
      if (status.toString() === 'OK') {
        if (results !== null && results.length > 0) {
          this.orgService.mapGeocodeDataToOrg(org, results[0].address_components,
            results[0].geometry.location, results[0].formatted_address, showSnackBar);
        } else {
          console.warn('No geocode results found for orgAddressString: ' + orgAddressString);
        }
        this.firestoreService.saveOrg(org);
      } else {
        console.warn('Geocode for "' + org.name + '" was not successful for the following reason: ' + status);
        if (showSnackBar === true) {
          this.showGeocodeErrorSnackBar(results);
        }
      }
    });
  }

  /**
   * Takes address of Org JSON object, geocodes the address, and then updates the existing org in Firebase DB.
   * @param originalOrgName: string
   * @param org: Org JSON object
   * @param showSnackBar: boolean
   */
  codeAddressAndUpdate(originalOrgName: string, org: Org, showSnackBar: boolean) {
    const orgAddressString = this.orgService.extractOrgAddressString(org);
    this.geocoder.geocode( {address: orgAddressString}, (results, status) => {
      if (status.toString() === 'OK') {
        if (results !== null && results.length > 0) {
          this.orgService.mapGeocodeDataToOrg(org, results[0].address_components,
            results[0].geometry.location, results[0].formatted_address, showSnackBar);
        } else {
          console.warn('No geocode results found for orgAddressString: ' + orgAddressString);
        }
        this.firestoreService.updateOrg(org, originalOrgName, true);
      } else {
        console.warn('Geocode was not successful for the following reason: ' + status);
        if (showSnackBar === true) {
          this.showGeocodeErrorSnackBar(results);
        }
        return null;
      }
    });
  }

  /**
   * Displays snackbar for geocoding-related errors.
   * @param results: Results from call to Google geocoding API.
   */
  private showGeocodeErrorSnackBar(results: any[]): void {
    const message = (results !== null && results.length) === 0 ? 'The provided orgAddressString is not valid. Please try again.' :
      'The app could not reach geocoding services. Please refresh the page and try again.';
    const action = 'OK';
    this.snackBarService.openSnackBar(message, action);
  }
}
