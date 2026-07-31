import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MockLiveHealthCheck } from '../../../services/yf_live/mock-live-data';
import { OnlineSignal } from './online-signal';

describe('OnlineSignal', () => {
  let component: OnlineSignal;
  let fixture: ComponentFixture<OnlineSignal>;
  let liveService: jasmine.SpyObj<MockLiveHealthCheck>;

  beforeEach(async () => {
    liveService = jasmine.createSpyObj('MockLiveHealthCheck', ['checkYFssLive']);

    await TestBed.configureTestingModule({
      imports: [OnlineSignal],
      providers: [{ provide: MockLiveHealthCheck, useValue: liveService }],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineSignal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    liveService.checkYFssLive.and.returnValue(of({ status_code: 200 }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('sets isHealthy true when the health check reports status_code 200', fakeAsync(() => {
    liveService.checkYFssLive.and.returnValue(of({ status_code: 200 }));
    fixture.detectChanges();
    tick(0);

    expect(component.isHealthy).toBeTrue();
    discardPeriodicTasks();
  }));

  it('sets isHealthy false when the health check reports a non-200 status', fakeAsync(() => {
    liveService.checkYFssLive.and.returnValue(of({ status_code: 500 }));
    fixture.detectChanges();
    tick(0);

    expect(component.isHealthy).toBeFalse();
    discardPeriodicTasks();
  }));

  it('sets isHealthy false when the health check errors', fakeAsync(() => {
    liveService.checkYFssLive.and.returnValue(throwError(() => new Error('down')));
    fixture.detectChanges();
    tick(0);

    expect(component.isHealthy).toBeFalse();
    discardPeriodicTasks();
  }));
});
