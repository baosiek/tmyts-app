import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { catchError } from 'rxjs';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { BrokerModel } from '../../../models/broker_model';
import { PortfolioActivityMode } from '../../../models/portfolio-activity-model';
import { ReturnMessage } from '../../../models/return-message';
import { createNewSymbol, SymbolModel } from '../../../models/symbol-model';
import { BrokerService } from '../../../services/broker/broker-service';
import { LiveDataService } from '../../../services/live-data/live-data-service';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { TmytsSnackbar } from '../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { DialogData } from '../general-dialog/general-dialog';
import { createNewSymbolData } from './buy-asset-model';

@Component({
  selector: 'app-buy-asset-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './buy-asset-dialog.html',
  styleUrl: './buy-asset-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyAssetDialog {

  // Injects the formbuilder to create the forms
  private _formBuilder = inject(FormBuilder);

  // Injects required services
  quickSearch = inject(QuickSearchService)
  liveData = inject(LiveDataService)
  portfolioActivityService = inject(PortfolioActivityService);
  brokerService = inject(BrokerService)

  
  // Initializes valiables
  // Term to perform quick search
  term: string | null | undefined = ''
  // Holds the selected symbol by the user
  selectedSymbol: SymbolModel = createNewSymbol();
  brokers: BrokerModel[] = [];

  // Initializes signals
  // Holds quickSearch results
  searchResults = signal<SymbolModel[]>([])
  // Holds symbol live data like price
  symbolLiveData = signal(createNewSymbolData())
  // Holds data passed from PortfolioTableRud component
  dialogData = input.required<DialogData>()  

  /**
   * Two steps:
   * 1) Asset selection
   * 2) Transaction data
   * 
   * Each step on form
   */

  stepOneForm = this._formBuilder.group({
    symbol: ['', Validators.required],
  });

  stepTwoForm = this._formBuilder.group({
    user_id: [1],
    portfolio_id: [0],
    symbol_id: [0, Validators.required],
    purchase_date: [new Date(), Validators.required],
    purchase_price: [0, Validators.required],
    quantity: [0, Validators.required],
    fees: [0, Validators.required],
    cash_in: [0],
    broker_id: [0, Validators.required],
  });

  constructor(public dialogRef: MatDialogRef<BuyAssetDialog>, private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.stepOneForm.get('symbol')?.valueChanges
    .subscribe(
      value => {
        this.term = value;
      }
    );
    
    const userId  = this.dialogData().data.get('userId')
    const portfolioId  = this.dialogData().data.get('portfolioId')

    const formValues = {
      'user_id': 1,
      'portfolio_id': portfolioId,
      'purchase_price': 0,
      'purchase_date': new Date(),
      'quantity': 0,
      'symbol_id': 0,
      'broker_id': 0,
      'fees': 0,
      'cash_in': 0
    }

    this.stepTwoForm.setValue(formValues)

    this.brokerService.getAll()
    .pipe(
      catchError(
        (error) => {
          throw error;
        }
      )
    )
    .subscribe(
      (response) => {
        this.brokers = response;
      }
    );
  }

  /*
  Method to search for symbols while this symbols is typed.
  The keyboard event is keyup
  */
  searchTerm(event: KeyboardEvent) {
    if (this.term) {
      this.quickSearch.quickSearch(this.term)
      .pipe(
        catchError(
          (error) => {
            throw error;
          }
        )
      )
      .subscribe(
        (response) => {
          this.searchResults.set(response)
        }
      );
    }     
  }

  /**
   * Once the user selects the symbol, its live data is retrieved
   * and the sepper moves forward
   * @param stepper 
   * @param selectedOptions 
   */
  onSymbolSelectionChange(stepper: MatStepper, selectedOptions: MatListOption[]){
    const selectedValue = selectedOptions.map(option => option.value).at(0) as SymbolModel;

    this.selectedSymbol = selectedValue
    this.liveData.getSymbolData(this.selectedSymbol.symbol)
    .pipe(
      catchError(
        (error) => {
          throw error
        }
      )
    )
    .subscribe(
      (response) => {
        const data = response;
        if (data) {
          this.symbolLiveData.set(data);
          stepper.next();
        }        
      }
    );
  }

  /**
   * Once purchase data if filled and the user presses the buy button
   * this method is executed
   */
  buyAsset() {
    if (this.selectedSymbol.symbol){
      const data = this.stepTwoForm.value as PortfolioActivityMode
      data.symbol = this.selectedSymbol.symbol
      this.portfolioActivityService.insertNewActivity(data)
      .subscribe(
        {
          next: (response: ReturnMessage) => {
            // Handle successful response
            // Sends the response obtained from the service to [portfolios] component
            this.dialogRef.close(response)

            // Renders success snack-bar
            const message: string = `Asset [${response.message}] inserted into portfolio`;
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: {'message': message, 'action': 'dismiss'},
                panelClass: ['success-snackbar-theme']
              }
            );
          },
          error: (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: {'message': message, 'action': 'Close'},
                panelClass: ['error-snackbar-theme']
              }
            );
          }
        }
      );
    }
  }
}
