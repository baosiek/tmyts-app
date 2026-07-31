import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppConfigService } from '../../../services/app-config/app-config-service';
import { IndexCardInterface, IndexesCards } from './indexes-cards';

describe('IndexesCards', () => {
  let component: IndexesCards;
  let fixture: ComponentFixture<IndexesCards>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [IndexesCards],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    })
      .overrideComponent(IndexesCards, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(IndexesCards);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/live/indexes-data/').flush([]);
    expect(component).toBeTruthy();
  });

  it('requests all configured index ids and merges the human-readable names into INDEXES', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/live/indexes-data/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.INDEXES_NAME.map((row) => row.id));

    const response: IndexCardInterface[] = [
      { id: '^GSPC', name: '', points: 5000, variation: 10, percent: 0.01, week_variation: -5, week_percent: -0.005 },
    ];
    req.flush(response);

    expect(component.INDEXES.length).toBe(1);
    expect(component.INDEXES[0].name).toBe('S&P 500');
  });

  it('shows a snackbar error and leaves INDEXES empty when the request fails', () => {
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8000/live/indexes-data/').flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.openFromComponent).toHaveBeenCalled();
    expect(component.INDEXES).toEqual([]);
  });
});
