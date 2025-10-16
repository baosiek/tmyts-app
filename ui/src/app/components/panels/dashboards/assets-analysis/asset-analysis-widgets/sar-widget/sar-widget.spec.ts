import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarWidget } from './sar-widget';

describe('SarWidget', () => {
  let component: SarWidget;
  let fixture: ComponentFixture<SarWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SarWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SarWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
