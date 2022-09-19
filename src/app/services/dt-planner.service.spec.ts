import { TestBed } from '@angular/core/testing';

import { DtPlannerService } from './dt-planner.service';

describe('DtPlannerService', () => {
  let service: DtPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtPlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
