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
import { TmytsSnackbar } from '../../reusable-components/tmyts-snackbar/tmyts-snackbar';

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

  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  dialogData = input.required<DialogData>()
  user_id!: number;

  constructor(public dialogRef: MatDialogRef<AddPortfolioDialog>, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.user_id = this.dialogData().data.get('userId')
    this.portfolio_model.user_id = this.user_id;
  }

  save() {
    this.portfilioDbService.createPortfolio(this.portfolio_model)
    .subscribe(
      {
        next: (response: PortfolioModel) => {
          // Handle successful response
          // Sends the response obtained from the service to [portfolios] component
          this.dialogRef.close(response)

          // Renders success snack-bar
          const message: string = `Portfolio id:[${response.portfolio_name}] was created`;
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
