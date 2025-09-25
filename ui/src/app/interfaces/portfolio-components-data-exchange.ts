export class PortfolioComponentsDataExchange {
    user_id: number;
    portfolio_id: number | null;
    symbol_list: string[];

    constructor(user_id: number, portfolio_id: number | null, symbolList: string[]) {
        this.user_id = user_id;
        this.portfolio_id = portfolio_id;
        this.symbol_list = symbolList;
    }

    /**
     * Factory method to create a new instance of PortfolioComponentsDataExchange.
     * @param user_id The user's ID.
     * @param portfolio_id The portfolio's ID.
     * @param symbol_list A list of stock symbols.
     * @returns A new PortfolioComponentsDataExchange instance.
     */
    public static create(user_id: number, portfolio_id: number | null, symbol_list: string[]): PortfolioComponentsDataExchange {
        return new PortfolioComponentsDataExchange(user_id, portfolio_id, symbol_list);
    }
}