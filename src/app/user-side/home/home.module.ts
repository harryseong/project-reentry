import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NearMeComponent} from './components/near-me/near-me.component';
import {ByCategoriesComponent} from './components/by-categories/by-categories.component';
import {SharedModule} from '../../shared/shared.module';
import {HomeComponent} from './home.component';



@NgModule({
  declarations: [
    NearMeComponent,
    ByCategoriesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeModule { }
