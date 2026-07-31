import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsChip } from './tmyts-chip';

describe('TmytsChip', () => {
  let component: TmytsChip;
  let fixture: ComponentFixture<TmytsChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsChip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults iconName to empty and classType to error-container', () => {
    expect(component.iconName).toBe('');
    expect(component.classType).toBe('error-container');
    expect(component.getStyleObject()).toBe('error-container');
  });

  it('getStyleObject reflects a custom classType input', () => {
    component.classType = 'success-container';
    expect(component.getStyleObject()).toBe('success-container');
  });
});
