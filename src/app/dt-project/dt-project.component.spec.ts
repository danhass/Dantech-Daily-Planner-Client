import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { DtProjectComponent } from './dt-project.component';

describe('DtProjectItemsComponent', () => {
  let component: DtProjectComponent;
  let fixture: ComponentFixture<DtProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtProjectComponent ],
      imports: [
         HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
