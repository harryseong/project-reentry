import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgsComponent } from '../orgs/orgs.component';
import {SharedModule} from '../../shared/shared.module';
import {OrgSpreadsheetUploadComponent} from './org-spreadsheet-upload/org-spreadsheet-upload.component';
import {OrgCreateComponent} from './org-create/org-create.component';
import {OrgEditComponent} from './org-edit/org-edit.component';
import {OrgViewComponent} from './org-view/org-view.component';
import {OrgAllComponent} from './org-all/org-all.component';

@NgModule({
  declarations: [
    OrgsComponent,
    OrgSpreadsheetUploadComponent,
    OrgAllComponent,
    OrgCreateComponent,
    OrgEditComponent,
    OrgViewComponent
  ],
  exports: [
    OrgsComponent,
    OrgSpreadsheetUploadComponent,
    OrgAllComponent,
    OrgCreateComponent,
    OrgEditComponent,
    OrgViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class OrgsModule { }
