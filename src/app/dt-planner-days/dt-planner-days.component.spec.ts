import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtPlannerDaysComponent } from './dt-planner-days.component';

describe('DtPlannerDaysComponent', () => {
  let component: DtPlannerDaysComponent;
  let fixture: ComponentFixture<DtPlannerDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtPlannerDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtPlannerDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
