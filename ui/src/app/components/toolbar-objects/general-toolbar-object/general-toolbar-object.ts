import { NgComponentOutlet } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ITmytsToolBar } from '../../../interfaces/tmyts-toolbar-interface';
import { ToolbarService } from '../../../services/tmyts-toolbar/tmyts-toolbar-service';

@Component({
  selector: 'app-general-toolbar-object',
  imports: [NgComponentOutlet, MatDialogModule],
  templateUrl: './general-toolbar-object.html',
  styleUrl: './general-toolbar-object.scss'
})
export class GeneralToolbarObject{

  data = input.required<ITmytsToolBar>()
  toolbar_object = inject(ToolbarService)

  dialogInputs = {
    object:  this.toolbar_object
  };


}
