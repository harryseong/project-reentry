import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';

@Component({
  selector: 'app-by-categories',
  templateUrl: './by-categories.component.html',
  styleUrls: ['./by-categories.component.scss']
})
export class ByCategoriesComponent implements OnInit {
  serviceCategories$ = null;

  constructor(private db: FirestoreService,
              private router: Router) {
    this.serviceCategories$ = db.serviceCategories$;
  }

  ngOnInit() {}

  selectCategory(category: string) {
    this.router.navigate(['orgs', 'category', category]);
  }
}
