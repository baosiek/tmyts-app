import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PortfolioHoldingsModel } from '../../models/portfolio_holdings_model';

@Injectable({
  providedIn: 'root'
})
export class TmytsHoldingsService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:8000/portfolio_holdings';

  constructor() { }

  getHoldings(user_id: number, portfolio_name: string): Observable<PortfolioHoldingsModel[]> {
    const apiMethod = 'holdings';
    return this.http.get<PortfolioHoldingsModel[]>(
      `${this.apiUrl}/${apiMethod}/${user_id}/${portfolio_name}`,
    );
  }

}
