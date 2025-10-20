import { TestBed } from '@angular/core/testing';

import { AssetsAnalysisDashboardService } from './assets-analysis-dashboard-service';

describe('AssetsAnalysisDashboardService', () => {
  let service: AssetsAnalysisDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsAnalysisDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
