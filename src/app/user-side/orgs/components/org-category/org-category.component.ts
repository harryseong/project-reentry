import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../../../core/services/firestore/firestore.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormControl} from '@angular/forms';
import {TableService} from '../../../../core/services/table/table.service';

@Component({
  selector: 'app-org-category',
  templateUrl: './org-category.component.html',
  styleUrls: ['./org-category.component.scss'],
  animations: [
    trigger('transitionAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(750, style({ opacity: 1 })),
      ])
    ])
  ]
})
export class OrgCategoryComponent implements OnInit {
  serviceCategory: string;
  subheaderText: string;
  orgs: any[] = null;

  tableFilter = new FormControl('');
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'city', 'county'];

  constructor(private db: FirestoreService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.serviceCategory = this.route.snapshot.params.category_id;
    this.subheaderText = this.serviceCategory + ' Services';
    this.getOrgs();
  }

  getOrgs() {
    this.orgs = this.db.getOrgsByServiceCategories([this.serviceCategory]);
    this.dataSource = new MatTableDataSource<any>(this.orgs);

    // Set custom filter predicate for searching nested fields of organization objects.
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return TableService.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    const data = Object.assign([], this.orgs);
    data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return TableService.compare(a.name, b.name, isAsc);
        case 'city':
          return TableService.compare(a.address.city, b.address.city, isAsc);
        case 'county':
          return TableService.compare(a.address.county, b.address.county, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource = new MatTableDataSource(data);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
