import { Injectable, signal } from '@angular/core';
import { SelectAssetDialog } from '../../components/dialogs/select-asset-dialog/select-asset-dialog';
import { OnlineSignal } from '../../components/toolbar-objects/online-signal/online-signal';
import { ITmytsToolBar } from '../../interfaces/tmyts-toolbar-interface';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

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
        },
        {
          id: 'live_data',
          title: "Live data",
          toolbar_object: {
            text: 'test',
            object_content: OnlineSignal
          }
        },
      ]
  ); 
  
  getDialogType(id: string): ITmytsToolBar | undefined{
    const found = this.dialogTypes().find(w => w.id === id);
    return found
  }
}
