import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AppConfigService } from '../../../services/app-config/app-config-service';
import { DialogData } from '../general-dialog/general-dialog';
import { AddPortfolioDialog } from './add-portfolio-dialog';

describe('AddPortfolioDialog', () => {
  let component: AddPortfolioDialog;
  let fixture: ComponentFixture<AddPortfolioDialog>;
  let httpMock: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddPortfolioDialog>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AddPortfolioDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPortfolioDialog);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    const dialogData: DialogData = {
      title: 'Add portfolio',
      content: AddPortfolioDialog,
      data: new Map<string, unknown>([['userId', 42]]),
    };
    fixture.componentRef.setInput('dialogData', dialogData);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('reads userId from dialogData and seeds portfolio_model.user_id on init', () => {
    fixture.detectChanges();

    expect(component.user_id).toBe(42);
    expect(component.portfolio_model.user_id).toBe(42);
  });

  it('save() POSTs the portfolio and closes the dialog with the response', () => {
    fixture.detectChanges();
    component.portfolio_model.portfolio_name = 'main';
    component.portfolio_model.description = 'my main portfolio';

    component.save();

    const req = httpMock.expectOne('http://localhost:8000/portfolios/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.portfolio_model);

    const response = { portfolio_id: 1, user_id: 42, portfolio_name: 'main', description: 'my main portfolio' };
    req.flush(response);

    expect(dialogRef.close).toHaveBeenCalledWith(response);
  });

  it('save() does not close the dialog when the request fails', () => {
    fixture.detectChanges();

    component.save();

    const req = httpMock.expectOne('http://localhost:8000/portfolios/');
    req.flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
