import { Type } from "@angular/core";

export interface IWidgetConfig {
    id: number;
    user_id: number;
    dashboard_id: string;
    label: string;
    title: string,
    symbol: string,
    content: Type<unknown>;
    rows: number;
    columns: number;
    background_color: string;
    color: string;
}

export interface IWidgetType {
    id: number;
    dashboard_id: string;
    label: string;
    title: string;
    content: Type<unknown>;
}

export class WidgetConfig implements IWidgetConfig {
    id: number;
    user_id: number;
    dashboard_id: string;
    label: string;
    title: string;
    symbol: string;
    content: Type<unknown>;
    rows: number;
    columns: number;
    background_color: string;
    color: string;

    constructor(
        id: number,
        user_id: number,
        dashboard_id: string,
        label: string,
        title: string,
        symbol: string,
        content: Type<unknown>,
        rows: number,
        columns: number,
        background_color: string,
        color: string
    ) {
        this.id = id;
        this.user_id = user_id;
        this.dashboard_id = dashboard_id;
        this.label = label;
        this.title = title;
        this.symbol = symbol;
        this.content = content;
        this.rows = rows;
        this.columns = columns;
        this.background_color = background_color;
        this.color = color;
    }
}