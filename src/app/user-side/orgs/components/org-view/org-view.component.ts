import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';
import {Subscription} from 'rxjs';
import {Constants} from '../../../../shared/constants/constants';
declare var google: any;

@Component({
  selector: 'app-org-view',
  templateUrl: './org-view.component.html',
  styleUrls: ['./org-view.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(750, style({ opacity: 1 })),
      ])
    ])
  ]
})
export class OrgViewComponent implements OnInit, AfterViewInit, OnDestroy {
  currentOrg$ = null;
  currentOrgSubscription$: Subscription;
  daysOfWeek = Constants.DAYS_OF_WEEK;

  constructor(private db: FirestoreService,
              private route: ActivatedRoute) {
    this.currentOrg$ = db.currentOrg$;
  }

  ngOnInit() {
    this.loadOrg();
    this.currentOrgSubscription$ = this.db.currentOrg$.subscribe(org => {
      if (org !== null) {
        this.db.updateOrgViewCount(org.name);
      }
    });
  }

  ngAfterViewInit() {
    this.loadMap(this.currentOrg$.value);
  }

  ngOnDestroy() {
    this.currentOrgSubscription$.unsubscribe();
  }

  loadOrg() {
    const orgCity = this.route.snapshot.params.org_city;
    const orgName = this.route.snapshot.params.org_name;
    this.db.getOrg(orgCity, orgName);
  }

  loadMap(org) {
    const gpsCoords = org.address.gpsCoords;
    const mapOption = {
      zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP, draggable: false,
      clickableIcons: false, streetViewControl: false, streetViewControlOptions: false
    };
    const map = new google.maps.Map(document.getElementById('gMap'), mapOption);
    const marker = new google.maps.Marker({map, position: gpsCoords});
    map.setCenter(gpsCoords);
  }
}
