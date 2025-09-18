import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicTickerDataModel } from '../../models/basic-ticker-data';
import { PortfolioPerformanceModel } from '../../models/portfolio-performance-model';

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/live';

  constructor() {}

  getBasicTickerData(symbols: string[]): Observable<BasicTickerDataModel[]> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'basic-ticker-data';
    const body = symbols ;

    return this.http.post<BasicTickerDataModel[]>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }

  getDetailedPortfolioActivity(user_id: number, portfolio_id: number, symbols: string[]): Observable<PortfolioPerformanceModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'portfolio_performance';
    const body = symbols ;

    return this.http.post<PortfolioPerformanceModel[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&portfolio_id=${portfolio_id}`, body, { headers })
  }
  
}
