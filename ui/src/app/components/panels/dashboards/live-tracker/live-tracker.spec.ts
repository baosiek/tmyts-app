import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTracker } from './live-tracker';

describe('LiveTracker', () => {
  let component: LiveTracker;
  let fixture: ComponentFixture<LiveTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
