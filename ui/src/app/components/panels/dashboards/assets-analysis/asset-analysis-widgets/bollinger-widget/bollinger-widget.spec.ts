import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BollingerWidget } from './bollinger-widget';

describe('BollingerWidget', () => {
  let component: BollingerWidget;
  let fixture: ComponentFixture<BollingerWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BollingerWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BollingerWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
