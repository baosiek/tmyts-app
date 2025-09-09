import { AfterViewInit, Component, inject, input, signal, Type } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { MatDialog } from '@angular/material/dialog';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';

export type IDialog = {
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

  title = input.required()
  model_name = input()
  dialog = inject(MatDialog);
  data = input<IDialog>()

  constructor() {
  }

  ngAfterViewInit(): void {
    console.log("DATA: ", this.data())
  }

  add() {
    if (this.model_name()) {
      console.log("Button add was clicked")
      this.dialog.open(
        GeneraliDialog,
        {
          data: {
            title: this.data()?.title,
            content: this.data()?.dialog,
          }
        }
      )
    }
  }
}
