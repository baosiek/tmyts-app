import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { createNewSymbol, SymbolModel } from '../../../models/symbol-model';
import { MatStepper } from '@angular/material/stepper';
import { MatListOption } from '@angular/material/list';
import { LiveDataService } from '../../../services/live-data/live-data-service';
import { catchError } from 'rxjs';
import { createNewSymbolData } from '../buy-stock-dialog/buy-stock-model';
import { DialogData } from '../general-dialog/general-dialog';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PortfolioActivityMode } from '../../../models/portfolio-activity-model';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';

@Component({
  selector: 'app-buy-asset-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule,
    MatDatepickerModule,
    FormsModule,
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

  
  // Initializes valiables
  // Term to perform quick search
  term: string | null | undefined = ''
  // Holds the selected symbol by the user
  selectedSymbol: SymbolModel = createNewSymbol();

  // Initializes signals
  // Holds quickSearch results
  searchResults = signal<SymbolModel[]>([])
  // Holds symbol live data like price
  symbolLiveData = signal(createNewSymbolData())
  // Holds data passed from PortfolioTableRud component
  data = input.required<DialogData>()  

  /**
   * Three steps:
   * 1) Asset selection
   * 2) Transaction type (buy, sell, add dividends/interest)
   * 3) Transaction data
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
    broker_id: [1, Validators.required],
  });

  constructor(){}

  ngOnInit(): void {
    this.stepOneForm.get('symbol')?.valueChanges
    .subscribe(
      value => {
        this.term = value;
      }
    );
    
    const value  = this.data().data.get('portfolioId')
    const formValues = {
      'user_id': 1,
      'portfolio_id': value,
      'purchase_price': 0,
      'purchase_date': new Date(),
      'quantity': 0,
      'symbol_id': 0,
      'broker_id': 1,
      'fees': 0,
      'cash_in': 0
    }

    this.stepTwoForm.setValue(formValues)
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
            console.log(error);
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
    console.log(`Selected symbol is: ${JSON.stringify(selectedValue)}`)
    this.selectedSymbol = selectedValue
    this.liveData.getSymbolData(this.selectedSymbol.symbol)
    .pipe(
      catchError(
        (error) => {
          console.log(error)
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
      if (this.selectedSymbol.id){
        const data = this.stepTwoForm.value as PortfolioActivityMode
        data.symbol_id = this.selectedSymbol.id
        this.portfolioActivityService.insertNewActivity(data)
        .pipe(
          catchError(
            (error) => {
              console.log(error);
              throw error;
            }
          )
        )
        .subscribe(
          (response) => {
            console.log(`Response is: ${response}`);
          }
        );
      }
    }
}
