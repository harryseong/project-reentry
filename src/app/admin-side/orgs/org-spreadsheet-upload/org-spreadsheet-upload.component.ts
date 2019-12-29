import { Component, OnInit } from '@angular/core';
import {SnackBarService} from '../../../core/services/snack-bar/snack-bar.service';
import * as papa from 'papaparse';
import {FirestoreService} from '../../../core/services/firestore/firestore.service';
import {OrgService} from '../../../core/services/org/org.service';
import {GoogleMapsService} from '../../../core/services/google-maps/google-maps.service';

@Component({
  selector: 'app-org-spreadsheet-upload',
  templateUrl: './org-spreadsheet-upload.component.html',
  styleUrls: ['./org-spreadsheet-upload.component.scss']
})
export class OrgSpreadsheetUploadComponent implements OnInit {
  private savedOrgCount: number;

  constructor(private db: FirestoreService,
              private googleMapsService: GoogleMapsService,
              private orgService: OrgService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {}

  uploadOrgCsv(files: FileList) {
    console.log(files);
    const file = files[0];
    const fileExtension = file.name.split('.').pop();
    if (fileExtension === 'csv') {
      if (file.size > 0) {
        this.processCsv(file);
      } else {
        console.error('Error: File size was 0kb.');
        this.snackBarService.openSnackBar('Error: File size was 0kb.', 'OK');
      }
    } else {
      console.error('Error: Uploaded file did not have the ".csv" extension.');
      this.snackBarService.openSnackBar('Error: Uploaded file did not have the ".csv" extension.', 'OK');
    }
  }

  processCsv(file: File) {
    console.log('CSV file upload started.');

    this.savedOrgCount = 0;
    const noAddress: string[] = [];
    const noServices: string[] = [];

    papa.parse(file, {
      complete: async results => {
        results.data.shift();
        const csvOrgs = results.data;
        for (const csvOrg of csvOrgs) {
          const org = this.orgService.mapCsvOrgToOrg(csvOrg);

          // If csvOrg has services, code address and save in FireStore database.
          // Else add to "noServices" array if csvOrg has no services.
          if (org.services.length > 0) {
            if (org.address.city !== null && org.address.city !== '' &&
              org.address.state !== null && org.address.state !== '' && org.address.zipCode !== null) {

              await this.sleep(1000);
              this.googleMapsService.codeAddressAndSave(org, false);
              this.savedOrgCount++;
            } else {
              noAddress.push(org.name);
            }
          } else {
            noServices.push(org.name);
          }
        }

        // If csvOrgs without addresses are detected, warn.
        if (noAddress.length > 0) {
          console.warn('The following csvOrgs do not have addresses: ' + JSON.stringify(noAddress));
        }

        // If csvOrgs without services are detected, warn.
        if (noServices.length > 0) {
          console.warn('The following csvOrgs do not have any listed services: ' + JSON.stringify(noServices));
        }

        this.snackBarService.openSnackBar('Successfully uploaded file. ' + this.savedOrgCount + ' orgs uploaded.', 'OK');
      }
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
