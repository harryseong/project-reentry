import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Sort} from '@angular/material/sort';
import {FirestoreService} from '../../core/services/firestore/firestore.service';
import {BehaviorSubject, Subscription} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'role'];
  dataSource: MatTableDataSource<any>;
  users$: BehaviorSubject<any[]> = null;
  usersSubscription$: Subscription;
  userList: any[] = [];

  constructor(private db: FirestoreService) {
    this.users$ = this.db.users$;
  }

  ngOnInit() {
    this.usersSubscription$ = this.users$.subscribe(users => {
      this.userList = users;
      this.dataSource = new MatTableDataSource<any>(users);
    });
  }

  ngOnDestroy(): void {
    this.usersSubscription$.unsubscribe();
  }

  sortData(sort: Sort) {
    const data = this.userList.slice();
    if (!sort.active || sort.direction === '') {
      this.userList = data;
      return;
    }

    this.userList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'role':
          return this.compare(a.role, b.role, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource = new MatTableDataSource(this.userList);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateRole(user): void {
    this.db.updateUserRole(user);
  }
}
