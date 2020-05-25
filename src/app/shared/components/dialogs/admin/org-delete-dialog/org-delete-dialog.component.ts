import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FirestoreService} from '../../../../../core/services/firestore/firestore.service';
import {UserService} from '../../../../../core/services/user/user.service';

@Component({
  selector: 'app-org-delete-dialog',
  templateUrl: './org-delete-dialog.component.html',
  styleUrls: ['./org-delete-dialog.component.scss']
})
export class OrgDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<OrgDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private firestoreService: FirestoreService,
              private router: Router,
              private userService: UserService) {}

  deleteOrg() {
    this.firestoreService.deleteOrg(this.data.orgCity, this.data.orgName, true);
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
