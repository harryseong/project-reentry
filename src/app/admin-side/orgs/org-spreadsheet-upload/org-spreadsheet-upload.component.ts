import { Component, OnInit } from '@angular/core';
import {SnackBarService} from '../../../core/services/snack-bar/snack-bar.service';
import * as papa from 'papaparse';
import {FirestoreService} from '../../../core/services/firestore/firestore.service';
import {OrgService} from '../../../core/services/org/org.service';
import {Org} from '../../../shared/interfaces/org';

@Component({
  selector: 'app-org-spreadsheet-upload',
  templateUrl: './org-spreadsheet-upload.component.html',
  styleUrls: ['./org-spreadsheet-upload.component.scss']
})
export class OrgSpreadsheetUploadComponent implements OnInit {

  constructor(private db: FirestoreService,
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
        this.snackBarService.openSnackBar('Error: File size was 0kb.', 'OK');
      }
    } else {
      this.snackBarService.openSnackBar('Error: Uploaded file did not have the ".csv" extension.', 'OK');
    }
  }

  processCsv(file: File) {
    let orgCount = 0;
    papa.parse(file, {
      complete: results => {
        results.data.shift();
        const csvOrgs = results.data;
        for (const csvOrg of csvOrgs) {
          const org = this.orgService.processCsvOrg(csvOrg);
          // this.saveOrg(org);
          orgCount++;
        }
        this.snackBarService.openSnackBar('Successfully uploaded file. ' + orgCount + ' orgs uploaded.', 'OK');
      }
    });
  }

  saveOrg(org: Org) {
    this.db.organizations.add(org);
  }
}
