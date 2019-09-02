import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSideRoutingModule } from './admin-side-routing.module';
import { AdminSideComponent } from './admin-side.component';
import { LoginComponent } from './components/login/login.component';
import {SharedModule} from '../shared/shared.module';
import {OrgsModule} from './orgs/orgs.module';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AdminSideComponent,
    LoginComponent,
    UsersComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    AdminSideRoutingModule,
    SharedModule,
    OrgsModule
  ]
})
export class AdminSideModule { }
