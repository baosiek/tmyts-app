import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUser GETs /users/get_users with no user_id in the URL', () => {
    let result: unknown;
    service.getUser().subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/users/get_users');
    expect(req.request.method).toBe('GET');
    const user = { user_id: 1, user_name: 'bao', email: 'bao@example.com', theme: 'light', portfolio_name: 'main', user_photo: null };
    req.flush(user);

    expect(result).toEqual(user);
  });

  it('updateUser PATCHes /users/update_users with the given data', () => {
    service.updateUser({ theme: 'dark' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/users/update_users');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ theme: 'dark' });
    req.flush({ status_code: 200, message: 'ok' });
  });
});
