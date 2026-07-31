import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetByPortfolioTotalsModel, PortfolioActivityMode, PortfolioActivityModel, PortfolioTransactionModel } from '../../models/portfolio-activity-model';
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

  // No backend route matches this anymore (checked against the live
  // /openapi.json) - closest is get_all_transactions below, which returns
  // transactions rather than activity records. Unused in the app today.
  getActivityForPortfolio(portfolio_name: string): Observable<PortfolioActivityModel[]> {
    return this.http.get<PortfolioActivityModel[]>(`${this.apiUrl}/get_all/${portfolio_name}`)
  }

  // No user_id: the backend derives the caller from the bearer token.
  getTransactionsForPortfolio(portfolio_name: string): Observable<PortfolioTransactionModel[]> {
    return this.http.get<PortfolioTransactionModel[]>(`${this.apiUrl}/get_all_transactions/${portfolio_name}/`)
  }

  // No backend route matches this anymore (checked against the live
  // /openapi.json) - the closest is
  // GET /portfolio-transactions/portfolios/{portfolio_name}/assets/{asset}/,
  // which is scoped to one asset rather than "all assets in a portfolio".
  // Unused in the app today.
  getAssetsTotalsByPortfolio(portfolio_name: string): Observable<AssetByPortfolioTotalsModel[]> {
    return this.http.get<AssetByPortfolioTotalsModel[]>(`${this.apiUrl}/get_assets_by_portfolio/?portfolio_name=${portfolio_name}`)
  }

  deleteActivityForPortfolio(id: number) {
    return this.http.delete<PortfolioActivityModel[]>(`${this.apiUrl}/${id}`)
  }
}
