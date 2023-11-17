import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtUserCredentialsComponent } from './dt-user-credentials.component';

describe('DtUserCredentialsComponent', () => {
  let component: DtUserCredentialsComponent;
  let fixture: ComponentFixture<DtUserCredentialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DtUserCredentialsComponent]
    });
    fixture = TestBed.createComponent(DtUserCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
