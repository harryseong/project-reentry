import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSpreadsheetUploadComponent } from './org-spreadsheet-upload.component';

describe('OrgSpreadsheetUploadComponent', () => {
  let component: OrgSpreadsheetUploadComponent;
  let fixture: ComponentFixture<OrgSpreadsheetUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgSpreadsheetUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSpreadsheetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
