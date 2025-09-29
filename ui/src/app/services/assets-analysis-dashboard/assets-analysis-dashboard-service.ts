import { Injectable, signal } from '@angular/core';
import { IWidgetConfig } from '../../interfaces/widget-config-interface';
import { ObvWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/obv-widget/obv-widget';
import { AdlineWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/adline-widget/adline-widget';


/*
providedIn: 'root' deleted from @Injectable, because
this service will be required only for the refered 
dashboard.
*/
@Injectable() 
export class AssetsAnalysisDashboardService {

  widgetConfigs = signal<IWidgetConfig[]>(
    [
      {
        id: 1,
        label: 'obv',
        title: 'On-Balance Volume (OBV) indicator',
        subtitle: 'AAPL',
        content: ObvWidget
      },
      {
        id: 2,
        label: 'ad-line',
        title: 'Accumulation/Distribution Line (A/D Line)',
        subtitle: 'AAPL',
        content: AdlineWidget
      }
    ]
  );
  
}
