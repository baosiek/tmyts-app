import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { SymbolModel } from '../../../models/symbol-model';
import { catchError, of } from 'rxjs';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogData } from '../general-dialog/general-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../sub-components/tmyts-snackbar/tmyts-snackbar';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-asset-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './select-asset-dialog.html',
  styleUrl: './select-asset-dialog.scss'
})
export class SelectAssetDialog implements OnInit {

  // Injects the formbuilder to create the forms
  private _formBuilder = inject(FormBuilder);

  /**
  * Two steps:
  * 1) Asset selection
  * 
  * Each step on form
  */

  // Asset selection field
  assetDelectionForm = this._formBuilder.group({
    symbol: ['', Validators.required],
  });

  // Initializes signals
  // Holds quickSearch results
  searchResults = signal<SymbolModel[]>([])
  // Term to perform quick search
  term: string | null | undefined = ''

  // Injects required services
  quickSearch = inject(QuickSearchService)

  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  data = input.required<DialogData>()

  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectAssetDialog>,
  ){}

  ngOnInit(): void {
    this.assetDelectionForm.get('symbol')?.valueChanges
      .subscribe(
        value => {
          this.term = value;
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
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: { 'message': message, 'action': 'Close' },
                panelClass: ['error-snackbar-theme']
              }
            );
            return of([]);
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

  onSelectionChange(selectedOptions: MatListOption[]) {
    const selectedValue = selectedOptions.map(option => option.value).at(0) as SymbolModel;
    
    const result: Map<String, SymbolModel> = new Map();
    result.set("symbol", selectedValue)
    
    this.dialogRef.close(result)
  }
}
