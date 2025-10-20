import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AroonWidget } from './aroon-widget';

describe('AroonWidget', () => {
  let component: AroonWidget;
  let fixture: ComponentFixture<AroonWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AroonWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AroonWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
