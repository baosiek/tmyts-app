import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RSIModel {
  timestamp: string;
  RSI_14: number;
}

@Injectable({
  providedIn: 'root',
})
export class IndicatorTaService {
  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/indicators_ta';

  constructor() { }

  // http://127.0.0.1:8000/indicators_ta/rsi/asset/C/period/240/lookback/14/

  getAssetsLatestPrices(asset: string): Observable<RSIModel[]> {
    const apiMethod = 'rsi';

    return this.http.get<RSIModel[]>(`${this.apiUrl}/${apiMethod}/asset/${asset}/period/240/lookback/14/`)
  }
}
