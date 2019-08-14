import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FirestoreService} from '../../core/services/firestore/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1, }))
      ])
    ])
  ],
})
export class HomeComponent implements OnInit {
  subheaderText = 'Connecting you to the services you need...';

  constructor(private db: FirestoreService) { }

  ngOnInit() {
    this.db.getAllOrgs();
    this.db.getAllServiceCategories();
  }

}
