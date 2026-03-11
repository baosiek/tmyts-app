import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { AssetModel } from '../../../models/asset-model';
import { QuickSearchService } from '../../../services/quick-search/quick-search-service';
import { TmytsSnackbar } from '../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { DialogData } from '../general-dialog/general-dialog';

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
  assetSelectionForm = this._formBuilder.group({
    asset: ['', Validators.required],
  });

  // Initializes signals
  // Holds quickSearch results
  searchResults = signal<AssetModel[]>([])
  // Term to perform quick search
  term: string | null | undefined = ''

  // Injects required services
  quickSearch = inject(QuickSearchService)

  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  dialogData = input.required<DialogData>()

  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectAssetDialog>,
  ) { }

  ngOnInit(): void {
    this.assetSelectionForm.get('asset')?.valueChanges
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
    const selectedValue = selectedOptions.map(option => option.value).at(0) as AssetModel;

    const result: Map<String, AssetModel> = new Map();
    result.set("asset", selectedValue)

    this.dialogRef.close(result)
  }

  onEnterKey() {
    // holds the form field value
    const assetValue = this.assetSelectionForm.get('asset')?.value;

    // as asset value can be null it checks if it is null
    const typedAsset = this.searchResults().find(v => v.asset.toLowerCase() === (assetValue ? assetValue.toLowerCase() : ''))

    // if typed asset was found, ends the dialog returning the asset 
    if (typedAsset) {
      const result: Map<String, AssetModel> = new Map();
      result.set("asset", typedAsset)
      this.dialogRef.close(result)
    } else {
      // Renders error snack-bar
      const message: string = `Could not find asset [ ${this.assetSelectionForm.get('asset')?.value} ]`
      this._snackBar.openFromComponent(
        TmytsSnackbar, {
        data: { 'message': message, 'action': 'Close' },
        panelClass: ['error-snackbar-theme']
      }
      );
    }
  }
}
