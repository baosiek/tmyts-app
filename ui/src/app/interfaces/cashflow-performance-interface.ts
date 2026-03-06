
/**
 * This interface contains the fields to render
 * the portfolio daily cashflow interface.
 */
export interface PortfolioCashflowInterface {
    price_date: Date;
    cash: number;
    market_value: number;
    nav: number;
    daily_return: number;
    cumulative_return: number;
}