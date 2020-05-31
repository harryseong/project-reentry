import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {SnackBarService} from '../../../../core/services/snack-bar/snack-bar.service';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';

@Component({
  selector: 'app-user-survey-dialog',
  templateUrl: './user-survey-dialog.component.html',
  styleUrls: ['./user-survey-dialog.component.scss']
})
export class UserSurveyDialogComponent implements OnInit {
  userSurveyForm: FormGroup;
  userTypes = ['Citizen', 'Attorney', 'Social Service Provider', 'Family Member', 'Other'];

  constructor(private db: FirestoreService,
              private dialogRef: MatDialogRef<UserSurveyDialogComponent>,
              private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    // this.loadUserSurveyForm();
  }

  loadUserSurveyForm() {
    this.userSurveyForm = new FormGroup({
      userType: new FormControl('', [Validators.required]),
      date: new FormControl(new Date())
    });
  }

  decline() {
    localStorage.setItem('surveyStatus', 'declined');
    this.dialogRef.close();
  }

  defer() {
    localStorage.setItem('surveyStatus', 'deferred');
    this.dialogRef.close();
  }

  submit() {
    this.db.submitSurvey(this.userSurveyForm.value);
    localStorage.setItem('surveyStatus', 'submitted');
    this.snackBarService.openSnackBar('Thank you for your response!', 'OK', 3000);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
