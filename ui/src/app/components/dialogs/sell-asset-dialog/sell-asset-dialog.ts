import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sell-asset-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './sell-asset-dialog.html',
  styleUrl: './sell-asset-dialog.scss'
})
export class SellAssetDialog {

  // Injects the formbuilder to create the forms
  private _formBuilder = inject(FormBuilder);

  /*
  This form contains the selected symbol to be
  sold.
  */
  stepOneForm = this._formBuilder.group({
    symbol: ['', Validators.required],
  });


  /*
  This form contains the selling data.
  */
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

}
