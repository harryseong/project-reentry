import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', loadChildren: () => import('./home/home.module').then(module => module.HomeModule)},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule)},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
