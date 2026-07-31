import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReturnMessage } from '../../models/return-message';
import { UserModel } from '../../models/user-model';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/users`; }

  constructor() { }

  getUser(user_id: number): Observable<UserModel> {
    const apiMethod = 'get';
    return this.http.get<UserModel>(
      `${this.apiUrl}/${apiMethod}/?user_id=${user_id}`,
    );
  }

  updateUser(
    user_id: number,
    user_data: Partial<UserModel> | null,
  ): Observable<ReturnMessage> {
    const apiMethod = 'update';
    const body = user_data;
    return this.http.patch<ReturnMessage>(
      `${this.apiUrl}/${apiMethod}/?user_id=${user_id}`,
      body,
    );
  }
}
