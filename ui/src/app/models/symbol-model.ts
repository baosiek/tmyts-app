export type SymbolModel = {
  id: number  | null;
  symbol_id: number;
  symbol_name: string;
  exchange: string;
}

// Factory function to create a new PortfolioModel object
export const createPortfolio = (): SymbolModel => ({
  id: null,
  symbol_id: 0,
  symbol_name: '',
  exchange: '',
});