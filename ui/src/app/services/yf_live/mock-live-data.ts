import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LiveHealthCheck } from './live-data';

@Injectable({
  providedIn: 'root',
})
export class MockLiveHealthCheck extends LiveHealthCheck {
  override checkYFssLive(): Observable<any> {
    return of({ status_code: 200 });
  }
}
