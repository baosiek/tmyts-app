import { Component, input } from '@angular/core';
import { IWidgetConfig } from '../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-tmyts-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    NgComponentOutlet,
],
  templateUrl: './tmyts-widget.html',
  styleUrl: './tmyts-widget.scss'
})
export class TmytsWidget {

  /**
   * Initializes a series of variables where:
   * widgetConfig -> holds the widget configuration like, id, title and content
   */
  widgetConfig = input.required<IWidgetConfig>();
}
