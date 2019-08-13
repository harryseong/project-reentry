import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearMeResultsComponent } from './near-me-results.component';

describe('NearMeResultsComponent', () => {
  let component: NearMeResultsComponent;
  let fixture: ComponentFixture<NearMeResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearMeResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearMeResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
