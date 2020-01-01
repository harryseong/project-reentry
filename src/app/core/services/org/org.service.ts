import { Injectable } from '@angular/core';
import {Org} from '../../../shared/interfaces/org';
import {Constants} from '../../../shared/constants/constants';
import {SnackBarService} from '../snack-bar/snack-bar.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class OrgService {
  orgSaveSuccessCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private snackBarService: SnackBarService) {}

  updateOrgSaveSuccessCount(): void {
    let orgSaveSuccessCount = this.orgSaveSuccessCount$.value;
    orgSaveSuccessCount++;
    this.orgSaveSuccessCount$.next(orgSaveSuccessCount);
    console.log('Orgs successfully saved in this batch: ' + orgSaveSuccessCount);
  }

  resetOrgSaveSuccessCount(): void {
    this.orgSaveSuccessCount$.next(0);
  }

  /**
   * Maps csvOrg object to Org object to be saved in the Firestore database.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  mapCsvOrgToOrg(csvOrg): Org {
    const org: Org = {
      additionalNotes: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.additionalNotes], null),
      address: {
        city: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.city], null),
        county: null,
        gpsCoords: {
          lat: null,
          lng: null
        },
        state: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.state], null),
        streetAddress1: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.streetAddress1], null),
        streetAddress2: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.streetAddress2], null),
        zipCode: csvOrg[Constants.CSV_ORG_FIELD_DICT.zipCode]
      },
      formattedAddress: null,
      bringWithYou: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.bringWithYou], null),
      contact: {
        email: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.email], null),
        name: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.name], null),
        phone: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.phone], null)
      },
      description: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.description], null),
      eligibilityRequirements: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.eligibilityRequirements], null),
      hours: {
        specifyHours: csvOrg[Constants.CSV_ORG_FIELD_DICT.specifyHours]  === 'Y',
        sunday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.sundayStart]) &&
            !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.sundayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.sundayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.sundayEnd], null)
        },
        monday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.mondayStart]) &&
            !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.mondayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.mondayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.mondayEnd], null)
        },
        tuesday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.tuesdayStart])
            && !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.tuesdayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.tuesdayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.tuesdayEnd], null)
        },
        wednesday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.wednesdayStart]) &&
            !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.wednesdayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.wednesdayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.wednesdayEnd], null)
        },
        thursday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.thursdayStart]) &&
            !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.thursdayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.thursdayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.thursdayEnd], null)
        },
        friday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.fridayStart]) &&
            !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.fridayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.fridayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.fridayEnd], null)
        },
        saturday: {
          open: !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.saturdayStart]) &&
            !this.isEmpty(csvOrg[Constants.CSV_ORG_FIELD_DICT.saturdayEnd]),
          start: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.saturdayStart], null),
          end: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.saturdayEnd], null)
        },
      },
      languages: this.extractLanguages(csvOrg),
      name: csvOrg[Constants.CSV_ORG_FIELD_DICT.name],
      payment: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.payment], null),
      seniorRequirements: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.seniorRequirements], null),
      services: this.extractServices(csvOrg),
      transportation: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.transportation], null),
      viewData: {},
      website: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.website], null)
    };
    return org;
  }

  /**
   * Maps data from Google Geocoder API response to Org object.
   * @param org: Org object.
   * @param addressComponents: Geocoder address components.
   * @param geometryLocation: Geocoder geometry location containing latitude, longitude data.
   * @param formattedAddress: Geocoder
   * @param showSnackBar: boolean flag to determine whether or not to show snackBar confirmation and warnings.
   */
  mapGeocodeDataToOrg(org: Org, addressComponents, geometryLocation, formattedAddress: string, showSnackBar: boolean) {
    // State geocoder address components.
    const stateAddressComponent = addressComponents.find(ac => ac.types.includes('administrative_area_level_1'));
    const state = stateAddressComponent !== undefined ? stateAddressComponent.short_name : null;

    if (state === 'MI') {
      // Geocode address components.
      const streetNumberAddressComponent = addressComponents.find(ac => ac.types.includes('street_number'));
      const streetNameAddressComponent = addressComponents.find(ac => ac.types.includes('route'));
      const cityAddressComponent = addressComponents.find(ac => ac.types.includes('locality'));
      const countyAddressComponent = addressComponents.find(ac => ac.types.includes('administrative_area_level_2'));

      // Address components.
      const streetNumber = streetNumberAddressComponent !== undefined ? streetNumberAddressComponent.long_name : null;
      const streetName = streetNameAddressComponent !== undefined ? streetNameAddressComponent.long_name : null;
      const city = cityAddressComponent !== undefined ? cityAddressComponent.long_name : null;
      const county = countyAddressComponent !== undefined ? countyAddressComponent.long_name : null;

      // Latitude, longitude components.
      const lat = geometryLocation.lat();
      const lng = geometryLocation.lng();

      // Map geocode data to org address map.
      org.formattedAddress = formattedAddress;
      org.address.streetAddress1 = streetNumber + ' ' + streetName;
      org.address.city = city;
      org.address.county = county;
      org.address.state = state;
      org.address.gpsCoords.lat = lat;
      org.address.gpsCoords.lng = lng;
    } else if (state !== 'MI') {
      console.warn('The address provided was not found to be in Michigan: ' + formattedAddress);

      if (showSnackBar === true) {
        const message = 'The org address string provided was not found to be in Michigan. Please input a valid Michigan address.';
        const action = 'OK';
        this.snackBarService.openSnackBar(message, action);
      }
    }
  }

  /**
   * Extract orgAddressString from Org object.
   * @param org: Org object.
   */
  extractOrgAddressString(org: Org): string {
    return this.defaultText(org.address.streetAddress1, null) + ', ' +
      this.defaultText(org.address.city, null) + ', ' +
      this.defaultText(org.address.state, null) + ' ' +
      org.address.zipCode;
  }

  /**
   * Extracts from csvOrg a list of languages spoken by the organization.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  extractLanguages(csvOrg): string[] {
    const languagesString: string = csvOrg[Constants.CSV_ORG_FIELD_DICT.languages];
    let languages = [];
    if (languagesString !== undefined && languagesString !== null && languagesString.trim() !== '') {
      languages = csvOrg[Constants.CSV_ORG_FIELD_DICT.languages].split(',');
      if (languages.length > 1) {
        languages.sort((a: string, b: string ) => a >= b ? 1 : -1);
      }
    }

    return languages;
  }

  /**
   * Extracts from csvOrg a list of services offered by the organization.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  extractServices(csvOrg): string[] {
    const services = [];

    Constants.ORG_SERVICE_CATEGORIES.forEach(serviceCategory => {
      if (csvOrg[Constants.CSV_ORG_FIELD_DICT[serviceCategory]] === 'Y') {
        services.push(Constants.CSV_ORG_SERVICE_DICT[serviceCategory]);
      }
    });

    return services.sort((a: string, b: string) => a >= b ? 1 : -1);
  }

  /**
   * Returns text if is not empty. If empty, returns the specified default text.
   * @param text: String text.
   * @param defaultText: Specified default text to return if text is empty.
   */
  defaultText(text: string, defaultText: string | null): string | null {
    return (text !== null && text.trim() !== '') ? text.trim() : defaultText;
  }

  /**
   * Checks if text is empty and return boolean value.
   * @param text: String text to check if empty.
   */
  isEmpty(text: string): boolean {
    return (text === null || text.trim() === '');
  }
}
