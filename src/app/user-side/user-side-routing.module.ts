import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {UserSideComponent} from './user-side.component';
import {HomeComponent} from './home/home.component';
import {OrgsComponent} from './orgs/orgs.component';
import {OrgCategoryComponent} from './orgs/components/org-category/org-category.component';
import {OrgViewComponent} from './orgs/components/org-view/org-view.component';


const routes: Routes = [
  {path: '', component: UserSideComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'about', component: AboutComponent},
      {path: 'orgs', component: OrgsComponent, children: [
          {path: 'category/:category_id', component: OrgCategoryComponent},
          {path: ':org_id', component: OrgViewComponent}
        ]}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSideRoutingModule { }
