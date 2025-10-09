export type SymbolDataItem = {
  date: Date;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export type IndicatorModel = SymbolDataItem & {
    indicator: number;
}

export type IndicatorMap = {
  symbol: string,
  indicator_data: IndicatorModel[]
}