import { TestBed } from '@angular/core/testing';

import { DtData } from './dt-data-store.service';

describe('DtDataStoreService', () => {
  let service: DtData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
