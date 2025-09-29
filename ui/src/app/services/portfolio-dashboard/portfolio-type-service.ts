import { Injectable, signal } from '@angular/core';
import { AddPortfolioDialog } from '../../components/dialogs/add-portfolio-dialog/add-portfolio-dialog';
import { ITmytsToolBar } from '../../interfaces/tmyts-toolbar-interface';
import { SelectAssetDialog } from '../../components/dialogs/select-asset-dialog/select-asset-dialog';

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
          title: "Asset analysis",
          dialog: {
            dialog_title: 'Select asset',
            button_text: 'Select',
            button_icon: 'search_insights',
            dialog_content: SelectAssetDialog
          }
        }
      ]
  ); 
  
  getDialogType(id: string): ITmytsToolBar | undefined{
    const found = this.dialogTypes().find(w => w.id === id);
    return found
  }
}
