import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdlineWidget } from './adline-widget';

describe('AdlineWidget', () => {
  let component: AdlineWidget;
  let fixture: ComponentFixture<AdlineWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdlineWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdlineWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
