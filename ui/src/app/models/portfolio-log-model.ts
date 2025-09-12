export type PortfolioLogModel = {
    portfolio_id: string;
    symbol_id: string;
    symbol_name: string;
    purchase_price: number;
    quantity: number;
    purchase_date: Date;
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): PortfolioLogModel => ({
    portfolio_id: '',
    symbol_id: '',
    symbol_name: '',
    purchase_price: 0.0,
    quantity: 0,
    purchase_date: new Date()
});