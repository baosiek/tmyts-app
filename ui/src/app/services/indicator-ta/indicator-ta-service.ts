import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config-service';

export interface RSIModel {
  timestamp: string;
  RSI: number;
}

export interface ALLModel {
  timestamp: string;
  RSI: number; // RSI
  ADX: number; // ADX
  DMP: number; // +DI
  DMN: number; // -DI
  ATR: number; // ATR
}

@Injectable({
  providedIn: 'root',
})
export class IndicatorTaService {
  http = inject(HttpClient)
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/indicators_ta`; }

  constructor() { }


  getAllIndicator(asset: string): Observable<ALLModel[]> {
    const apiMethod = 'all';
    return this.http.get<ALLModel[]>(`${this.apiUrl}/${apiMethod}/asset/${asset}/lookback/14/`)
  }
}
