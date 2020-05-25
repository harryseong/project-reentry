import {Component, Inject, OnInit} from '@angular/core';
import {FirestoreService} from '../../../../../core/services/firestore/firestore.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  // Fields for user roles.
  roleForm = new FormGroup({
    role: new FormControl(this.data.role)
  });

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private db: FirestoreService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  saveRole() {
    const userDoc = this.db.users.doc(this.data.email);
    const selectedRole = this.roleForm.get('role').value;
    userDoc.get().subscribe(
      doc => {
        userDoc.set({
          uid: doc.data().uid,
          email: doc.data().email,
          role: selectedRole
        });
      }
    );
    this.dialogRef.close(this.data.email + ' is now a' + (selectedRole === 'admin' ? 'n ' : ' ') + selectedRole + '.');
  }
}
