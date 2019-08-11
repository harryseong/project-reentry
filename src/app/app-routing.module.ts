import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', loadChildren: () => import('./user-side/user-side.module').then(module => module.UserSideModule)},
  {path: 'admin', loadChildren: () => import('./admin-side/admin-side.module').then(module => module.AdminSideModule)},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
