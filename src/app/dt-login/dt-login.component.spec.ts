import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { DtLoginComponent } from './dt-login.component';

describe('DtLoginComponent', () => {
  let component: DtLoginComponent;
  let fixture: ComponentFixture<DtLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtLoginComponent ],
      imports: [
        RouterTestingModule,        
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
