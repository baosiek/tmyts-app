import { Component, inject, input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import { IWidgetConfig } from '../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { TmytsWidgetsSettings } from "./tmyts-widgets-settings/tmyts-widgets-settings";
import { CommonModule } from '@angular/common';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InfoDialog } from '../../dialogs/info-dialog/info-dialog';
import { createDefaultWidgetConfigModel } from '../../../models/widget-config-model';

@Component({
  selector: 'app-tmyts-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    NgComponentOutlet,
    TmytsWidgetsSettings,
    CommonModule,
    MatButtonModule
],
  templateUrl: './tmyts-widget.html',
  styleUrl: './tmyts-widget.scss',
  host: {
    '[style.grid-area]': "'span ' + (widgetConfig().rows ?? 1) + ' / span ' + (widgetConfig().columns ?? 1)",
  }
})
export class TmytsWidget implements OnInit, OnChanges{

  tootTipText: string = 'The Obv text is here to help'

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
  indicatorData = signal<Record<string, IWidgetConfig>>({});

  constructor(){}

  ngOnInit(): void {
    this.indicatorData.set(
      {
      'data': this.widgetConfig()
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.indicatorData.set(
      {
      'data': this.widgetConfig()
      }
    )
  }

  toggleFullscreen(): void {
    // define data to pass to dialog
    const dataDialog: Map<string, IWidgetConfig> = new Map<string, any>();
    dataDialog.set('dataDialog', this.widgetConfig());
    const dialogRef = this.dialog.open(
      GeneraliDialog,
       {
         data: {
           title: this.widgetConfig().title,
           content: this.widgetConfig().content,
           data: dataDialog
         },
         width: '100%',
       }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        // console.log(`Dialog enlarged closed`)
      }
    )
   }

   openInfoContainer() {
    const dataDialog: Map<string, IWidgetConfig> = new Map<string, any>();
    const config: IWidgetConfig = {
      id: 0,
      user_id: 0,
      dashboard_id: '',
      label: 'obv',
      title: '',
      symbol: '',
      content: InfoDialog,
      rows: 0,
      columns: 0,
      background_color: '',
      color: ''
    };
    config.label = "obv"
    dataDialog.set('dataDialog', config);
    const dialogRef = this.dialog.open(
      GeneraliDialog,
       {
         data: {
           title: this.widgetConfig().title,
           content: InfoDialog,
           data: dataDialog
         },
         width: '400px',
         height: '600px'
       }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        // console.log(`Dialog enlarged closed`)
      }
    )
   }
}

