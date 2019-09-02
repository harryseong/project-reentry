import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminSideComponent} from './admin-side.component';
import {LoginComponent} from './components/login/login.component';
import {OrgsComponent} from './orgs/orgs.component';
import {AuthGuard} from '../core/guards/auth/auth.guard';
import {UsersComponent} from './users/users.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {path: '', component: AdminSideComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'orgs', component: OrgsComponent, canActivate: [AuthGuard]},
      {path: 'users', component: UsersComponent, canActivate: [AuthGuard]}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSideRoutingModule { }
