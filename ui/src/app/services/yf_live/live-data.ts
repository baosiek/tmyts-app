import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root',
})
export class LiveHealthCheck {
  http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/yf_live`; }

  checkYFssLive(): Observable<any> {
    const apiMethod = 'health_check';

    return this.http.get<any>(`${this.apiUrl}/${apiMethod}`);
  }
}
