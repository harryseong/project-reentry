import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Sort} from '@angular/material/sort';
import {FirestoreService} from '../../core/services/firestore/firestore.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackBarService} from '../../core/services/snack-bar/snack-bar.service';
import {DialogService} from '../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['email', 'role'];
  dataSource: MatTableDataSource<any>;
  userList: any[] = [];

  constructor(private db: FirestoreService,
              public dialog: MatDialog,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.db.users.valueChanges().subscribe(rsp => {
      this.userList = rsp;
      this.dataSource = new MatTableDataSource(rsp);
    });
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

  editRole(email: string, role: string): void {
    this.dialogService.openUserDialog(email, role)
  }
}
