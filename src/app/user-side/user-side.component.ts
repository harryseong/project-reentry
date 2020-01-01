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

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 10);
  }
}
