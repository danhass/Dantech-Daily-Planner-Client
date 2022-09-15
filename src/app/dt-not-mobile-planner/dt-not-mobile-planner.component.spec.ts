import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtNotMobilePlannerComponent } from './dt-not-mobile-planner.component';

describe('DtNotMobilePlannerComponent', () => {
  let component: DtNotMobilePlannerComponent;
  let fixture: ComponentFixture<DtNotMobilePlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtNotMobilePlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtNotMobilePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
