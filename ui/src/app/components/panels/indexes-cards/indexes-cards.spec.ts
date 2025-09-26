import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexesCards } from './indexes-cards';

describe('IndexesCards', () => {
  let component: IndexesCards;
  let fixture: ComponentFixture<IndexesCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexesCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexesCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
