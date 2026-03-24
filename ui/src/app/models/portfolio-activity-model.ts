export type PortfolioActivityMode = {
    user_id: number;
    portfolio_name: string;
    asset: string;
    quantity: number;
    purchase_price: number;
    purchase_date: Date;
    broker_id: number
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): PortfolioActivityMode => ({
    user_id: 0,
    portfolio_name: '',
    asset: '',
    quantity: 0.0,
    purchase_date: new Date(),
    purchase_price: 0.0,
    broker_id: 0
});

export type PortfolioActivityModel = {
    user_id: number;
    user_name: string;
    portfolio_name: string;
    asset: string;
    asset_name: string;
    quantity: number;
    cash_in: number;
    fees: number;
    purchase_price: number;
    purchase_date: Date;
    broker_id: number
}

export type PortfolioTransactionModel = {
    purchase_date: Date;
    quantity: number;
    asset: string;
    asset_name: string;
    total_quantity: number;
    total_commission: number;
    average_price: number;
    broker_name: string
}

// Factory function to create a new PortfolioModel object
export const createPortfolio_view = (): PortfolioActivityModel => ({
    user_id: 0,
    user_name: '',
    portfolio_name: '',
    asset: '',
    asset_name: '',
    quantity: 0.0,
    cash_in: 0.0,
    fees: 0.0,
    purchase_date: new Date(),
    purchase_price: 0.0,
    broker_id: 0
});

export type AssetByPortfolioTotalsModel = {
    user_id: number;
    portfolio_name: string;
    asset: string;
    asset_name: string;
    broker_id: number;
    broker_name: string;
    total_quantity: number;
    total_cash_in: number;
    total_fees: number;
    average_purchase_price: number;
    current_price: number;
}



