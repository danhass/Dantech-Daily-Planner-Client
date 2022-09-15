import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtLoginComponent } from './dt-login.component';

describe('DtLoginComponent', () => {
  let component: DtLoginComponent;
  let fixture: ComponentFixture<DtLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtLoginComponent ]
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
