import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioModel } from '../../models/portfolio-model';
import { PortfolioHoldingsModel } from '../../models/portfolio_holdings_model';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDatabaseService {

  http = inject(HttpClient)
  private config = inject(AppConfigService);
  private get apiUrl() { return this.config.apiBaseUrl; }

  constructor() { }

  // user_id is never sent to any of these three: the backend derives the
  // caller from the bearer token for every one of them.
  createPortfolio(portfolio_data: Partial<PortfolioModel>): Observable<PortfolioModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = portfolio_data;

    return this.http.post<PortfolioModel>(`${this.apiUrl}/portfolios/`, body, { headers })
  }

  readAllPortfolios(): Observable<PortfolioModel[]> {
    return this.http.get<PortfolioModel[]>(`${this.apiUrl}/portfolios/get_all/`)
  }

  getPortfolioHoldings(portfolio_name: string): Observable<PortfolioHoldingsModel[]> {
    return this.http.get<PortfolioHoldingsModel[]>(`${this.apiUrl}/portfolio_holdings/holdings/${portfolio_name}`)
  }
}
