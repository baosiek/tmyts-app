import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioModel } from '../../models/portfolio-model';
import { PortfolioHoldingsModel } from '../../models/portfolio_holdings_model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDatabaseService {

  http = inject(HttpClient)
  apiUrl = 'http://127.0.0.1:8000';

  constructor() { }

  createPortfolio(portfolio_data: Partial<PortfolioModel>): Observable<PortfolioModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'portfolios/create';
    const body = portfolio_data;

    return this.http.post<PortfolioModel>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }

  readAllPortfolios(user_id: number): Observable<PortfolioModel[]> {
    const apiMethod = 'portfolios/get_all';
    return this.http.get<PortfolioModel[]>(`${this.apiUrl}/${apiMethod}/${user_id}/`)
  }

  getPortfolioHoldings(user_id: number, portfolio_name: string): Observable<PortfolioHoldingsModel[]> {
    const apiMethod = 'portfolio_holdings/holdings';
    return this.http.get<PortfolioHoldingsModel[]>(`${this.apiUrl}/${apiMethod}/${user_id}/${portfolio_name}`)
  }
}
