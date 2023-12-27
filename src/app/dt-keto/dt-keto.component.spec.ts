import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtKetoComponent } from './dt-keto.component';

describe('DtKetoComponent', () => {
  let component: DtKetoComponent;
  let fixture: ComponentFixture<DtKetoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DtKetoComponent]
    });
    fixture = TestBed.createComponent(DtKetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
