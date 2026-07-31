import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexCardInterface } from '../indexes-cards';
import { GeneralIndexCard } from './general-index-card';

function indexCard(overrides: Partial<IndexCardInterface> = {}): IndexCardInterface {
  return {
    id: '^GSPC', name: 'S&P 500', points: 5000.1234, variation: 12.5, percent: 0.0125,
    week_variation: -30.2, week_percent: -0.006, ...overrides,
  };
}

describe('GeneralIndexCard', () => {
  let component: GeneralIndexCard;
  let fixture: ComponentFixture<GeneralIndexCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralIndexCard],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralIndexCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('index', indexCard());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders an up arrow and variation-up styling for a non-negative daily variation', () => {
    fixture.componentRef.setInput('index', indexCard({ variation: 12.5 }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.arrow-up')).toBeTruthy();
    expect(el.querySelector('.arrow-down')).toBeFalsy();
    expect(el.querySelector('.variation-row')?.classList.contains('variation-up')).toBeTrue();
  });

  it('renders a down arrow and variation-down styling for a negative daily variation', () => {
    fixture.componentRef.setInput('index', indexCard({ variation: -5 }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.arrow-down')).toBeTruthy();
    expect(el.querySelector('.arrow-up')).toBeFalsy();
    expect(el.querySelector('.variation-row')?.classList.contains('variation-down')).toBeTrue();
  });

  it('truncates the index name to 9 characters', () => {
    fixture.componentRef.setInput('index', indexCard({ name: 'IBOVESPA-EXTRA-LONG-NAME' }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.index-label')?.textContent?.trim()).toBe('IBOVESPA-');
  });
});
