import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminSideComponent} from './admin-side.component';
import {LoginComponent} from './components/login/login.component';


const routes: Routes = [
  {path: '', component: AdminSideComponent, children: [
      {path: 'login', component: LoginComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSideRoutingModule { }
