import { Component, inject, Input, input, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createPortfolio, PortfolioModel } from '../../../models/portfolio-model';
import { PortfolioDatabaseService } from '../../../services/portfolio-database/portfolio-database-service';
import { catchError } from 'rxjs';
import { ReturnMessage } from '../../../models/return-message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from '../general-dialog/general-dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-portfolio-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-portfolio-dialog.html',
  styleUrl: './add-portfolio-dialog.scss'
})
export class AddPortfolioDialog implements OnInit {

  portfolio_model: Partial<PortfolioModel> = createPortfolio();
  portfilioDbService = inject(PortfolioDatabaseService)
  private _snackBar = inject(MatSnackBar);

  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  data = input.required<DialogData>()
  user_id!: number;

  constructor(public dialogRef: MatDialogRef<AddPortfolioDialog>) {}

  ngOnInit() {
    this.user_id = this.data().data.get('userId')
    this.portfolio_model.user_id = this.user_id;
    console.log(`user id: ${this.portfolio_model.user_id}`)
  }

  save() {
    this.portfilioDbService.createPortfolio(this.portfolio_model)
      .pipe(
        catchError(
          (error) => {
            throw error
          }
        )
      )
      .subscribe(
        {
          next: (response: PortfolioModel) => {
            // Handle successful response by sending the created portfolio back to portfolios component
            this.dialogRef.close(response)
            this._snackBar.open(`Portfolio [${response.portfolio_name} - ${response.description}] was created`, 'Close');
          },
          error: (error) => {
            // Handle error response
            this._snackBar.open(`HTTPError:${error.status}: Portfolio ${this.portfolio_model.id} already exists.`, 'Close');
          }
        }
      )
  }
}
