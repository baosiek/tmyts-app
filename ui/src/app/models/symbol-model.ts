export type SymbolModel = {
    symbol_id: string;
    symbol_name: string;
    exchange: string;
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): SymbolModel => ({
  symbol_id: '',
  symbol_name: '',
  exchange: '',
});