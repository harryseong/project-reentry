import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';
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
export class OrgViewComponent implements OnInit {
  orgName: string;
  org = null;
  loading = true;
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private db: FirestoreService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.orgName = this.route.snapshot.params.org_id;
    this.org = this.db.getOrg(this.orgName);
    this.loadMap();
    this.db.updateOrgViewCount(this.orgName);
  }

  loadMap() {
    const gpsCoords = this.org.address.gpsCoords;
    const mapOption = {
      zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP, draggable: false,
      clickableIcons: false, streetViewControl: false, streetViewControlOptions: false
    };
    const map = new google.maps.Map(document.getElementById('gMap'), mapOption);
    const marker = new google.maps.Marker({map, position: gpsCoords});
    map.setCenter(gpsCoords);
    this.loading = false;
  }
}
