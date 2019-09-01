import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgsComponent } from '../orgs/orgs.component';
import {SharedModule} from '../../shared/shared.module';
import {OrgSpreadsheetUploadComponent} from './org-spreadsheet-upload/org-spreadsheet-upload.component';

@NgModule({
  declarations: [
    OrgsComponent,
    OrgSpreadsheetUploadComponent
  ],
  exports: [
    OrgsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class OrgsModule { }
