export interface IBasicTickerData {
    asset: string;
    asset_name: string;
    variation: number;
    percentage: number;
}

class BasicTickerData implements IBasicTickerData {
    asset: string;
    asset_name: string;
    variation: number;
    percentage: number;

    constructor(
        asset: string,
        asset_name: string,
        variation: number,
        percentage: number
    ) {
        this.asset = asset;
        this.asset_name = asset_name;
        this.variation = variation;
        this.percentage = percentage;
    }

}

// Factory function to create a new PortfolioModel object
export const createNewBasicTickerData = (): BasicTickerData => ({
    asset: '',
    asset_name: '',
    variation: 0.0,
    percentage: 0.0
});
