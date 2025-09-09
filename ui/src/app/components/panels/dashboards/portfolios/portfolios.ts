import { Component, inject, Injectable, input, signal, Type } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { IDialog, TmytsToolbar } from '../../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { AddPortfolioDialog } from '../../../dialogs/add-portfolio-dialog/add-portfolio-dialog';
import { PortfolioTypeService } from '../../../../services/portfolio-type/portfolio-type-service';
@Component({
  selector: 'app-portfolios',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar
  ],
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.scss'
})

export class Portfolios {

  protected title: string = "Portfolio management"
  protected model_name: string = "portfolio"
  portfolioService = inject(PortfolioTypeService);

  constructor() {
    console.log("Dialogs: ", this.portfolioService.dialogTypes())
  }
}
