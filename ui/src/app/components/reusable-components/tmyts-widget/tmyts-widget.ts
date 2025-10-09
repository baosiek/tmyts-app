import { Component, ElementRef, inject, input, NgZone, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import { IWidgetConfig } from '../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { TmytsWidgetsSettings } from "./tmyts-widgets-settings/tmyts-widgets-settings";
import { CommonModule } from '@angular/common';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';
import { MatDialog } from '@angular/material/dialog';

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
    '[style.grid-area]': "'span ' + (widgetConfig().rows ?? 1) + ' / span ' + (widgetConfig().columns ?? 1)",
  }
})
export class TmytsWidget implements OnInit{

  /**
   * Initializes a series of variables where:
   * widgetConfig -> holds the widget configuration like, id, title and content
   * showWidgetSettings -> a signal that enables to render the widget setting component instead of the widget itself
   * 
   */
  widgetConfig = input.required<IWidgetConfig>();
  showWidgetSettings = signal<boolean>(false);
  symbol = input.required<string | undefined>();
  user_id = input.required<number>();
  dialog = inject(MatDialog);
  indicatorData: Record<string, IWidgetConfig> = {};

  constructor(private elementRef: ElementRef, private ngZone: NgZone){}

  ngOnInit(): void {
    this.indicatorData = {
      'data': this.widgetConfig()
    }
  }

  toggleFullscreen(): void {
    // define data to pass to dialog
    const dataDialog: Map<string, IWidgetConfig> = new Map<string, any>();
    dataDialog.set('dataDialog', this.widgetConfig());
    // console.log(`TmytsWidget toggleFullscreen: ${JSON.stringify(dataDialog.get('dataDialog'))}`)
    const dialogRef = this.dialog.open(
      GeneraliDialog,
       {
         data: {
           title: this.widgetConfig().title,
           content: this.widgetConfig().content,
           data: dataDialog
         },
         width: '100%',
        //  height: '900px'
       }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        console.log(`Dialog enlarged closed`)
      }
    )
   }
}

