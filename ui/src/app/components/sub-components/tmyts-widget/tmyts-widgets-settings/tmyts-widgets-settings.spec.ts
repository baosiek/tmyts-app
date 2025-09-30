import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsWidgetsSettings } from './tmyts-widgets-settings';

describe('TmytsWidgetsSettings', () => {
  let component: TmytsWidgetsSettings;
  let fixture: ComponentFixture<TmytsWidgetsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsWidgetsSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsWidgetsSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
