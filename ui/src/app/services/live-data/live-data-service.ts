import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetDataModel } from '../../components/dialogs/buy-asset-dialog/buy-asset-model';
import { IndexCardInterface } from '../../components/panels/indexes-cards/indexes-cards';
import { PortfolioPerformanceModel } from '../../models/portfolio-performance-model';

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/live';

  constructor() { }

  getAssetData(asset: string): Observable<AssetDataModel> {
    const apiMethod = 'basic-ticker-data';

    return this.http.get<AssetDataModel>(`${this.apiUrl}/${apiMethod}/?asset=${asset}`)
  }

  getDetailedPortfolioActivity(user_id: number, portfolio_name: string, symbols: string[]): Observable<PortfolioPerformanceModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'portfolio_performance';
    const body = symbols;

    return this.http.post<PortfolioPerformanceModel[]>(`${this.apiUrl}/${apiMethod}/${user_id}/${portfolio_name}`, body, { headers })
  }

  getPortfolioHoldingsPerformance(user_id: number, portfolio_name: string, symbols: string[]): Observable<PortfolioPerformanceModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'portfolio_holdings_performance';
    const body = symbols;

    return this.http.post<PortfolioPerformanceModel[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&portfolio_name=${portfolio_name}`, body, { headers })
  }

  getIndexesData(indexIds: string[]): Observable<IndexCardInterface[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'indexes-data';
    const body = indexIds;

    return this.http.post<IndexCardInterface[]>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }

}
