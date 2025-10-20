import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdxWidget } from './adx-widget';

describe('AdxWidget', () => {
  let component: AdxWidget;
  let fixture: ComponentFixture<AdxWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdxWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdxWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
