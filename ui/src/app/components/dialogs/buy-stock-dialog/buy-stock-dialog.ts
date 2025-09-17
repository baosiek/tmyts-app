import { AfterViewInit, Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { SymbolModel, createNewSymbol } from '../../../models/symbol-model';
import { CurrencyPipe, JsonPipe, PercentPipe } from '@angular/common';
import { DialogData } from '../general-dialog/general-dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { PortfolioActivityMode } from '../../../models/portfolio-activity-model';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { catchError } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { LiveDataService } from '../../../services/live-data/live-data-service';
import { createNewBasicTickerData } from '../../../interfaces/basic-ticker-data-interface';


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
    portfolio_id: [1],
    symbol_id: [0, Validators.required],
    quantity: [0, Validators.required],
    purchase_price: [0.00, Validators.required],
    purchase_date: [new Date(), Validators.required],
    broker_id: [1, Validators.required] /*  this has to come from database*/
  });

  selectedItem: SymbolModel = createNewSymbol();
  tickerData = signal(createNewBasicTickerData())

  ngOnInit(): void {
    this.symbolFormGroup.get('symbol')?.valueChanges
    .subscribe(
      value => {
        this.term = value;
      }
    );
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
    const selectedValue = selectedOptions.map(option => option.value) as unknown as SymbolModel[];
    [this.selectedItem] = selectedValue
    this.liveData.getBasicTickerData([this.selectedItem.symbol])
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
        const data = response.find(tck => tck.ticker = this.selectedItem.symbol)
        if (data) {
          const tickerData = createNewBasicTickerData();
          tickerData.symbol = this.selectedItem.symbol;
          tickerData.symbol_name = this.selectedItem.symbol_name;
          tickerData.variation = data.data.variation;
          tickerData.percentage = data.data.percent;
          this.tickerData.set(tickerData);
          stepper.next();
        }
        
      }
    );
  }

  buyStock() {
    if (this.selectedItem.id){
      const data = this.symbolDetailFormGroup.value as PortfolioActivityMode
      data.symbol_id = this.selectedItem.id
      console.log(data)
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
