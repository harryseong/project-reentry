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
      additionalNotes: csvOrg[Constants.CSV_ORG_FIELD_DICT.additionalNotes],
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
      bringWithYou: csvOrg[Constants.CSV_ORG_FIELD_DICT.bringWithYou],
      contact: {
        email: csvOrg[Constants.CSV_ORG_FIELD_DICT.email],
        name: csvOrg[Constants.CSV_ORG_FIELD_DICT.name],
        phone: csvOrg[Constants.CSV_ORG_FIELD_DICT.phone]
      },
      description: csvOrg[Constants.CSV_ORG_FIELD_DICT.description],
      eligibilityRequirements: csvOrg[Constants.CSV_ORG_FIELD_DICT.eligibilityRequirements],
      hours: {
        specifyHours: csvOrg[Constants.CSV_ORG_FIELD_DICT.specifyHours]  === 'Y',
        sunday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.sundayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.sundayStart],
        },
        monday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.mondayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.mondayStart],
        },
        tuesday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.tuesdayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.tuesdayStart],
        },
        wednesday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.wednesdayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.wednesdayStart],
        },
        thursday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.thursdayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.thursdayStart],
        },
        friday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.fridayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.fridayStart],
        },
        saturday: {
          end: csvOrg[Constants.CSV_ORG_FIELD_DICT.saturdayEnd],
          open: false,
          start: csvOrg[Constants.CSV_ORG_FIELD_DICT.saturdayStart],
        },
      },
      languages: (csvOrg[Constants.CSV_ORG_FIELD_DICT.languages] !== undefined && csvOrg[Constants.CSV_ORG_FIELD_DICT.languages].length) > 0 ?
        csvOrg[Constants.CSV_ORG_FIELD_DICT.languages].split(',') : null,
      name: csvOrg[Constants.CSV_ORG_FIELD_DICT.name],
      payment: csvOrg[Constants.CSV_ORG_FIELD_DICT.payment],
      seniorRequirements: csvOrg[Constants.CSV_ORG_FIELD_DICT.seniorRequirements],
      services: this.extractServices(csvOrg),
      transportation: null,
      viewData: null,
      website: csvOrg[Constants.CSV_ORG_FIELD_DICT.website],
    };
    // console.log(org);
    return org;
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

    serviceOptions.forEach(o => {
      if (csvOrg[Constants.CSV_ORG_FIELD_DICT[o]] === 'Y') {
        services.push(Constants.CSV_ORG_SERVICE_DICT[o]);
      }
    });

    return services;
  }
}
