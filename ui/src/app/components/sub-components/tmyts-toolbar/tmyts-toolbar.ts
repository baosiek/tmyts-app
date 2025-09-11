import { AfterViewInit, Component, inject, input, signal, Type } from '@angular/core';
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
export class TmytsToolbar implements AfterViewInit{

  // title = input.required()
  // model_name = input()
  dialog = inject(MatDialog);
  data = input.required<ITmytsToolBar>()

  constructor() {
  }

  ngAfterViewInit(): void {
    console.log("DATA after view init: ", this.data())
  }

  add() {
    if (this.data()?.dialog) {
      const dialogRef = this.dialog.open(
        GeneraliDialog,
        {
          data: {
            title: this.data()?.dialog?.dialog_title,
            content: this.data()?.dialog?.dialog_content,
          }
        }
      )

      dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    }
  }
}
