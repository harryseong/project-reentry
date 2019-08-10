// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA2XZb07-lgkSuBeiv9WHmaPoj6Be1POrE',
    authDomain: 'project-reentry.firebaseapp.com',
    databaseURL: 'https://project-reentry.firebaseio.com',
    projectId: 'project-reentry',
    storageBucket: 'project-reentry.appspot.com',
    messagingSenderId: '313980762152'
  },
  google: {
    apiKey: 'AIzaSyBV_fYF4EF1lKyPc6gIEYYZFU1NurMozh8'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
