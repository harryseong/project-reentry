import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSideRoutingModule } from './user-side-routing.module';
import {SharedModule} from '../shared/shared.module';
import { UserSideComponent } from './user-side.component';
import {HomeModule} from './home/home.module';
import {AboutModule} from './about/about.module';
import {OrgsModule} from './orgs/orgs.module';


@NgModule({
  declarations: [
    UserSideComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    UserSideRoutingModule,
    SharedModule,
    HomeModule,
    AboutModule,
    OrgsModule
  ]
})
export class UserSideModule { }
