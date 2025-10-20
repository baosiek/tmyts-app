import { Component, inject, input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';

@Component({
  selector: 'app-tmyts-size-setting',
  imports: [
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './tmyts-size-setting.html',
  styleUrl: './tmyts-size-setting.scss'
})
export class TmytsSizeSetting {

  configWidget = input.required<IWidgetConfig>()
  widgetConfigService = inject(AssetsAnalysisDashboardService);

}
