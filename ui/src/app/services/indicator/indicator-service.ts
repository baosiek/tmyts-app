import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnMessage } from '../../models/return-message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/indicators';

  getObvIndicator(symbols: string[]): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'obv';
    const body = symbols ;   
    return this.http.post<any>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }
  
}
