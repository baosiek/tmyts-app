import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { PortfolioComponentsDataExchange } from '../../../../interfaces/portfolio-components-data-exchange';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { AppConfigService } from '../../../../services/app-config/app-config-service';
import { AuthService } from '../../../../services/auth/auth-service';
import { Portfolios } from './portfolios';

function portfolio(overrides: Partial<PortfolioModel> = {}): PortfolioModel {
  return { portfolio_id: 1, user_id: 7, portfolio_name: 'main', description: '', ...overrides };
}

describe('Portfolios', () => {
  let component: Portfolios;
  let fixture: ComponentFixture<Portfolios>;
  let httpMock: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  function flushInitialLoad(userPortfolio = 'main', portfolios: PortfolioModel[] = [portfolio()]) {
    httpMock.expectOne('http://localhost:8000/users/get_users').flush({
      user_id: 7, user_name: 'bao', email: 'bao@example.com', theme: 'light', portfolio_name: userPortfolio, user_photo: null,
    });
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush(portfolios);
  }

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [Portfolios],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: AuthService, useValue: { userId: () => 7 } },
      ],
    })
      // MatDialogModule/MatSnackBarModule (pulled in via MATERIAL_IMPORTS)
      // each re-provide their service at the module-injector level, which
      // sits closer to the component than a root-level TestBed override -
      // only a component-level override can shadow it.
      .overrideComponent(Portfolios, {
        add: {
          providers: [
            { provide: MatDialog, useValue: dialog },
            { provide: MatSnackBar, useValue: snackBar },
          ],
        },
      })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Portfolios);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    flushInitialLoad();
    expect(component).toBeTruthy();
  });

  it('loads the toolbar config matching this dashboard id', () => {
    flushInitialLoad();
    expect(component.data?.id).toBe('portfolio');
  });

  it("on construction, loads the user's last selected portfolio and the full portfolio list", () => {
    flushInitialLoad('main', [portfolio({ portfolio_name: 'main' })]);

    expect(component.selectedPortfolio).toBe('main');
    expect(component.portfolioList).toEqual([portfolio({ portfolio_name: 'main' })]);
  });

  it('add() opens the add-portfolio dialog and refreshes the portfolio list on close', () => {
    flushInitialLoad();
    const created = portfolio({ portfolio_name: 'new-portfolio' });
    dialog.open.and.returnValue({ afterClosed: () => of(created) } as ReturnType<MatDialog['open']>);

    component.add();

    expect(dialog.open).toHaveBeenCalled();
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([created]);
    expect(component.selectedPortfolio).toBe('new-portfolio');
  });

  it('receiveMessage persists the newly selected portfolio for the user', () => {
    flushInitialLoad();
    const event = PortfolioComponentsDataExchange.create(7, 'second', ['AAPL']);

    component.receiveMessage(event);

    const req = httpMock.expectOne('http://localhost:8000/users/update_users');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ portfolio_name: 'second' });
    req.flush({ status_code: '200', message: 'Preferences updated' });

    expect(snackBar.open).toHaveBeenCalledWith('Preferences updated', 'Close');
    expect(component.dataExchangeToChild).toBe(event);
  });

  it('updatePortfolioList shows a snackbar error when the request fails', () => {
    flushInitialLoad();

    component.updatePortfolioList();
    const req = httpMock.expectOne('http://localhost:8000/portfolios/get_all/');
    req.flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.open).toHaveBeenCalled();
  });
});
