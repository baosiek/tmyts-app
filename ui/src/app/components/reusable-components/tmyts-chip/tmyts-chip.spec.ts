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
});
