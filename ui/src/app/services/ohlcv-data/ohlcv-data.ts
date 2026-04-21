import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OhlcvDataInterface } from '../../interfaces/ohlcv-interface';

@Injectable({
  providedIn: 'root'
})
export class OhlcvData {

  http = inject(HttpClient);
  apiUrl = 'http://localhost:8000/minute_ohlcv_data';

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
}
