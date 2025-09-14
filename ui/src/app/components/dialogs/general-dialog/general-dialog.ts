import { Component, inject, input, Type } from '@angular/core';
import { MatCardHeader } from "@angular/material/card";
import { MatCardTitle } from "@angular/material/card";
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { IDialog } from '../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DialogData {
  data: Map<string, any> = new Map();

  constructor() {}

  addProperty(key: string, value: any){
    this.data.set(key, value)
  }

  getProperty(key: string): any {
    return this.data.get(key);
  }
}

@Component({
  selector: 'app-general-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    NgComponentOutlet,
  ],
  templateUrl: './general-dialog.html',
  styleUrl: './general-dialog.scss'
})
export class GeneraliDialog {

  generalDialogData = inject(MAT_DIALOG_DATA)


  dialogInputs = {
    data: this.generalDialogData.dialogData
  };

  constructor() {}

}
