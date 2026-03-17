export type PortfolioPerformanceModel = {
    asset: string;
    asset_name: string;
    quantity: number;
    cost_basis_price: number;
    close: number;
    gain_loss: number;
    weighted_percent: number
}