import { AfterViewInit, Component, inject, Input, input, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormsModule } from '@angular/forms';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { SymbolModel } from '../../../models/symbol-model';
import { JsonPipe } from '@angular/common';
import { DialogData } from '../general-dialog/general-dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-stock-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './buy-stock-dialog.html',
  styleUrl: './buy-stock-dialog.scss'
})
export class BuyStockDialog implements AfterViewInit{

  term: string = ''
  quichSearch = inject(QuickSearchService)
  results = signal<SymbolModel[]>([])


  data = input.required<DialogData>()

  ngAfterViewInit(): void {
    console.log("Portfolio to add stock is: ", this.data().getProperty('portfolioId'))
  }

  searchTerm(event: KeyboardEvent) {
    this.term += event.key
    this.quichSearch.quickSearch(this.term)
    .pipe()
    .subscribe(
      (response) => {
        this.results.set(response)
      }
    );
    console.log(this.term)
  }


}
