import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioModel } from '../../models/portfolio-model';
import { ReturnMessage } from '../../models/return-message';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDatabaseService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/portfolios';

  constructor() {}

  createPortfolio(portfolio_data: PortfolioModel): Observable<ReturnMessage> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'create';
    const body = portfolio_data ;

    return this.http.post<ReturnMessage>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }  

  readAllPortfolios(portfolio_id: string): Observable<PortfolioModel[]> {
     const apiMethod = 'get_all';
    return this.http.get<PortfolioModel[]>(`${this.apiUrl}/${apiMethod}/?user_id=${portfolio_id}`)
  }
}
