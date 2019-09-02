import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../core/services/firestore/firestore.service';

@Component({
  selector: 'app-admin-side',
  templateUrl: './admin-side.component.html',
  styleUrls: ['./admin-side.component.scss']
})
export class AdminSideComponent implements OnInit {

  constructor(private db: FirestoreService) { }

  ngOnInit() {
    this.db.getAllAdmins();
  }

}
