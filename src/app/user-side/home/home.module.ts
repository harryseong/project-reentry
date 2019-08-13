import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NearMeComponent} from './components/near-me/near-me.component';
import {ByCategoriesComponent} from './components/by-categories/by-categories.component';
import {SharedModule} from '../../shared/shared.module';
import {HomeComponent} from './home.component';
import { NearMeResultsComponent } from './components/near-me/near-me-results/near-me-results.component';



@NgModule({
  declarations: [
    NearMeComponent,
    ByCategoriesComponent,
    HomeComponent,
    NearMeResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeModule { }
