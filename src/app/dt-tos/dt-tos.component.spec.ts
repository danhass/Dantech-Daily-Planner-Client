import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtTosComponent } from './dt-tos.component';

describe('DtTosComponent', () => {
  let component: DtTosComponent;
  let fixture: ComponentFixture<DtTosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtTosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtTosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
