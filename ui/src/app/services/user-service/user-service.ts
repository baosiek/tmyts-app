import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUserModel } from '../../models/auth-user-model';
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

  // No user_id param: the backend derives the caller from the bearer
  // token (GET /users/get_users), and never returns user_password -
  // AuthUserModel is the same password-free shape as the login/me response.
  getUser(): Observable<AuthUserModel> {
    return this.http.get<AuthUserModel>(`${this.apiUrl}/get_users`);
  }

  updateUser(user_data: Partial<UserModel> | null): Observable<ReturnMessage> {
    return this.http.patch<ReturnMessage>(`${this.apiUrl}/update_users`, user_data);
  }
}
