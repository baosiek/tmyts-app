import { Component, inject, input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { DialogData } from '../../dialogs/general-dialog/general-dialog';
import { NgComponentOutlet } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tmyts-widgets-enlarged',
  imports: [
    ...MATERIAL_IMPORTS,
    NgComponentOutlet
],
  templateUrl: './tmyts-widgets-enlarged.html',
  styleUrl: './tmyts-widgets-enlarged.scss'
})
export class TmytsWidgetsEnlarged {

  generalDialogData = inject(MAT_DIALOG_DATA)  

  dialogInputs = {
    data:  this.generalDialogData
  };

}
