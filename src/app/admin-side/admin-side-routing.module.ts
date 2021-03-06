import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminSideComponent} from './admin-side.component';
import {LoginComponent} from './login/login.component';
import {OrgsComponent} from './orgs/orgs.component';
import {AuthGuard} from '../core/guards/auth/auth.guard';
import {UsersComponent} from './users/users.component';
import {HomeComponent} from './home/home.component';
import {OrgSpreadsheetUploadComponent} from './orgs/org-spreadsheet-upload/org-spreadsheet-upload.component';
import {OrgAllComponent} from './orgs/org-all/org-all.component';
import {OrgCreateComponent} from './orgs/org-create/org-create.component';
import {OrgViewComponent} from './orgs/org-view/org-view.component';
import {OrgEditComponent} from './orgs/org-edit/org-edit.component';


const routes: Routes = [
  {path: '', component: AdminSideComponent, children: [
      {path: '', pathMatch: 'full', component: HomeComponent},
      {path: 'orgs', component: OrgsComponent, children: [
          {path: 'new', component: OrgCreateComponent},
          {path: 'view/:org_city/:org_name', component: OrgViewComponent},
          {path: 'edit/:org_city/:org_name', component: OrgEditComponent},
          {path: 'upload_csv', component: OrgSpreadsheetUploadComponent},
          {path: '', component: OrgAllComponent},
        ], canActivate: [AuthGuard]},
      {path: 'users', component: UsersComponent, canActivate: [AuthGuard]}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSideRoutingModule { }
