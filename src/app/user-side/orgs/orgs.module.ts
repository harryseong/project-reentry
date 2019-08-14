import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { OrgsComponent } from '../orgs/orgs.component';
import { OrgCategoryComponent } from './components/org-category/org-category.component';
import { OrgViewComponent } from './components/org-view/org-view.component';



@NgModule({
  declarations: [OrgsComponent, OrgCategoryComponent, OrgViewComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class OrgsModule { }
