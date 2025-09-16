import { AfterViewInit, Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { SymbolModel, createNewSymbol } from '../../../models/symbol-model';
import { JsonPipe } from '@angular/common';
import { DialogData } from '../general-dialog/general-dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { PortfolioActivityModel } from '../../../models/portfolio-log-model';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { catchError } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { MatListOption, MatSelectionList } from '@angular/material/list';


@Component({
  selector: 'app-buy-stock-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    FormsModule,
    ReactiveFormsModule,
],
  templateUrl: './buy-stock-dialog.html',
  styleUrl: './buy-stock-dialog.scss'
})
export class BuyStockDialog implements OnInit{

  // Inject required services
  portfolioActivityService = inject(PortfolioActivityService);
  
  term: string | null | undefined = ''
  quichSearch = inject(QuickSearchService)
  results = signal<SymbolModel[]>([])
  data = input.required<DialogData>()

  // Imported code start
  private _formBuilder = inject(FormBuilder);

  symbolFormGroup = this._formBuilder.group({
    userId: [1],
    poertfolioId: [1],
    symbol: ['', Validators.required],
    quantity: [0, Validators.required],
    purchasePrice: [0.00, Validators.required],
    purchaseDate: [new Date(), Validators.required],
    broker: [1, Validators.required] /*  this has to come from database*/
  });

  selectedItem: SymbolModel = createNewSymbol();

  stepOneCompleted = false;

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
    this.stepOneCompleted = true;
    this.quichSearch.quickSearch(this.term)
    .pipe()
    .subscribe(
      (response) => {
        this.results.set(response)
      }
    );
    } else {
      this.stepOneCompleted = false;
    }    
  }

  onSelectionChange(stepper: MatStepper, selectedOptions: MatListOption[]){
    const selectedValue = selectedOptions.map(option => option.value) as unknown as SymbolModel[];
    [this.selectedItem] = selectedValue
    stepper.next()
  }

  buyStock() {
    const data = this.symbolFormGroup.value as PortfolioActivityModel
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
    console.log("Will by stock for: ");
  }


}
