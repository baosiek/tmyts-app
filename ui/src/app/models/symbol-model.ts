export type SymbolModel = {
  id: number  | null;
  symbol: string;
  symbol_name: string;
  exchange: string;
}

// Factory function to create a new PortfolioModel object
export const createNewSymbol = (): SymbolModel => ({
  id: null,
  symbol: '',
  symbol_name: '',
  exchange: '',
});