import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtTabsComponent } from './dt-tabs.component';

describe('DtTabsComponent', () => {
  let component: DtTabsComponent;
  let fixture: ComponentFixture<DtTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
