import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  isAdminPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  activatedRouteSubscription$: Subscription;

  constructor(private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRouteSubscription$ = this.route.parent.url.subscribe(rsp => {
      this.isAdminPage$.next(rsp.toString() === 'admin');
    });
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription$.unsubscribe();
  }

  goBack() {
    this.location.back();
  }
}
