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
    Friday: {
      end: string,
      open: boolean,
      start: string,
    },
    Monday: {
      end: string,
      open: boolean,
      start: string,
    },
    Saturday: {
      end: string,
      open: boolean,
      start: string,
    },
    Sunday: {
      end: string,
      open: boolean,
      start: string,
    },
    Thursday: {
      end: string,
      open: boolean,
      start: string,
    },
    Tuesday: {
      end: string,
      open: boolean,
      start: string,
    },
    Wednesday: {
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
  specifyHours: boolean;
  transportation: string;
  viewData: any;
  website: string;
}
