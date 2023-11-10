import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { DtPlannerDaysComponent } from './dt-planner-days.component';

describe('DtPlannerDaysComponent', () => {
  let component: DtPlannerDaysComponent;
  let fixture: ComponentFixture<DtPlannerDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtPlannerDaysComponent ],
      imports: [
        HttpClientTestingModule,
      ]    
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
