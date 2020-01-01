import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FirestoreService} from '../../../../../core/services/firestore/firestore.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-languages-dialog',
  templateUrl: './languages-dialog.component.html',
  styleUrls: ['./languages-dialog.component.scss']
})
export class LanguagesDialogComponent implements OnInit, OnDestroy {
  languagesSubscription$: Subscription;
  languages = [];
  editMode = false;
  createMode = false;
  prevLanguageName = '';
  languageForm = new FormGroup({
    language: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<LanguagesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private db: FirestoreService) { }

  ngOnInit() {
    this.languagesSubscription$ = this.db.languages.valueChanges()
      .subscribe(rsp => this.languages = this.db._sort(rsp, 'language'));
  }

  ngOnDestroy(): void {
    this.languagesSubscription$.unsubscribe();
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    const newDoc = {language: this.languageForm.get('language').value};
    this.db.languages.add(newDoc);
    this.endCreateMode();
  }

  update() {
    const query = this.db.languages.ref.where('language', '==', this.prevLanguageName);
    const newDoc = {language: this.languageForm.get('language').value};
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => this.db.languages.doc(docSnapshot.id).set(newDoc));
      }
    });
    this.endEditMode();
  }

  delete(language: string) {
    const query = this.db.languages.ref.where('language', '==', language);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => this.db.languages.doc(docSnapshot.id).delete());
      }
    });
  }

  enableEditMode(language: string) {
    this.prevLanguageName = language;
    this.languageForm.controls.language.setValue(language);
    this.beginEditMode();
  }

  endEditMode() {
    this.editMode = false;
    this.resetForms();
  }

  beginEditMode() {
    this.editMode = true;
  }

  enableCreateMode() {
    this.languageForm.controls.language.setValue('');
    this.beginCreateMode();
  }

  endCreateMode() {
    this.createMode = !this.createMode;
    this.resetForms();
  }
  beginCreateMode() {
    this.createMode = true;
  }

  resetForms() {
    this.languageForm.reset();
  }
}
