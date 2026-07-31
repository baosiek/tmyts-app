import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OhlcvDataInterface } from '../../interfaces/ohlcv-interface';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class OhlcvData {

  http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/minute_ohlcv_data`; }

  constructor() { }

  /**
   * Fetch OHLCV (Open, High, Low, Close, Volume) data for a list of symbols
   * @param symbols Array of asset symbols to fetch data for
   * @returns Observable array of OHLCV data
   */
  getOhlcvData(symbols: string[]): Observable<OhlcvDataInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<OhlcvDataInterface[]>(
      `${this.apiUrl}/last_minute_data/`,
      symbols,
      { headers }
    );
  }

  getAllBars(asset: string): Observable<OhlcvDataInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<OhlcvDataInterface[]>(
      `${this.apiUrl}/last_x_minutes_of_data_for_asset/?asset=${asset}`,
      null,
      { headers }
    );
  }
}
