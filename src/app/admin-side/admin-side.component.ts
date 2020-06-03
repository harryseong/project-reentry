import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../core/services/firestore/firestore.service';

@Component({
  selector: 'app-admin-side',
  templateUrl: './admin-side.component.html',
  styleUrls: ['./admin-side.component.scss']
})
export class AdminSideComponent implements OnInit {

  constructor(public db: FirestoreService) {}

  ngOnInit() {
    this.db.getAllUsers();
    this.db.getAllAdmins();
    this.db.getAllOrgs();
    this.db.getAllLanguages();
    this.db.getAllServiceCategories();
  }
}
