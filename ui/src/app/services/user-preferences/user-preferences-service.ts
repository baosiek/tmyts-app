import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWidgetConfig } from '../../interfaces/widget-config-interface';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  http = inject(HttpClient)
  apiUrl = 'http://localhost:8000/dashboard_widget_config';

  constructor() {}

  insertWidgetConfig(data: Partial<IWidgetConfig>): Observable<IWidgetConfig> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'insert';
    const body = data ;

    return this.http.post<IWidgetConfig>(`${this.apiUrl}/${apiMethod}/`, body, { headers })
  }  

  getAllWidgets(user_id: number, dashboard_id: string): Observable<IWidgetConfig[]> {
    const apiMethod = 'get_all';
    return this.http.get<IWidgetConfig[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&dashboard_id=${dashboard_id}`)
  }

  updateWidgets(user_id: number, dashboard_id: string, data: IWidgetConfig[]): Observable<IWidgetConfig[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiMethod = 'update';
    const body = data ;

    return this.http.put<IWidgetConfig[]>(`${this.apiUrl}/${apiMethod}/?user_id=${user_id}&dashboard_id=${dashboard_id}`, body, { headers })
  }

  deleteWidget(id: number, user_id: number, dashboard_id: string): Observable<IWidgetConfig[]> {
    const apiMethod = 'delete';
    return this.http.delete<IWidgetConfig[]>(`${this.apiUrl}/${apiMethod}/?id=${id}&user_id=${user_id}&dashboard_id=${dashboard_id}`)
  }
  
}
