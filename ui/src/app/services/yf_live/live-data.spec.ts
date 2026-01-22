import { TestBed } from '@angular/core/testing';

import { LiveHealthCheck } from './live-data';

describe('LiveHealthCheck', () => {
  let service: LiveHealthCheck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveHealthCheck);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
