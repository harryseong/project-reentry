import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-by-categories',
  templateUrl: './by-categories.component.html',
  styleUrls: ['./by-categories.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ])
    ])
  ]
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
