import { Injectable } from '@angular/core';
import {FirestoreService} from '../firestore/firestore.service';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {Org} from '../../../shared/interfaces/org';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  geocoder = new google.maps.Geocoder();
  distanceMatrixService = new google.maps.DistanceMatrixService();

  constructor(private firestoreService: FirestoreService,
              private snackBarService: SnackBarService) {
  }

  codeAddress(orgAddressString: string, org: Org) {
    this.geocoder.geocode({address: orgAddressString}, (results, status) => {
      if (status.toString() === 'OK') {
        const stateAddressComponent = results[0].address_components.find(ac => ac.types.includes('administrative_area_level_1'));
        const state = stateAddressComponent !== undefined ? stateAddressComponent.short_name : null;
        if (state === 'MI') {
          // Get lat and lng of orgAddressString and save them in Firestore.
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          org.address.gpsCoords.lat = lat;
          org.address.gpsCoords.lng = lng;
        } else if (state !== 'MI') {
          console.warn('The org address string provided was not found to be in Michigan: ' + orgAddressString);
          const message = 'The org address string provided was not found to be in Michigan. Please input a valid Michigan address.';
          const action = 'OK';
          this.snackBarService.openSnackBar(message, action);
        }
      } else {
        console.warn('Geocode was not successful for the following reason: ' + status);
        const message = results.length === 0 ? 'The provided orgAddressString is not valid. Please try again.' :
          'The app could not reach geocoding services. Please refresh the page and try again.';
        const action = 'OK';
        this.snackBarService.openSnackBar(message, action);
      }
    });
  }

  codeAddressAndSave(orgAddressString: string, org: Org) {
    this.geocoder.geocode({address: orgAddressString}, (results, status) => {
      if (status.toString() === 'OK') {
        const stateAddressComponent = results[0].address_components.find(ac => ac.types.includes('administrative_area_level_1'));
        const state = stateAddressComponent !== undefined ? stateAddressComponent.short_name : null;
        if (state === 'MI') {
          // Get lat and lng of orgAddressString and save them in Firestore.
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          org.address.gpsCoords.lat = lat;
          org.address.gpsCoords.lng = lng;
          this.firestoreService.saveOrg(org);
        } else if (state !== 'MI') {
          console.warn('The org address string provided was not found to be in Michigan: ' + orgAddressString);
          const message = 'The org address string provided was not found to be in Michigan. Please input a valid Michigan address.';
          const action = 'OK';
          this.snackBarService.openSnackBar(message, action);
        }
      } else {
        console.warn('Geocode was not successful for the following reason: ' + status);
        const message = results.length === 0 ? 'The provided orgAddressString is not valid. Please try again.' :
          'The app could not reach geocoding services. Please refresh the page and try again.';
        const action = 'OK';
        this.snackBarService.openSnackBar(message, action);
      }
    });
  }

  codeAddressAndUpdate(orgAddressString: string, originalOrgName: string, org: Org) {
    this.geocoder.geocode( {address: orgAddressString}, (results, status) => {
      if (status.toString() === 'OK') {
        const stateAddressComponent = results[0].address_components.find(ac => ac.types.includes('administrative_area_level_1'));
        const state = stateAddressComponent !== undefined ? stateAddressComponent.short_name : null;
        if (state === 'MI') {
          // Get lat and lng of orgAddressString and save them in Firestore.
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          org.address.gpsCoords.lat = lat;
          org.address.gpsCoords.lng = lng;
          this.firestoreService.updateOrg(org, originalOrgName, true);
        } else if (state !== 'MI') {
          console.warn('The org address string provided was not found to be in Michigan: ' + orgAddressString);
          const message = 'The org address string provided was not found to be in Michigan. Please input a valid Michigan address.';
          const action = 'OK';
          this.snackBarService.openSnackBar(message, action);
        }
      } else {
        const message = results.length === 0 ? 'The provided orgAddressString is not valid. Please try again.' :
          'The app could not reach geocoding services. Please refresh the page and try again.';
        const action = 'OK';
        this.snackBarService.openSnackBar(message, action);
        console.warn('Geocode was not successful for the following reason: ' + status);
        return null;
      }
    });
  }
}
