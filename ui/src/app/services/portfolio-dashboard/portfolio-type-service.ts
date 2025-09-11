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
          title: "Portfolio management",
          dialog: {
            button_text: 'portfolio',
            button_icon: 'add',
            dialog_title: 'Create a new portfolio',
            dialog_content: AddPortfolioDialog
          } 
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
