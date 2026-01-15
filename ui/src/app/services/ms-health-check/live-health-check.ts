import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveHealthCheck {
  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/yf_live';

  checkYFssLive(): Observable<any> {
    const apiMethod = 'health_check';

    return this.http.get<any>(`${this.apiUrl}/${apiMethod}`)
  }
}
