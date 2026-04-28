export type PortfolioHoldingsModel = {
    holding_id: number;
    price_date: Date;
    user_id: number;
    portfolio_id: number;
    portfolio_name: string;
    asset_id: number;
    asset: string;
    asset_name: string;
    quantity: number;
    weight: number;
    cost_basis_price: number;
    total_cost_basis: number;

}

// Factory function to create a new PortfolioModel object
export const createPortfolioHolding = (): PortfolioHoldingsModel => ({
    holding_id: 0,
    price_date: new Date(),
    user_id: 0,
    portfolio_name: '',
    asset: '',
    quantity: 0.0,
    weight: 0.0,
    cost_basis_price: 0.0,
    total_cost_basis: 0.0,
    portfolio_id: 0,
    asset_id: 0,
    asset_name: ''
});