export type SymbolDataModel = {
    symbol: string;
    price_close: number;
    price_open: number;
    price_high: number;
    price_low: number;
    difference: number;
    percent: number;
    volume: number;
}

// Factory function to create a new PortfolioModel object
export const createNewSymbolData = (): SymbolDataModel => ({
  symbol: '',
  price_close: 0,
  price_open: 0,
  price_high: 0,
  price_low: 0,
  difference: 0,
  percent: 0,
  volume: 0
});