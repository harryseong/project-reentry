import { Component, OnInit } from '@angular/core';
import {DialogService} from '../../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dialogService: DialogService) { }

  ngOnInit() {}

  openHelpDialog() {
    this.dialogService.openHelpDialog();
  }
}
