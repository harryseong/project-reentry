import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './components/about/about.component';
import {UserSideComponent} from './user-side.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {path: '', component: UserSideComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'about', component: AboutComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSideRoutingModule { }
