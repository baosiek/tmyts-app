export type PortfolioActivityModel = {
    activity_id: number | undefined;
    user_id: string
    portfolio_id: string;
    symbol_id: string;
    symbol_name: string;
    exchange: string;
    quantity: number;
    purchase_price: number;
    purchase_date: Date;
    broker_id: string
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): PortfolioActivityModel => ({
    activity_id: 0,
    user_id: '',
    portfolio_id: '',
    symbol_id: '',
    symbol_name: '',
    exchange: '',
    quantity: 0.0,
    purchase_date: new Date(),
    purchase_price: 0.0,
    broker_id: '' 
});



