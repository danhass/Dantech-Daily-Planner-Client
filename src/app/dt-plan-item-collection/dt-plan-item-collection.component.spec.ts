import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { DtPlanItemCollectionComponent } from './dt-plan-item-collection.component';

describe('DtPlanItemCollectionComponent', () => {
  let component: DtPlanItemCollectionComponent;
  let fixture: ComponentFixture<DtPlanItemCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtPlanItemCollectionComponent ],
      imports: [
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtPlanItemCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
