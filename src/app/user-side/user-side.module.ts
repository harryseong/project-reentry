import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSideRoutingModule } from './user-side-routing.module';
import {AboutComponent} from './components/about/about.component';
import {SharedModule} from '../shared/shared.module';
import { UserSideComponent } from './user-side.component';
import {HomeModule} from './home/home.module';


@NgModule({
  declarations: [
    AboutComponent,
    UserSideComponent,
  ],
  imports: [
    CommonModule,
    UserSideRoutingModule,
    SharedModule,
    HomeModule
  ]
})
export class UserSideModule { }
