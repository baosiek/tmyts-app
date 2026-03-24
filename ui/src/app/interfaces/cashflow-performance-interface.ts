
/**
 * This interface contains the fields to render
 * the portfolio daily cashflow interface.
 */
export interface PortfolioCashflowInterface {
    price_date: Date;
    market_value: number;
    cash_flow: number;
    daily_return_pct: number;
    cumulative_twr_pct: number;
}