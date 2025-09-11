export type PortfolioModel = {
    portfolio_id: string;
    user_id: string;
    description: string;
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): PortfolioModel => ({
  portfolio_id: '',
  user_id: '',
  description: '',
});