import { Injectable, signal } from '@angular/core';
import { IDialog } from '../../components/sub-components/tmyts-toolbar/tmyts-toolbar';
import { AddPortfolioDialog } from '../../components/dialogs/add-portfolio-dialog/add-portfolio-dialog';

@Injectable({
  providedIn: 'root'
})
export class PortfolioTypeService {

  dialogTypes = signal<IDialog>(
    {
      id: 1,
      title: "Portfolio",
      dialog: AddPortfolioDialog
    }
  );
  
}
