export interface PriceUpdateMessage {
  type?: string;
  asset?: string;
  price?: number;
  last_price?: number;
  timestamp?: string;
  [key: string]: unknown;
}
