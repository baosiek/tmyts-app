import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnMessage } from '../../models/return-message';
import { Observable } from 'rxjs';
import { IndicatorDataMapModel } from '../../models/indicator-model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/indicators';

  getObvIndicator(symbols: string[]): Observable<IndicatorDataMapModel>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'obv';
    const body = symbols ;   
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

  getADLineIndicator(symbols: string[]): Observable<IndicatorDataMapModel>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'ad_line';
    const body = symbols ;   
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

  getADXIndicator(symbols: string[]): Observable<IndicatorDataMapModel>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'adx';
    const body = symbols ;   
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

  getAroonIndicator(symbols: string[]): Observable<IndicatorDataMapModel>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'aroon';
    const body = symbols ;   
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

  getMACDIndicator(symbols: string[]): Observable<IndicatorDataMapModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'macd';
    const body = symbols;
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

  getRSIIndicator(symbols: string[]): Observable<IndicatorDataMapModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'rsi';
    const body = symbols;
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

  getStochasticIndicator(symbols: string[]): Observable<IndicatorDataMapModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'stochastic';
    const body = symbols;
    return this.http.post<IndicatorDataMapModel>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }
  
}
