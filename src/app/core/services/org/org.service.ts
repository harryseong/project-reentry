import { Injectable } from '@angular/core';
import {Org} from '../../interfaces/org';

@Injectable({
  providedIn: 'root'
})
export class OrgService {
  csvOrgDict = {
    1: 'name',
    2: 'description',
    3: 'streetAddress1',
    4: 'streetAddress2',
    5: 'city',
    6: 'state',
    7: 'zipCode',
    8: 'contactName',
    9: 'phone',
    10: 'email',
    11: 'website',
    12: 'specifyHours',
    13: 'SundayStart',
    14: 'SundayEnd',
    15: 'MondayStart',
    16: 'MondayEnd',
    17: 'TuesdayStart',
    18: 'TuesdayEnd',
    19: 'WednesdayStart',
    20: 'WednesdayEnd',
    21: 'ThursdayStart',
    22: 'ThursdayEnd',
    23: 'FridayStart',
    24: 'FridayEnd',
    25: 'SaturdayStart',
    26: 'SaturdayEnd',
    27: 'Clothing',
    28: 'Medical Care',
    29: 'Mental Health',
    30: 'Public Transportation',
    31: 'Tech Support',
    32: 'Financial Literacy',
    33: 'Substance Use',
    34: 'Religious Organization',
    35: 'Housing Support',
    36: 'Parenting',
    37: 'Volunteering Opportunities',
    38: 'Legal Assistance',
    39: 'Public Benefit Assistance',
    40: 'Employment',
    41: 'Education',
    42: 'Support Networks and Mentoring',
    43: 'Domestic Violence/Sexual Assault',
    44: 'payment',
    45: 'transportation',
    46: 'languages',
    47: 'senior requirements',
    48: 'eligibility requirements',
    49: 'bringWithYou',
    50: 'additionalNotes'
  };

  constructor() { }

  processCsvOrg(csvOrg): Org {
    console.log(csvOrg);
    return null;
  }
}
