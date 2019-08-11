import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {HelpDialogComponent} from '../../../shared/components/dialogs/help-dialog/help-dialog.component';

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
}
