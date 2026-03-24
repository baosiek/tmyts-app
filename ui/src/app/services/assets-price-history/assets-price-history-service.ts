import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetPriceHistoryModel } from '../../models/assets-price-history-model';

@Injectable({
  providedIn: 'root'
})
export class AssetsPriceHistoryService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/assets_price_history';

  constructor() { }

  getAssetsLatestPrices(symbols: string[]): Observable<AssetPriceHistoryModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'latest_prices';
    const body = symbols;

    return this.http.post<AssetPriceHistoryModel[]>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }

}
