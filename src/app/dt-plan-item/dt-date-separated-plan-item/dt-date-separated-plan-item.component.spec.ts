import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { DtDateSeparatedPlanItemComponent } from './dt-date-separated-plan-item.component';

describe('DtDateSeparatedPlanItemComponent', () => {
  let component: DtDateSeparatedPlanItemComponent;
  let fixture: ComponentFixture<DtDateSeparatedPlanItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtDateSeparatedPlanItemComponent ],
      imports: [
        HttpClientTestingModule
      ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(DtDateSeparatedPlanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
