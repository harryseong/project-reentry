export class Constants {
  static REGEX_PATTERN = {
    phone: '^\\(?([0-9]{3})\\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$',
    url: '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$',
    zipCode: '^[0-9]{5}(?:-[0-9]{4})?$'
  };

  static DAYS_OF_WEEK: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  static PAYMENT_OPTIONS: string[] = [
    'Free',
    'Insurance',
    'Medicaid',
    'Sliding Scale'
  ];

  // Org service categories.
  static ORG_SERVICE_CATEGORIES: string[] = [
    'clothing',
    'food',
    'medicalCare',
    'mentalHealth',
    'publicTransport',
    'techSupport',
    'financialLiteracy',
    'substanceUse',
    'religiousOrganization',
    'housingSupport',
    'parenting',
    'volunteerOpportunities',
    'legalAssistance',
    'publicBenefitAssistance',
    'employment',
    'education',
    'supportNetworksAndMentoring',
    'domesticViolenceSexualAssault'
  ];

  // Dictionary of CSV column indices to organization fields.
  static CSV_ORG_FIELD_DICT = {
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
    food: 27,
    medicalCare: 28,
    mentalHealth: 29,
    publicTransport: 30,
    techSupport: 31,
    financialLiteracy: 32,
    substanceUse: 33,
    religiousOrganization: 34,
    housingSupport: 35,
    parenting: 36,
    volunteerOpportunities: 37,
    legalAssistance: 38,
    publicBenefitAssistance: 39,
    employment: 40,
    education: 41,
    supportNetworksAndMentoring: 42,
    domesticViolenceSexualAssault: 43,
    payment: 44,
    transportation: 45,
    languages: 46,
    seniorRequirements: 47,
    eligibilityRequirements: 48,
    bringWithYou: 49,
    additionalNotes: 50
  };

  // Dictionary of CSV org service field to service name.
  static CSV_ORG_SERVICE_DICT = {
    clothing: 'Clothing',
    food: 'Food',
    medicalCare: 'Medical Care',
    mentalHealth: 'Mental Health',
    publicTransport: 'Public Transport',
    techSupport: 'Tech Support',
    financialLiteracy: 'Financial Literacy',
    substanceUse: 'Substance Use',
    religiousOrganization: 'Religious Organization',
    housingSupport: 'Housing Support',
    parenting: 'Parenting',
    volunteerOpportunities: 'Volunteer Opportunities',
    legalAssistance: 'Legal Assistance',
    publicBenefitAssistance: 'Public Benefit Assistance',
    employment: 'Employment',
    education: 'Education',
    supportNetworksAndMentoring: 'Support Networks and Mentoring',
    domesticViolenceSexualAssault: 'Domestic Violence/Sexual Assault'
  };
}
