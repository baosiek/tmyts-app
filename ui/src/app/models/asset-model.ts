export type AssetModel = {
  asset: string;
  asset_type: string;
  venue: string;
  last_download: string | null;
  asset_index: string;
  asset_name: string;
  asset_id: number;
  priority: number;
  asset_industry: string;
}

// Factory function to create a new AssetModel object
export const createNewAsset = (): AssetModel => ({
  asset: '',
  asset_type: '',
  venue: '',
  last_download: null,
  asset_index: '',
  asset_name: '',
  asset_id: 0,
  priority: -1,
  asset_industry: ''
});
