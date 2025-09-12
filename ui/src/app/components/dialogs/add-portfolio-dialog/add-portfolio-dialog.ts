import { Component, inject, Input, input, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createPortfolio, PortfolioModel } from '../../../models/portfolio-model';
import { PortfolioDatabaseService } from '../../../services/portfolio-database/portfolio-database-service';
import { catchError } from 'rxjs';
import { ReturnMessage } from '../../../models/return-message';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  portfolio_model: PortfolioModel = createPortfolio();
  portfilioDbService = inject(PortfolioDatabaseService)
  private _snackBar = inject(MatSnackBar);
  @Input() user_id!: string;

  ngOnInit() {
    this.portfolio_model.user_id = this.user_id;
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
          next: (response: ReturnMessage) => {
            // Handle successful response
            this._snackBar.open(`HTTP:${response.status_code} - ${response.message}`, 'Close');
          },
          error: (error) => {
            // Handle error response
            this._snackBar.open(`HTTPError:${error.status}: Portfolio ${this.portfolio_model.portfolio_id} already exists.`, 'Close');
          }
        }
      )
  }
}
