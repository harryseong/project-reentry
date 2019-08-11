import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent {

  constructor(private dialogRef: MatDialogRef<HelpDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}