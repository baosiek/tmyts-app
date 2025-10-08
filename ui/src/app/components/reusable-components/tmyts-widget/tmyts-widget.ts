import { Component, ElementRef, inject, input, NgZone, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
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
export class TmytsWidget implements OnInit, OnChanges{

  width: number | null = null;
  height: number | null = null;
  private resizeObserver!: ResizeObserver;

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
  data: Record<string, IWidgetConfig> = {};

  constructor(private elementRef: ElementRef, private ngZone: NgZone){}

  ngOnInit(): void {
    this.data = {
      'data': this.widgetConfig()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`ON CHANGES from tmyts`)
  }


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

     ngAfterViewInit(): void {
    // Instantiate the ResizeObserver
    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      // Use ngZone.run() to make sure Angular's change detection is triggered
      this.ngZone.run(() => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        this.width = width;
        this.height = height;
        console.log(`Child size updated: ${width}x${height}`);
      });
    });

    // Start observing the component's host element
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }
}

