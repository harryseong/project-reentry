import { Injectable } from '@angular/core';
import {Org} from '../../../shared/interfaces/org';
import {Constants} from '../../../shared/constants/constants';

@Injectable({providedIn: 'root'})
export class OrgService {

  constructor() { }

  /**
   * Maps csvOrg object to Org object to be saved in the Firestore database.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  csvOrgMapper(csvOrg): Org {
    const org: Org = {
      additionalNotes: this.defaultText(csvOrg[Constants.CSV_ORG_FIELD_DICT.additionalNotes], null),
      address: {
        city: csvOrg[Constants.CSV_ORG_FIELD_DICT.city],
          gpsCoords: {
            lat: null,
            lng: null,
        },
        state: csvOrg[Constants.CSV_ORG_FIELD_DICT.state],
          streetAddress1: csvOrg[Constants.CSV_ORG_FIELD_DICT.streetAddress1],
          streetAddress2: csvOrg[Constants.CSV_ORG_FIELD_DICT.streetAddress2],
          zipCode: csvOrg[Constants.CSV_ORG_FIELD_DICT.zipCode]
      },
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
      languages: this.extractServices(csvOrg),
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
   * Extracts from csvOrg a list of languages spoken by the organization.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  extractLanguages(csvOrg): string[] {
    const languages = [];
    if (csvOrg[Constants.CSV_ORG_FIELD_DICT.languages] !== undefined && csvOrg[Constants.CSV_ORG_FIELD_DICT.languages].length > 0) {
      languages.push(csvOrg[Constants.CSV_ORG_FIELD_DICT.languages].split(','));
    }

    return languages.sort((a: string, b: string ) => a >= b ? 1 : -1);
  }

  /**
   * Extracts from csvOrg a list of services offered by the organization.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  extractServices(csvOrg): string[] {
    const services = [];
    const serviceOptions = [
      'clothing',
      'medicalCare',
      'mentalHealth',
      'publicTransportation',
      'techSupport',
      'financialLiteracy',
      'substanceUse',
      'religiousOrganization',
      'housingSupport',
      'parenting',
      'volunteeringOpportunities',
      'legalAssistance',
      'publicBenefitAssistance',
      'employment',
      'education',
      'supportNetworksAndMentoring',
      'domesticViolenceSexualAssault'
    ];

    serviceOptions.forEach(serviceOption => {
      if (csvOrg[Constants.CSV_ORG_FIELD_DICT[serviceOption]] === 'Y') {
        services.push(Constants.CSV_ORG_SERVICE_DICT[serviceOption]);
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
    return (text !== null && text !== '') ? text : defaultText;
  }

  /**
   * Checks if text is empty and return boolean value.
   * @param text: String text to check if empty.
   */
  isEmpty(text: string): boolean {
    return (text === null || text === '');
  }
}
