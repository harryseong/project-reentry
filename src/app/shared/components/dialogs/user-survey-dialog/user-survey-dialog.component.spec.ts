import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSurveyDialogComponent } from './user-survey-dialog.component';

describe('UserSurveyDialogComponent', () => {
  let component: UserSurveyDialogComponent;
  let fixture: ComponentFixture<UserSurveyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSurveyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
