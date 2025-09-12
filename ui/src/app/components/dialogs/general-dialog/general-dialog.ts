import { Component, inject, input } from '@angular/core';
import { MatCardHeader } from "@angular/material/card";
import { MatCardTitle } from "@angular/material/card";
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { IDialog } from '../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  data = inject(MAT_DIALOG_DATA)
  dialogInputs = {
    user_id: this.data.user_id
  };

}
