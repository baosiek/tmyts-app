import { Component, inject, input, model, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatColorPickerComponent, // Import the component
  NgxMatColorToggleComponent, // Import the toggle button
  NgxMatColorPickerInput, // Import the directive
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS
} from '@ngxmc/color-picker';
import { ThemePalette } from '@angular/material/core';
import { ColorSetting } from '../../tmyts-settings/color-setting/color-setting';
import { TmytsSizeSetting } from '../../tmyts-settings/tmyts-size-setting/tmyts-size-setting';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tmyts-widgets-settings',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule,
    ColorSetting,
    TmytsSizeSetting
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS } // Provide color formats
  ],
  templateUrl: './tmyts-widgets-settings.html',
  styleUrl: './tmyts-widgets-settings.scss'
})
export class TmytsWidgetsSettings{

  showWidgetSettings = model<boolean>(false);
  configWidget = model.required<IWidgetConfig>();
  user_id = input.required<number>();
  widgetSerive = inject(AssetsAnalysisDashboardService)

  colorCtr = new FormControl('#FF0000'); // Initialize with a default color
  disabled = false;
  touchUi = false; 

   // Use FormGroup for reactive form handling
  colorForm!: FormGroup;

  // Set a theme for the color picker input
  public color: ThemePalette = 'primary';

  constructor(private fb: FormBuilder) {}

}
