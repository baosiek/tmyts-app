import { computed, Injectable, signal } from '@angular/core';
import { IWidgetConfig } from '../../interfaces/widget-config-interface';
import { ObvWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/obv-widget/obv-widget';
import { AdlineWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/adline-widget/adline-widget';
import { AdxWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/adx-widget/adx-widget';


/*
providedIn: 'root' deleted from @Injectable, because
this service will be required only for the refered 
dashboard.
*/
@Injectable() 
export class AssetsAnalysisDashboardService {

  // holds all existing types of widgets for this dashboard service
  widgetsStore = signal<IWidgetConfig[]>(
    [
      {
        id: 1,
        label: 'obv',
        title: 'On-Balance Volume (OBV) indicator',
        subtitle: 'AAPL',
        content: ObvWidget,
        rows: 2,
        columns: 2,
        color: '#000000',
        backgroundColor: '#fafaf4'
      },
      {
        id: 2,
        label: 'ad-line',
        title: 'Accumulation/Distribution Line (A/D Line)',
        subtitle: 'AAPL',
        content: AdlineWidget,
        rows: 1,
        columns: 1,
        color: '#000000',
        backgroundColor: '#fafaf4'
      },
      {
        id: 3,
        label: 'adx',
        title: 'Average Directional Index (ADX)',
        subtitle: 'AAPL',
        content: AdxWidget,
        rows: 1,
        columns: 1,
        color: '#000000',
        backgroundColor: '#fafaf4'
      }
    ]
  );

  // holds all widgets added to the dashboard
  widgetsInDashboard = signal<IWidgetConfig[]>([])

  // the difference between widgetsStore minus widgetsInDashboard
  // meaning all widgets that can still be added to the dashboard
  widgetsToBeAdded  = computed(
    () => {
      const idsInDashboard = this.widgetsInDashboard().map((w) => w.id);
      console.log(`idsInDashboard: ${idsInDashboard}`)
      const idsToAdd = this.widgetsStore().filter((w) => !idsInDashboard.includes(w.id));
      console.log(`idsToAdd: ${idsToAdd}`);
      return idsToAdd;
    }
  );

  addWidgetToDashboard(widget: IWidgetConfig) {
    this.widgetsInDashboard.set([...this.widgetsInDashboard(), {...widget}])
  }

  updateWidget(id: number, widget: Partial<IWidgetConfig>) {
    console.log(`widget to update: ${JSON.stringify(widget)}`)
    const widgetIndex = this.widgetsInDashboard().findIndex(w => w.id === id)
    if (widgetIndex != -1){
      const tempWidgets = [...this.widgetsInDashboard()];
      tempWidgets[widgetIndex] = {...tempWidgets[widgetIndex], ...widget};
      this.widgetsInDashboard.set(tempWidgets);
    }
   
  }
}
