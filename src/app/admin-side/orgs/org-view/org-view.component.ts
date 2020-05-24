import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../../core/services/firestore/firestore.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {DialogService} from '../../../core/services/dialog/dialog.service';
import {Constants} from '../../../shared/constants/constants';
import {BehaviorSubject} from 'rxjs';
import {Org} from '../../../shared/interfaces/org';
declare var google: any;

@Component({
  selector: 'app-org-view',
  templateUrl: './org-view.component.html',
  styleUrls: ['./org-view.component.scss'],
  animations: [
  trigger('transitionAnimations', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(1000, style({ opacity: 1 })),
      ])
    ])
  ]
})
export class OrgViewComponent implements OnInit, AfterViewInit {
  currentOrg$: BehaviorSubject<Org> = null;
  daysOfWeek = Constants.DAYS_OF_WEEK;

  constructor(public db: FirestoreService,
              private dialogService: DialogService,
              private route: ActivatedRoute) {
    this.currentOrg$ = db.currentOrg$;
  }

  ngOnInit() {
    this.loadOrg();
  }

  ngAfterViewInit() {
    this.loadMap(this.currentOrg$.value);
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

  openOrgDeleteDialog(orgCity: string, orgName: string) {
      this.dialogService.openOrgDeleteDialog(orgCity, orgName);
  }
}
