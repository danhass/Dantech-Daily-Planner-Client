import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { DtPlannerService } from './dt-planner.service';

describe('DtPlannerService', () => {
  let service: DtPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]    
    });
    service = TestBed.inject(DtPlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
