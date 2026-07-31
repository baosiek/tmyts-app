import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModel } from '../../models/asset-model';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/assets`; }

  getAssetByName(asset: string): Observable<AssetModel> {
    const apiMethod = 'asset_by_name';
    return this.http.get<AssetModel>(`${this.apiUrl}/${apiMethod}/${asset}/`);
  }
}
