import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModel } from '../../models/asset-model';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class QuickSearchService {

  http = inject(HttpClient)
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/assets`; }

  quickSearch(searchTerm: string): Observable<AssetModel[]> {
    const apiMethod = 'quick_search';
    return this.http.get<AssetModel[]>(`${this.apiUrl}/${apiMethod}/?search_term=${searchTerm}`)
  }

}
