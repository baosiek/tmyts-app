import { Component, input } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';

@Component({
  selector: 'app-aroon-widget',
  imports: [],
  templateUrl: './aroon-widget.html',
  styleUrl: './aroon-widget.scss'
})
export class AroonWidget {

  data = input.required<DialogData>();
}
