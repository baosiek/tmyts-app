import { Type } from "@angular/core";

export type WidgetConfigModel = {
    widget_id: number;
    user_id: number;
    dashboard_id: string;
    label: string;
    title: string,
    symbol: string,
    rows: number;
    columns: number;
    background_color: string;
    color: string;
}

// Factory function to create a new IWidgetConfig entry
export const createDefaultWidgetConfigModel = (): WidgetConfigModel => ({
    widget_id: 0,
    user_id: 0,
    dashboard_id: '',
    label: '',
    title: '',
    symbol: '',
    rows: 1,
    columns: 1,
    background_color: '#ffffff',
    color: '#000000'
});