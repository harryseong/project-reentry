import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {Subscription, SubscriptionLike} from 'rxjs';
import {Location} from "@angular/common";
import {DialogService} from '../../core/services/dialog/dialog.service';

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
export class HomeComponent implements OnInit, OnDestroy {
  subheaderText = 'Connecting you to community resources';
  navLinks = [
    {path: '/', label: 'Near Me'},
    {path: '/categories', label: 'By Categories'},
  ];
  activeLink = null;
  locationSubscription$: SubscriptionLike;
  routeSubscription$: Subscription;

  constructor(private dialogService: DialogService,
              private location: Location,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSubscription$ = this.route.firstChild.url.subscribe(rsp => this.setCurrentActiveLink(rsp));
    this.locationSubscription$ = this.location.subscribe(location => {
      this.setCurrentActiveLink(location.url);
    });

    this.triggerUserSurvey();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription$ != null ) {
      this.routeSubscription$.unsubscribe();
    }

    if (this.locationSubscription$ != null) {
      this.locationSubscription$.unsubscribe();
    }
  }

  triggerUserSurvey() {
    this.dialogService.openUserSurveyDialog();
  }

  setCurrentActiveLink(rsp) {
    const currentActiveLink = '/' + rsp.toString();
    if (this.activeLink !== currentActiveLink)
      this.activeLink = currentActiveLink;
  }
}
