import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PortfolioActivityModel } from '../../models/portfolio-log-model';
import { Observable } from 'rxjs';
import { ReturnMessage } from '../../models/return-message';

@Injectable({
  providedIn: 'root'
})
export class PortfolioActivityService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/portfolio_activity';

  constructor() {}

  createPortfolio(portfolio_activity_data: PortfolioActivityModel): Observable<ReturnMessage> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'create';
    const body = portfolio_activity_data ;

    return this.http.post<ReturnMessage>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }  

  readAllPortfolios(user_id: string, portfolio_id: string): Observable<PortfolioActivityModel[]> {
     const apiMethod = 'get_all';
    return this.http.get<PortfolioActivityModel[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&portfolio_id=${portfolio_id}`)
  }
  
}
