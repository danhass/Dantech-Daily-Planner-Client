import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtRecurrenceItemComponent } from './dt-recurrence-item.component';

describe('DtRecurrenceItemComponent', () => {
  let component: DtRecurrenceItemComponent;
  let fixture: ComponentFixture<DtRecurrenceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtRecurrenceItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtRecurrenceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
