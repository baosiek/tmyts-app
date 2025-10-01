import { AfterViewInit, Component, EventEmitter, inject, input, output, Output, signal, Type } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { MatDialog } from '@angular/material/dialog';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';
import { ITmytsToolBar } from '../../../interfaces/tmyts-toolbar-interface';

export interface IDialog {
  id: number;
  title: string;
  dialog: Type<unknown>;
}

@Component({
  selector: 'app-tmyts-toolbar',
  imports: [
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './tmyts-toolbar.html',
  styleUrl: './tmyts-toolbar.scss'
})
export class TmytsToolbar{

  dialog = inject(MatDialog);
  data = input.required<ITmytsToolBar>()  
  notifyParent = output<Map<String, any>>();

  constructor() {
  }

  add() {   
    if (this.data()?.dialog) {
      const dialogRef = this.dialog.open(
        GeneraliDialog,
        {
          data: {
            title: this.data()?.dialog?.dialog_title,
            content: this.data()?.dialog?.dialog_content,
            data: this.data()          
          }
        }
      );

      dialogRef.afterClosed()
      .subscribe(
        {
          next: (result: Map<String, any>) => {
            this.notifyParent.emit(result)
          }          
        }
      );
    }
  }
}
