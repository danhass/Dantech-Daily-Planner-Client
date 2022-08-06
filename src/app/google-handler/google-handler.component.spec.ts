import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleHandlerComponent } from './google-handler.component';

describe('GoogleHandlerComponent', () => {
  let component: GoogleHandlerComponent;
  let fixture: ComponentFixture<GoogleHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleHandlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
