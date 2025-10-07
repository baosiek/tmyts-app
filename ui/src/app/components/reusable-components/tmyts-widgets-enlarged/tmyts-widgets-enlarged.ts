import { Component, input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { DialogData } from '../../dialogs/general-dialog/general-dialog';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-tmyts-widgets-enlarged',
  imports: [
    ...MATERIAL_IMPORTS,
  ],
  templateUrl: './tmyts-widgets-enlarged.html',
  styleUrl: './tmyts-widgets-enlarged.scss'
})
export class TmytsWidgetsEnlarged {

    // Initializes signals
  // Holds data passed from PortfolioTableRud component
  data = input.required<DialogData>()

}
