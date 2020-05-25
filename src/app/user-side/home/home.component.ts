import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

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
  subheaderText = 'Connecting you to the services you need...';
  navLinks = [
    {path: '/', label: 'Near Me'},
    {path: '/categories', label: 'By Categories'},
  ];
  activeLink = this.navLinks[0].path;
  routeSubscription$: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSubscription$ = this.route.firstChild.url.subscribe(rsp => {
      const currentActiveLink = '/' + rsp.toString();
      if (this.activeLink !== currentActiveLink)
        this.activeLink = currentActiveLink;
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription$ != null) {
      this.routeSubscription$.unsubscribe();
    }
  }
}
