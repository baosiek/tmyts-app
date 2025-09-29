import { Type } from "@angular/core";

export interface IWidgetConfig {
    id: number;
    label: string;
    content: Type<unknown>;
    title?: string,
    subtitle?: string,
    rows?: number;
    columns?: number;
    backgroundColor?: string;
    color?: string;
}