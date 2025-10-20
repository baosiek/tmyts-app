import { TestBed } from '@angular/core/testing';
import { ToolbarService } from './tmyts-toolbar-service';

describe('PortfolioTypeService', () => {
  let service: ToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
