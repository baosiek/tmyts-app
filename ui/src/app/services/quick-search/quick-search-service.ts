import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetModel } from '../../models/asset-model';

@Injectable({
  providedIn: 'root'
})
export class QuickSearchService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/assets';

  quickSearch(searchTerm: string): Observable<AssetModel[]> {
    const apiMethod = 'quick_search';
    return this.http.get<AssetModel[]>(`${this.apiUrl}/${apiMethod}/?search_term=${searchTerm}`)
  }

}
