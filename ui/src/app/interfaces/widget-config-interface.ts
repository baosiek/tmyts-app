import { Type } from "@angular/core";

export interface IWidgetConfig {
    id: number;
    dashboard_id: string;
    label: string;
    content: Type<unknown>;
    title?: string,
    subtitle?: string,
    rows?: number;
    columns?: number;
    backgroundColor?: string;
    color?: string;
}