import { Component, inject, OnChanges, OnInit, Type } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: Type<unknown>;
  data: Map<string, any>;
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
    dialogData:  this.generalDialogData
  };
}
