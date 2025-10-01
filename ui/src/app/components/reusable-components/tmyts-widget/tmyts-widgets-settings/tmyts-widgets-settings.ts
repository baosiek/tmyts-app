import { Component, inject, input, model, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-tmyts-widgets-settings',
  imports: [
    ...MATERIAL_IMPORTS,
    NgxMatColorPickerComponent,
    NgxMatColorToggleComponent,
    NgxMatColorPickerInput,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS } // Provide color formats
  ],
  templateUrl: './tmyts-widgets-settings.html',
  styleUrl: './tmyts-widgets-settings.scss'
})
export class TmytsWidgetsSettings implements OnInit{

  showWidgetSettings = model<boolean>(false);
  configWidget = input.required<IWidgetConfig>()
  widgetConfigService = inject(AssetsAnalysisDashboardService);

  colorCtr = new FormControl('#FF0000'); // Initialize with a default color
  disabled = false;
  touchUi = false; 

   // Use FormGroup for reactive form handling
  colorForm!: FormGroup;

  // Set a theme for the color picker input
  public color: ThemePalette = 'primary';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.colorForm = this.fb.group({
      // Initialize the color with a default value
      selectedColor: '#FF5722',
    });
  }

  // Handle color change (optional)
  onColorChange(event: any): void {
    console.log('New color selected:', event);
  }

  changeColor(color: MouseEvent) {
    console.log(`color selected: ${JSON.stringify(color)}`)
  }

}
