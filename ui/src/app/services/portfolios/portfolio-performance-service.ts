import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioCashflowInterface } from '../../interfaces/cashflow-performance-interface';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioPerformanceService {

  http = inject(HttpClient)
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/portfolios`; }

  constructor() { }

  getPortfolioTwr(portfolioName: string): Observable<PortfolioCashflowInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'twr';

    return this.http.get<PortfolioCashflowInterface[]>(`${this.apiUrl}/${apiMethod}/${portfolioName}/`)
  }

}
