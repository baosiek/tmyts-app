import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioCashflowInterface } from '../../interfaces/cashflow-performance-interface';

@Injectable({
  providedIn: 'root'
})
export class PortfolioPerformanceService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/portfolios';

  constructor() { }

  getPortfolioTwr(portfolioName: string): Observable<PortfolioCashflowInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'twr';

    return this.http.get<PortfolioCashflowInterface[]>(`${this.apiUrl}/${apiMethod}/${portfolioName}/`)
  }

}
