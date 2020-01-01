import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {HelpDialogComponent} from '../../../shared/components/dialogs/help-dialog/help-dialog.component';
import {LanguagesDialogComponent} from '../../../shared/components/dialogs/admin/languages-dialog/languages-dialog.component';
import {ServiceCategoriesDialogComponent} from '../../../shared/components/dialogs/admin/service-categories-dialog/service-categories-dialog.component';
import {OrgDeleteDialogComponent} from '../../../shared/components/dialogs/admin/org-delete-dialog/org-delete-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openHelpDialog() {
    this.dialog.open(HelpDialogComponent, {
      width: '30em',
      maxWidth: '95%'
    });
  }

  openEditLanguagesDialog(languages: any[]) {
    this.dialog.open(LanguagesDialogComponent, {
      width: '30em',
      data: {
        languages
      },
      autoFocus: false
    });
  }

  openEditServiceCategoriesDialog(serviceCategories: any[]) {
    this.dialog.open(ServiceCategoriesDialogComponent, {
      width: '30em',
      data: {
        serviceCategories
      },
      autoFocus: false
    });
  }

  openOrgDeleteDialog(orgName: string) {
    this.dialog.open(OrgDeleteDialogComponent, {
      data: {orgName},
      width: '30em',
      autoFocus: false
    });
  }
}
