export type SymbolModel = {
  symbol: string;
  symbol_name: string;
  exchange: string;
  priority: number;
  last_download?: Date | null
}

// Factory function to create a new PortfolioModel object
export const createNewSymbol = (): SymbolModel => ({
  symbol: '',
  symbol_name: '',
  exchange: '',
  priority: -1
});