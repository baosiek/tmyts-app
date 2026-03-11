export class PortfolioComponentsDataExchange {
    user_id: number;
    portfolio_name: string | null;
    asset_list: string[];

    constructor(user_id: number, portfolio_name: string | null, assetList: string[]) {
        this.user_id = user_id;
        this.portfolio_name = portfolio_name;
        this.asset_list = assetList;
    }

    /**
     * Factory method to create a new instance of PortfolioComponentsDataExchange.
     * @param user_id The user's ID.
     * @param portfolio_name The portfolio's name.
     * @param asset_list A list of assets.
     * @returns A new PortfolioComponentsDataExchange instance.
     */
    public static create(user_id: number, portfolio_name: string | null, asset_list: string[]): PortfolioComponentsDataExchange {
        return new PortfolioComponentsDataExchange(user_id, portfolio_name, asset_list);
    }
}