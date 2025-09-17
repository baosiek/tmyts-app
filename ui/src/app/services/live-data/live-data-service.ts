import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicTickerDataModel } from '../../models/basic-ticker-data';

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/live';

  constructor() {}

  getBasicTickerData(symbols: string[]): Observable<BasicTickerDataModel[]> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'basic-ticker-data';
    const body = symbols ;

    return this.http.post<BasicTickerDataModel[]>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }
  
}
