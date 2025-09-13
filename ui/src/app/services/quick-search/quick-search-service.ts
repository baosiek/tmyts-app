import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SymbolModel } from '../../models/symbol-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuickSearchService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/symbols';

  quickSearch(searchTerm: string): Observable<SymbolModel[]> {
      const apiMethod = 'quick_search';
    return this.http.get<SymbolModel[]>(`${this.apiUrl}/${apiMethod}/?search_term=${searchTerm}`)
  }
  
}
