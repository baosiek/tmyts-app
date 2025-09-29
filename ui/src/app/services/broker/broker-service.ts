import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrokerModel } from '../../models/broker_model';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/broker';

  constructor() {}

  getAll(): Observable<BrokerModel[]> {

    const apiMethod = 'get_all';

    return this.http.get<BrokerModel[]>(`${this.apiUrl}/${apiMethod}`)
  }
  
}
