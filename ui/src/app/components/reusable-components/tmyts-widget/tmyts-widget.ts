import { Component, inject, input, signal} from '@angular/core';
import { IWidgetConfig } from '../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgComponentOutlet } from '@angular/common';
import { TmytsWidgetsSettings } from "./tmyts-widgets-settings/tmyts-widgets-settings";
import { CommonModule } from '@angular/common';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';
import { TmytsWidgetsEnlarged } from '../tmyts-widgets-enlarged/tmyts-widgets-enlarged';
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
export class TmytsWidget{

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

  toggleFullscreen(): void {
    // define data to pass to dialog
    const data: Map<string, any> = new Map<string, any>();
    data.set('widgetConfig', this.widgetConfig());
    const dialogRef = this.dialog.open(
      GeneraliDialog,
       {
         data: {
           title: this.widgetConfig().title,
           content: TmytsWidgetsEnlarged,
           data: data
         }
       }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        console.log(`Dialog enlarged closed`)
      }
    )
   }

  constructor() {}
}

/**
 * 
 * buyAsset() {
     // Set the attributes to pass to the actual dialog, not the General one
     const data: Map<string, any> = new Map<string, any>()
     data.set('userId', this.userId())
     data.set('portfolioId', this.portfolioId())
     const dialogRef = this.dialog.open(
       GeneraliDialog,
       {
         data: {
           title: "Buy asset",
           content: BuyAssetDialog,
           data: data
         }
       }
     )
     dialogRef.afterClosed().subscribe(
       () => {
         this.getPortfolioActivityContent(
           this.portfolioId()
         );
       }
     )
   }
 * 
 */
