export type AssetPriceHistoryModel = {
    asset: string;
    asset_name: string;
    price_date: Date;
    adj_price_close: number;
}

// Factory function to create a new AssetModel object
export const createNewAsset = (): AssetPriceHistoryModel => ({
    asset: '',
    asset_name: '',
    price_date: new Date(),
    adj_price_close: 0.0
});