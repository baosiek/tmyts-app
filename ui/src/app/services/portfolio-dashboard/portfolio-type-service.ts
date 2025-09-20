import { Injectable, signal } from '@angular/core';
import { AddPortfolioDialog } from '../../components/dialogs/add-portfolio-dialog/add-portfolio-dialog';
import { ITmytsToolBar } from '../../interfaces/tmyts-toolbar-interface';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDashboardService {

    dialogTypes = signal<ITmytsToolBar[]>(
      [
        {
          id: 'portfolio',
          title: "Portfolios",
        },
        {
          id: 'assets_analysis',
          title: "Assets analysis"
        }
      ]
  ); 
  
  getDialogType(id: string): ITmytsToolBar | undefined{
    const found = this.dialogTypes().find(w => w.id === id);
    return found
  }
}
