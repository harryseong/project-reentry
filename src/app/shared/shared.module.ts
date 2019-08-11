import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterialModule} from './modules/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from './pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {NavComponent} from './components/nav/nav.component';
import {FooterComponent} from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import {HelpDialogComponent} from './components/dialogs/help-dialog/help-dialog.component';


@NgModule({
  declarations: [
    NavComponent,
    HeaderComponent,
    FooterComponent,
    ProgressSpinnerComponent,
    HelpDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    NavComponent,
    HeaderComponent,
    FooterComponent,
    MaterialModule,
    PipesModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  entryComponents: [
    HelpDialogComponent
  ]
})
export class SharedModule { }
