import { Component, input } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';

@Component({
  selector: 'app-adline-widget',
  imports: [],
  templateUrl: './adline-widget.html',
  styleUrl: './adline-widget.scss'
})
export class AdlineWidget {

  data = input.required<DialogData>();

}
