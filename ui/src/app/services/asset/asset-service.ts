import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModel } from '../../models/asset-model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  http = inject(HttpClient);
  apiUrl = 'http://127.0.0.1:8000/assets';

  getAssetByName(asset: string): Observable<AssetModel> {
    const apiMethod = 'asset_by_name';
    return this.http.get<AssetModel>(`${this.apiUrl}/${apiMethod}/${asset}/`);
  }
}
