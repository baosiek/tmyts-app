import { AfterViewInit, Component, ElementRef, inject, input, model, OnInit, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';
import { UserPreferencesService } from '../../../../services/user-preferences/user-preferences-service';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-color-setting',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './color-setting.html',
  styleUrl: './color-setting.scss'
})
export class ColorSetting implements OnInit {

  configWidget = model.required<IWidgetConfig>()

  assetsAnalysisDashboardService = inject(AssetsAnalysisDashboardService);

  // Use ViewChild to get a reference to the element with the #colorTarget template variable
  @ViewChild('colorTarget', { static: false }) colorTarget!: ElementRef;

   // Use FormGroup for reactive form handling
  colorForm!: FormGroup;

  // Create a FormControl for your color picker
  backgroundColorCtr: FormControl = new FormControl('red');
  colorCtr: FormControl = new FormControl('black');

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.colorForm = this.fb.group({
      // Initialize the color with a default value
      colorCtr: this.colorCtr,
      backgroundColorCtr: this.backgroundColorCtr
    });
  }

  changeColor(){
    this.configWidget.update(
      currentConfig => (
        {
          ...currentConfig,
          color: this.colorCtr.value,
        }
      )
    );
    this.assetsAnalysisDashboardService.updateWidget(this.configWidget())
  }

  changeBackgroundColor(){
    this.configWidget.update(
      currentConfig => (
        {
          ...currentConfig,
          background_color: this.backgroundColorCtr.value,
        }
      )
    ); 
     this.assetsAnalysisDashboardService.updateWidget(this.configWidget()) 
  }
}
