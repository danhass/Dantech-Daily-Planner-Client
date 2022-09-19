import { TestBed } from '@angular/core/testing';

import { DtConstantsService } from './dt-constants.service';

describe('DtConstantsService', () => {
  let service: DtConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
