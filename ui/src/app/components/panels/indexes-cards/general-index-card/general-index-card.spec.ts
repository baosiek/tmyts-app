import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralIndexCard } from './general-index-card';

describe('GeneralIndexCard', () => {
  let component: GeneralIndexCard;
  let fixture: ComponentFixture<GeneralIndexCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralIndexCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralIndexCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
