export type PortfolioActivityMode = {
    activity_id: number | undefined;
    user_id: number;
    portfolio_id: number;
    symbol_id: number;
    quantity: number;
    purchase_price: number;
    purchase_date: Date;
    broker_id: number
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): PortfolioActivityMode => ({
    activity_id: 0,
    user_id: 0,
    portfolio_id: 0,
    symbol_id: 0,
    quantity: 0.0,
    purchase_date: new Date(),
    purchase_price: 0.0,
    broker_id: 0 
});

export type PortfolioActivityModel = {
    activity_id: number | undefined;
    user_id: number;
    user_name: string;
    portfolio_id: number;
    portfolio_name: string;
    symbol_id: number;
    symbol: string;
    symbol_name: string;
    quantity: number;
    purchase_price: number;
    purchase_date: Date;
    broker_id: number
}

// Factory function to create a new PortfolioModel object
export const createPortfolio_view = (): PortfolioActivityModel => ({
    activity_id: 0,
    user_id: 0,
    user_name: '',
    portfolio_id: 0,
    portfolio_name: '',
    symbol_id: 0,
    symbol: '',
    symbol_name: '',
    quantity: 0.0,
    purchase_date: new Date(),
    purchase_price: 0.0,
    broker_id: 0 
});



