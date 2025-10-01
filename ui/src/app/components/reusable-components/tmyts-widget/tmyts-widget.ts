import { Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import { IWidgetConfig } from '../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { TmytsWidgetsSettings } from "./tmyts-widgets-settings/tmyts-widgets-settings";
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConnectedPosition, Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-tmyts-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    NgComponentOutlet,
    TmytsWidgetsSettings,
    CommonModule
],
  templateUrl: './tmyts-widget.html',
  styleUrl: './tmyts-widget.scss',
  host: {
    '[style.grid-area]': "'span ' + (widgetConfig().rows ?? 2) + ' / span ' + (widgetConfig().columns ?? 2)",
  }
})
export class TmytsWidget {

  /**
   * Initializes a series of variables where:
   * widgetConfig -> holds the widget configuration like, id, title and content
   * showWidgetSettings -> a signal that enables to render the widget setting component instead of the widget itself
   * 
   */
  widgetConfig = input.required<IWidgetConfig>();
  showWidgetSettings = signal<boolean>(false);
  symbol = input.required<string>();

  constructor() {}

  
}
