import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSignal } from './online-signal';

describe('OnlineSignal', () => {
  let component: OnlineSignal;
  let fixture: ComponentFixture<OnlineSignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineSignal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
