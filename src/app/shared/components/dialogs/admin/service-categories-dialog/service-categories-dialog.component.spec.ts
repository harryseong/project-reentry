import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoriesDialogComponent } from './service-categories-dialog.component';

describe('ServiceCategoriesDialogComponent', () => {
  let component: ServiceCategoriesDialogComponent;
  let fixture: ComponentFixture<ServiceCategoriesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCategoriesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCategoriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
