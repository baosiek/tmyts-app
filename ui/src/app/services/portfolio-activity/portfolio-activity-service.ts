import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetByPortfolioTotalsModel, PortfolioActivityMode, PortfolioActivityModel } from '../../models/portfolio-activity-model';
import { ReturnMessage } from '../../models/return-message';

@Injectable({
  providedIn: 'root'
})
export class PortfolioActivityService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/portfolio-transactions';

  constructor() { }

  insertNewActivity(portfolio_activity_data: PortfolioActivityMode): Observable<ReturnMessage> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'create';
    const body = portfolio_activity_data;

    return this.http.post<ReturnMessage>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }

  addSellTransaction(portfolio_activity_data: Partial<PortfolioActivityModel>): Observable<ReturnMessage> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'create';
    const body = portfolio_activity_data;

    return this.http.post<ReturnMessage>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }

  getActivityForPortfolio(user_id: number, portfolio_name: string): Observable<PortfolioActivityModel[]> {
    const apiMethod = 'get_all';
    // backend should now accept portfolio_name instead of id
    return this.http.get<PortfolioActivityModel[]>(`${this.apiUrl}/${apiMethod}/${user_id}/${portfolio_name}`)
  }

  getAssetsTotalsByPortfolio(user_id: number, portfolio_name: string): Observable<AssetByPortfolioTotalsModel[]> {
    const apiMethod = 'get_assets_by_portfolio';
    return this.http.get<AssetByPortfolioTotalsModel[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&portfolio_name=${portfolio_name}`)
  }

  deleteActivityForPortfolio(id: number) {
    console.log("id: %s", id)
    const apiMethod = 'delete';
    return this.http.delete<PortfolioActivityModel[]>(`${this.apiUrl}/${apiMethod}/?id=${id}`)
  }
}
