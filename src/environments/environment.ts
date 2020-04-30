// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverBaseUrl: 'http://localhost:44351/api/',
  imagesUrl: 'http://localhost:44351/api/images',
  // productsUrl: 'http://localhost:8888/api/products',
  productsUrl: 'http://localhost:44351/api/products',
  serverBaseUrl2: 'https://localhost:44385/api/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
