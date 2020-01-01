import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../core/services/firestore/firestore.service';

@Component({
  selector: 'app-user-side',
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.scss']
})
export class UserSideComponent implements OnInit {
  allOrgs$ = null;
  serviceCategories$ = null;

  constructor(private db: FirestoreService) {
    this.allOrgs$ = db.allOrgs$;
    this.serviceCategories$ = db.serviceCategories$;
  }

  ngOnInit() {
    this.db.getAllOrgs();
    this.db.getAllServiceCategories();
  }
}
