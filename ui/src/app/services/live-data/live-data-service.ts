import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IndexCardInterface } from '../../components/panels/indexes-cards/indexes-cards';
import { PortfolioPerformanceModel } from '../../models/portfolio-performance-model';
import { AppConfigService } from '../app-config/app-config-service';

interface AssetDataModel {
  symbol?: string;
  price?: number;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {

  http = inject(HttpClient)
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/live`; }

  constructor() { }

  getAssetData(asset: string): Observable<AssetDataModel> {
    const apiMethod = 'basic-ticker-data';

    return this.http.get<AssetDataModel>(`${this.apiUrl}/${apiMethod}/?asset=${asset}`)
  }

  // portfolio_id (not portfolio_name) and no user_id: the backend derives
  // the caller from the bearer token. Unused anywhere in the app today.
  getDetailedPortfolioActivity(portfolio_id: number, symbols: string[]): Observable<PortfolioPerformanceModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = symbols;

    return this.http.post<PortfolioPerformanceModel[]>(`${this.apiUrl}/portfolio_performance/?portfolio_id=${portfolio_id}`, body, { headers })
  }

  // No user_id: the backend derives the caller from the bearer token.
  getPortfolioHoldingsPerformance(portfolio_name: string, symbols: string[]): Observable<PortfolioPerformanceModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = symbols;

    return this.http.post<PortfolioPerformanceModel[]>(`${this.apiUrl}/portfolio_holdings_performance/?portfolio_name=${portfolio_name}`, body, { headers })
  }

  getIndexesData(indexIds: string[]): Observable<IndexCardInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = indexIds;

    return this.http.post<IndexCardInterface[]>(`${this.apiUrl}/indexes-data/`, body, { headers })
  }

}
