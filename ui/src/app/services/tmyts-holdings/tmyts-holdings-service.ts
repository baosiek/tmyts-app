import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PortfolioHoldingsModel } from '../../models/portfolio_holdings_model';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class TmytsHoldingsService {
  http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/portfolio_holdings`; }

  constructor() { }

  getHoldings(user_id: number, portfolio_name: string): Observable<PortfolioHoldingsModel[]> {
    const apiMethod = 'holdings';
    return this.http.get<PortfolioHoldingsModel[]>(
      `${this.apiUrl}/${apiMethod}/${user_id}/${portfolio_name}`,
    );
  }

}
