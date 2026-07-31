import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PortfolioModel } from '../../../../models/portfolio-model';
import { AppConfigService } from '../../../../services/app-config/app-config-service';
import { AuthService } from '../../../../services/auth/auth-service';
import { LiveData } from './live-data';

function portfolio(overrides: Partial<PortfolioModel> = {}): PortfolioModel {
  return { portfolio_id: 1, user_id: 7, portfolio_name: 'main', description: '', ...overrides };
}

describe('LiveData', () => {
  let component: LiveData;
  let fixture: ComponentFixture<LiveData>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  function flushUser(portfolioName: string) {
    httpMock.expectOne('http://localhost:8000/users/get_users').flush({
      user_id: 7, user_name: 'bao', email: 'bao@example.com', theme: 'light', portfolio_name: portfolioName, user_photo: null,
    });
  }

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [LiveData],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: AuthService, useValue: { userId: () => 7 } },
      ],
    })
      // MatDialogModule (pulled in via this component's imports) re-provides
      // MatDialog/MatSnackBar at the module-injector level, which sits
      // closer to the component than a root-level TestBed override.
      .overrideComponent(LiveData, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LiveData);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio()]);
    expect(component).toBeTruthy();
  });

  it('loads the toolbar config matching this dashboard id', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio()]);
    expect(component.data?.id).toBe('live_data');
  });

  it("on construction, sets selectedPortfolio from the user's profile and loads the portfolio list", () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio({ portfolio_name: 'main' })]);

    expect(component.selectedPortfolio).toBe('main');
    expect(component.portfolioList).toEqual([portfolio({ portfolio_name: 'main' })]);
  });

  it('falls back to the first portfolio when the user has no last-selected portfolio', () => {
    flushUser('');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([
      portfolio({ portfolio_name: 'first' }),
      portfolio({ portfolio_name: 'second' }),
    ]);

    expect(component.selectedPortfolio).toBe('first');
  });

  it('updatePortfolioList shows a snackbar error when the request fails', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.open).toHaveBeenCalled();
  });
});
