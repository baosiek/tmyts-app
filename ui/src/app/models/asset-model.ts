export type AssetModel = {
  asset: string;
  asset_name: string;
  exchange: string;
  priority: number;
  last_download?: Date | null
}

// Factory function to create a new AssetModel object
export const createNewAsset = (): AssetModel => ({
  asset: '',
  asset_name: '',
  exchange: '',
  priority: -1
});