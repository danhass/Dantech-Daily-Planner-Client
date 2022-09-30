import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtRecurrenceComponent } from './dt-recurrence.component';

describe('DtRecurrenceComponent', () => {
  let component: DtRecurrenceComponent;
  let fixture: ComponentFixture<DtRecurrenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtRecurrenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtRecurrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
