import { Injectable } from '@angular/core';
import {Org} from '../../../shared/interfaces/org';

@Injectable({providedIn: 'root'})
export class OrgService {

  /**
   * Dictionary of CSV column indices to organization fields.
   */
  csvOrgFieldDict = {
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

  csvOrgServiceDict = {
    clothing: 'Clothing',
    medicalCare: 'Medical Care',
    mentalHealth: 'Mental Health',
    publicTransportation: 'Public Transportation',
    techSupport: 'Tech Support',
    financialLiteracy: 'Financial Literacy',
    substanceUse: 'Substance Use',
    religiousOrganization: 'Religious Organization',
    housingSupport: 'Housing Support',
    parenting: 'Parenting',
    volunteeringOpportunities: 'Volunteering Opportunities',
    legalAssistance: 'Legal Assistance',
    publicBenefitAssistance: 'Public Benefit Assistance',
    employment: 'Employment',
    education: 'Education',
    supportNetworksAndMentoring: 'Support Networks And Mentoring',
    domesticViolenceSexualAssault: 'Domestic Violence/Sexual Assault'
  };

  constructor() { }

  /**
   * Maps csvOrg object to Org object to be saved in the Firestore database.
   * @param csvOrg: Each row of the uploaded CSV file representing an organization.
   */
  csvOrgMapper(csvOrg): Org {
    const org: Org = {
      additionalNotes: csvOrg[this.csvOrgFieldDict.additionalNotes],
      address: {
        city: csvOrg[this.csvOrgFieldDict.city],
          gpsCoords: {
            lat: null,
            lng: null,
        },
        state: csvOrg[this.csvOrgFieldDict.state],
          streetAddress1: csvOrg[this.csvOrgFieldDict.streetAddress1],
          streetAddress2: csvOrg[this.csvOrgFieldDict.streetAddress2],
          zipCode: csvOrg[this.csvOrgFieldDict.zipCode]
      },
      bringWithYou: csvOrg[this.csvOrgFieldDict.bringWithYou],
      contact: {
        email: csvOrg[this.csvOrgFieldDict.email],
        name: csvOrg[this.csvOrgFieldDict.name],
        phone: csvOrg[this.csvOrgFieldDict.phone]
      },
      description: csvOrg[this.csvOrgFieldDict.description],
      eligibilityRequirements: csvOrg[this.csvOrgFieldDict.eligibilityRequirements],
      hours: {
        specifyHours: csvOrg[this.csvOrgFieldDict.specifyHours]  === 'Y',
        sunday: {
          end: csvOrg[this.csvOrgFieldDict.sundayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.sundayStart],
        },
        monday: {
          end: csvOrg[this.csvOrgFieldDict.mondayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.mondayStart],
        },
        tuesday: {
          end: csvOrg[this.csvOrgFieldDict.tuesdayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.tuesdayStart],
        },
        wednesday: {
          end: csvOrg[this.csvOrgFieldDict.wednesdayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.wednesdayStart],
        },
        thursday: {
          end: csvOrg[this.csvOrgFieldDict.thursdayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.thursdayStart],
        },
        friday: {
          end: csvOrg[this.csvOrgFieldDict.fridayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.fridayStart],
        },
        saturday: {
          end: csvOrg[this.csvOrgFieldDict.saturdayEnd],
          open: false,
          start: csvOrg[this.csvOrgFieldDict.saturdayStart],
        },
      },
      languages: (csvOrg[this.csvOrgFieldDict.languages] !== undefined && csvOrg[this.csvOrgFieldDict.languages].length) > 0 ?
        csvOrg[this.csvOrgFieldDict.languages].split(',') : null,
      name: csvOrg[this.csvOrgFieldDict.name],
      payment: csvOrg[this.csvOrgFieldDict.payment],
      seniorRequirements: csvOrg[this.csvOrgFieldDict.seniorRequirements],
      services: this.extractServices(csvOrg),
      transportation: null,
      viewData: null,
      website: csvOrg[this.csvOrgFieldDict.website],
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
      if (csvOrg[this.csvOrgFieldDict[o]] === 'Y') {
        services.push(this.csvOrgServiceDict[o]);
      }
    });

    return services;
  }
}
