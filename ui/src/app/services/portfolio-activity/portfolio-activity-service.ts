import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioActivityMode, PortfolioActivityModel, PortfolioTransactionModel } from '../../models/portfolio-activity-model';
import { ReturnMessage } from '../../models/return-message';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioActivityService {

  http = inject(HttpClient)
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/portfolio-transactions`; }

  constructor() { }

  insertNewActivity(portfolio_activity_data: PortfolioActivityMode): Observable<ReturnMessage> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = portfolio_activity_data;

    return this.http.post<ReturnMessage>(`${this.apiUrl}/`, body, { headers })
  }

  addSellTransaction(portfolio_activity_data: Partial<PortfolioActivityModel>): Observable<ReturnMessage> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = portfolio_activity_data;

    return this.http.post<ReturnMessage>(`${this.apiUrl}/`, body, { headers })
  }

  // No user_id: the backend derives the caller from the bearer token.
  getTransactionsForPortfolio(portfolio_name: string): Observable<PortfolioTransactionModel[]> {
    return this.http.get<PortfolioTransactionModel[]>(`${this.apiUrl}/get_all_transactions/${portfolio_name}/`)
  }

  deleteActivityForPortfolio(id: number) {
    return this.http.delete<PortfolioActivityModel[]>(`${this.apiUrl}/${id}`)
  }
}
