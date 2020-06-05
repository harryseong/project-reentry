import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {BehaviorSubject, Subscription, SubscriptionLike} from 'rxjs';
import {Location} from "@angular/common";
import {filter} from "rxjs/operators";

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
  currentActiveLink$: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  locationSubscription$: SubscriptionLike;
  routeSubscription$: Subscription;
  routerEventsSubscription$: Subscription;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.routeSubscription$ = this.route.firstChild.url.subscribe(rsp => {
      this.setCurrentActiveLink(rsp);
    });

    this.locationSubscription$ = this.location.subscribe(location => {
      this.setCurrentActiveLink(location.url);
    });

    this.routerEventsSubscription$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: RouterEvent) => {
      this.currentActiveLink$.next(event.url);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription$ != null) {
      this.routeSubscription$.unsubscribe();
    }

    if (this.locationSubscription$ != null) {
      this.locationSubscription$.unsubscribe();
    }

    if (this.routerEventsSubscription$ != null) {
      this.routerEventsSubscription$.unsubscribe();
    }
  }

  setCurrentActiveLink(rsp) {
    const currentActiveLink = '/' + rsp.toString();
    if (this.currentActiveLink$.value !== currentActiveLink)
      this.currentActiveLink$.next(currentActiveLink);
  }
}
