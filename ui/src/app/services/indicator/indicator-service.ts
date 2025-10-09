import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReturnMessage } from '../../models/return-message';
import { Observable } from 'rxjs';
import { IndicatorMap } from '../../models/indicator-model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/indicators';

  getObvIndicator(symbols: string[]): Observable<IndicatorMap[]>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'obv';
    const body = symbols ;   
    return this.http.post<IndicatorMap[]>(`${this.apiUrl}/${apiMethod}`, body, { headers })
  }
  
}
