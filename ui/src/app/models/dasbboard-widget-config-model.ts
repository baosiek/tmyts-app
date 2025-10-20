export type DashboardWidgetConfigModel = {
    id: number;
    user_id: number;
    dashboard_id: string;
    label: string;
    title: string;
    subtitle: string;
    rows: number;
    columns: number;
    color: string,
    backgroundColor: string
}