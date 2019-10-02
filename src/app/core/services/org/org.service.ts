import { Injectable } from '@angular/core';
import {Org} from '../../../shared/interfaces/org';

@Injectable({
  providedIn: 'root'
})
export class OrgService {
  csvOrgDict = {
    name: 0,
    description: 1,
    streetAddress1: 2,
    streetAddress2: 3,
    city: 4,
    state: 5,
    zipCode: 6,
    contactName: 7,
    phone: 8,
    email: 9,
    website: 10,
    specifyHours: 11,
    sundayStart: 12,
    sundayEnd: 13,
    mondayStart: 14,
    mondayEnd: 15,
    tuesdayStart: 16,
    tuesdayEnd: 17,
    wednesdayStart: 18,
    wednesdayEnd: 19,
    thursdayStart: 20,
    thursdayEnd: 21,
    fridayStart: 22,
    fridayEnd: 23,
    saturdayStart: 24,
    saturdayEnd: 25,
    clothing: 26,
    medicalCare: 27,
    mentalHealth: 28,
    publicTransportation: 29,
    techSupport: 30,
    financialLiteracy: 31,
    substanceUse: 32,
    religiousOrganization: 33,
    housingSupport: 34,
    parenting: 35,
    volunteeringOpportunities: 36,
    legalAssistance: 37,
    publicBenefitAssistance: 38,
    employment: 39,
    education: 40,
    supportNetworksAndMentoring: 41,
    domesticViolenceSexualAssault: 42,
    payment: 43,
    transportation: 44,
    languages: 45,
    seniorRequirements: 46,
    eligibilityRequirements: 47,
    bringWithYou: 48,
    additionalNotes: 49
  };

  constructor() { }

  processCsvOrg(csvOrg): Org {
    const org: Org = {
      additionalNotes: csvOrg[this.csvOrgDict.additionalNotes],
      address: {
        city: csvOrg[this.csvOrgDict.city],
          gpsCoords: {
            lat: null,
            lng: null,
        },
        state: csvOrg[this.csvOrgDict.state],
          streetAddress1: csvOrg[this.csvOrgDict.streetAddress1],
          streetAddress2: csvOrg[this.csvOrgDict.streetAddress2],
          zipCode: csvOrg[this.csvOrgDict.zipCode]
      },
      bringWithYou: csvOrg[this.csvOrgDict.bringWithYou],
      contact: {
        email: csvOrg[this.csvOrgDict.email],
        name: csvOrg[this.csvOrgDict.name],
        phone: csvOrg[this.csvOrgDict.phone]
      },
      description: csvOrg[this.csvOrgDict.description],
      eligibilityRequirements: csvOrg[this.csvOrgDict.eligibilityRequirements],
      hours: {
        specifyHours: csvOrg[this.csvOrgDict.specifyHours]  === 'Y',
        sunday: {
          end: csvOrg[this.csvOrgDict.sundayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.sundayStart],
        },
        monday: {
          end: csvOrg[this.csvOrgDict.mondayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.mondayStart],
        },
        tuesday: {
          end: csvOrg[this.csvOrgDict.tuesdayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.tuesdayStart],
        },
        wednesday: {
          end: csvOrg[this.csvOrgDict.wednesdayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.wednesdayStart],
        },
        thursday: {
          end: csvOrg[this.csvOrgDict.thursdayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.thursdayStart],
        },
        friday: {
          end: csvOrg[this.csvOrgDict.fridayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.fridayStart],
        },
        saturday: {
          end: csvOrg[this.csvOrgDict.saturdayEnd],
          open: false,
          start: csvOrg[this.csvOrgDict.saturdayStart],
        },
      },
      languages: (csvOrg[this.csvOrgDict.languages] !== undefined && csvOrg[this.csvOrgDict.languages].length) > 0 ? csvOrg[this.csvOrgDict.languages].split(',') : null,
      name: csvOrg[this.csvOrgDict.name],
      payment: csvOrg[this.csvOrgDict.payment],
      seniorRequirements: csvOrg[this.csvOrgDict.seniorRequirements],
      services: this.extractServices(csvOrg),
      transportation: null,
      viewData: null,
      website: csvOrg[this.csvOrgDict.website],
    };
    console.log(org);
    return org;
  }

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
      if (csvOrg[this.csvOrgDict[o]] === 'Y') {
        services.push(o);
      }
    });

    return services;
  }
}
