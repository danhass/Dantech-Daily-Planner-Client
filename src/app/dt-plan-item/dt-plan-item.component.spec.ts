import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';

import { DtPlanItemComponent } from './dt-plan-item.component';

describe('DtPlanItemComponent', () => {
  let component: DtPlanItemComponent;
  let fixture: ComponentFixture<DtPlanItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtPlanItemComponent ],
      imports: [
        HttpClientTestingModule,
      ]    
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtPlanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
