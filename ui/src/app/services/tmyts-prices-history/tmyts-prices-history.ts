import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioCashflowInterface } from '../../interfaces/cashflow-performance-interface';
import { LivePortfolioPerformanceInterface } from '../../interfaces/portfolio-performance-interface';

@Injectable({
  providedIn: 'root'
})
export class TmytsPricesHistoryService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/tmyts_price_history';

  constructor() { }


  getPortfolioPerformance(user_id: number, portfolio_id: number, symbols: string[]): Observable<LivePortfolioPerformanceInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'portfolio_performance';
    const body = symbols;

    return this.http.post<LivePortfolioPerformanceInterface[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&portfolio_id=${portfolio_id}`, body, { headers })
  }

  getPortfolioDailtPerformance(user_id: number, portfolio_id: number | null, initial_principla: number,): Observable<PortfolioCashflowInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'portfolio_daily_performance';

    return this.http.get<PortfolioCashflowInterface[]>(
      `${this.apiUrl}/${apiMethod}/?user_id=${user_id}
      &portfolio_id=${portfolio_id}&initial_principal=${initial_principla}`
    )
  }
}
