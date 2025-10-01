import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsWidget } from './tmyts-widget';

describe('TmytsWidget', () => {
  let component: TmytsWidget;
  let fixture: ComponentFixture<TmytsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
