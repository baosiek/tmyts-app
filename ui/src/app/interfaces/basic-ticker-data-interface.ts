export interface IBasicTickerData {
    symbol: string;
    symbol_name: string;
    variation: number;
    percentage: number;
}

class BasicTickerData implements IBasicTickerData {
    symbol: string;
    symbol_name: string;
    variation: number;
    percentage: number;

    constructor(
        symbol: string,
        symbol_name: string,
        variation: number,
        percentage: number
    ) {
        this.symbol = symbol;
        this.symbol_name = symbol_name;
        this.variation = variation;
        this.percentage = percentage;
    }

}

// Factory function to create a new PortfolioModel object
export const createNewBasicTickerData = (): BasicTickerData => ({
    symbol: '',
    symbol_name: '',
    variation: 0.0,
    percentage: 0.0
});
