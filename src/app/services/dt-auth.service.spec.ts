import { TestBed } from '@angular/core/testing';

import { DtAuthService } from './dt-auth.service';

describe('DtAuthService', () => {
  let service: DtAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
