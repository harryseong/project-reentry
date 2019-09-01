import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminSideComponent} from './admin-side.component';
import {LoginComponent} from './components/login/login.component';
import {OrgsComponent} from './orgs/orgs.component';


const routes: Routes = [
  {path: '', component: AdminSideComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'orgs', component: OrgsComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSideRoutingModule { }
