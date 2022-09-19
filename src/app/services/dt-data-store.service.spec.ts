import { TestBed } from '@angular/core/testing';

import { DtDataStoreService } from './dt-data-store.service';

describe('DtDataStoreService', () => {
  let service: DtDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtDataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
