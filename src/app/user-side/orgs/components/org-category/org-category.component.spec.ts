import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgCategoryComponent } from './org-category.component';

describe('OrgCategoryComponent', () => {
  let component: OrgCategoryComponent;
  let fixture: ComponentFixture<OrgCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
