export interface PortfolioPerformanceInterface {
    symbol_id: string;
    symbol_name: string;
    price: number;
    variation: number,
    percent: number
}

export interface LivePortfolioPerformanceInterface {
    symbol: string;
    symbol_name: string;
    total_quantity: number;
    total_cash_in: number;
    total_cash_out: number;
    total_fees: number;
    total_value: number;
    weighted_average_purchase_price: number;
    rt_price: number;
    adj_price_close: number; // last close price
    portfolio_value: number; // real time portfolio value
    gain_loss: number; // real time gain loss
    percent: number; // real time percent
    last_gain_loss: number; // gain loss since yesterday close price
    last_percent: number; // percent since yesterday close price
}