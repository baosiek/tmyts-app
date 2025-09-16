export type PortfolioActivityModel = {
    activity_id: number | undefined;
    user_id: number
    portfolio_id: number;
    symbol_id: number;
    quantity: number;
    purchase_price: number;
    purchase_date: Date;
    broker_id: number
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): PortfolioActivityModel => ({
    activity_id: 0,
    user_id: 0,
    portfolio_id: 0,
    symbol_id: 0,
    quantity: 0.0,
    purchase_date: new Date(),
    purchase_price: 0.0,
    broker_id: 0 
});



