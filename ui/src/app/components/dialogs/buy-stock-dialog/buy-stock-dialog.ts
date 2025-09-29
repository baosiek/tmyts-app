import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { PortfolioActivityMode } from '../../../models/portfolio-activity-model';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { catchError } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { MatListOption } from '@angular/material/list';
import { LiveDataService } from '../../../services/live-data/live-data-service';
import { createNewSymbolData } from './buy-stock-model';
import { SymbolModel, createNewSymbol } from '../../../models/symbol-model';
import { DialogData } from '../general-dialog/general-dialog';


@Component({
  selector: 'app-buy-stock-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    PercentPipe
],
  templateUrl: './buy-stock-dialog.html',
  styleUrl: './buy-stock-dialog.scss'
})
export class BuyStockDialog implements OnInit{

  // Inject required services
  portfolioActivityService = inject(PortfolioActivityService);
  
  term: string | null | undefined = ''
  quichSearch = inject(QuickSearchService)
  liveData = inject(LiveDataService)
  results = signal<SymbolModel[]>([])
  data = input.required<DialogData>()

  // Imported code start
  private _formBuilder = inject(FormBuilder);

  symbolFormGroup = this._formBuilder.group({
    symbol: ['', Validators.required],
  });

  symbolDetailFormGroup = this._formBuilder.group({
    user_id: [1],
    portfolio_id: [0],
    symbol_id: [0, Validators.required],
    quantity: [0, Validators.required],
    purchase_price: [0.00, Validators.required],
    purchase_date: [new Date(), Validators.required],
    broker_id: [1, Validators.required] /*  this has to come from database*/
  });

  selectedItem: SymbolModel = createNewSymbol();
  symbolData = signal(createNewSymbolData())

  constructor() {}

  ngOnInit(): void {
    this.symbolFormGroup.get('symbol')?.valueChanges
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
      'broker_id': 1
    }

    this.symbolDetailFormGroup.setValue(formValues)
  }

  searchTerm(event: KeyboardEvent) {
    if (this.term) {
    this.quichSearch.quickSearch(this.term)
    .pipe()
    .subscribe(
      (response) => {
        this.results.set(response)
      }
    );
    }     
  }

  onSelectionChange(stepper: MatStepper, selectedOptions: MatListOption[]){
    const selectedValue = selectedOptions.map(option => option.value).at(0) as SymbolModel;
    this.selectedItem = selectedValue
    this.liveData.getSymbolData(this.selectedItem.symbol)
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
          this.symbolData.set(data);
          stepper.next();
        }
        
      }
    );
  }

  buyStock() {
    if (this.selectedItem.id){
      const data = this.symbolDetailFormGroup.value as PortfolioActivityMode
      data.symbol_id = this.selectedItem.id
      this.portfolioActivityService.insertNewActivity(data)
      .pipe(
        catchError(
          (error) => {
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
