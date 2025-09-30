import { Component, inject, input, model } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';

@Component({
  selector: 'app-tmyts-widgets-settings',
  imports: [
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './tmyts-widgets-settings.html',
  styleUrl: './tmyts-widgets-settings.scss'
})
export class TmytsWidgetsSettings {

  showWidgetSettings = model<boolean>(false);
  configWidget = input.required<IWidgetConfig>()
  widgetConfigService = inject(AssetsAnalysisDashboardService);

}
