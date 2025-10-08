import { Component, input } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';

@Component({
  selector: 'app-adx-widget',
  imports: [],
  templateUrl: './adx-widget.html',
  styleUrl: './adx-widget.scss'
})
export class AdxWidget {

  data = input.required<IWidgetConfig>();
}
