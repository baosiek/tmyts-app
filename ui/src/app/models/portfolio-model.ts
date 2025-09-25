export type PortfolioModel = {
    id: number;
    user_id: number;
    portfolio_name: string;
    description: string;
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): Partial<PortfolioModel> => ({
  user_id: 0,
  portfolio_name: '',
  description: ''
});