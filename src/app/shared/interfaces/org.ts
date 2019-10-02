export interface Org {
  additionalNotes: string;
  address: {
    city: string,
    gpsCoords: {
      lat: number,
      lng: number,
    },
    state: string,
    streetAddress1: string,
    streetAddress2: string,
    zipCode: number
  };
  bringWithYou: string;
  contact: {
    email: string,
    name: string,
    phone: string,
  };
  description: string;
  eligibilityRequirements: string;
  hours: {
    specifyHours: boolean;
    friday: {
      end: string,
      open: boolean,
      start: string,
    },
    monday: {
      end: string,
      open: boolean,
      start: string,
    },
    saturday: {
      end: string,
      open: boolean,
      start: string,
    },
    sunday: {
      end: string,
      open: boolean,
      start: string,
    },
    thursday: {
      end: string,
      open: boolean,
      start: string,
    },
    tuesday: {
      end: string,
      open: boolean,
      start: string,
    },
    wednesday: {
      end: string,
      open: boolean,
      start: string,
    }
  };
  languages: any[];
  name: string;
  payment: string;
  seniorRequirements: string;
  services: any[];
  transportation: string;
  viewData: any;
  website: string;
}
