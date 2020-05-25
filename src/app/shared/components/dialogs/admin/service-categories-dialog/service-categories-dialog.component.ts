import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FirestoreService} from '../../../../../core/services/firestore/firestore.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-service-categories-dialog',
  templateUrl: './service-categories-dialog.component.html',
  styleUrls: ['./service-categories-dialog.component.scss']
})
export class ServiceCategoriesDialogComponent implements OnInit, OnDestroy {
  serviceCategoriesSubscription$: Subscription;
  serviceCategories = [];
  editMode = false;
  createMode = false;
  prevServiceCategoryName = '';
  serviceCategoryForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<ServiceCategoriesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private db: FirestoreService) { }

  ngOnInit() {
    this.serviceCategoriesSubscription$ = this.db.serviceCategories.valueChanges()
      .subscribe(rsp => this.serviceCategories = this.db._sort(rsp, 'name'));
  }

  ngOnDestroy(): void {
    this.serviceCategoriesSubscription$.unsubscribe();
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    const newDoc = {name: this.serviceCategoryForm.get('name').value};
    this.db.serviceCategories.add(newDoc);
    this.endCreateMode();
  }

  update() {
    const query = this.db.serviceCategories.ref.where('name', '==', this.prevServiceCategoryName);
    const newDoc = {name: this.serviceCategoryForm.get('name').value};
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => this.db.serviceCategories.doc(docSnapshot.id).set(newDoc));
      }
    });
    this.endEditMode();
  }

  delete(serviceCategory: string) {
    const query = this.db.serviceCategories.ref.where('name', '==', serviceCategory);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('no documents found');
      } else {
        querySnapshot.forEach(docSnapshot => this.db.serviceCategories.doc(docSnapshot.id).delete());
      }
    });
  }

  enableEditMode(serviceCategoryName: string) {
    this.prevServiceCategoryName = serviceCategoryName;
    this.serviceCategoryForm.controls.name.setValue(serviceCategoryName);
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
    this.serviceCategoryForm.controls.name.setValue('');
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
    this.serviceCategoryForm.reset();
  }
}
