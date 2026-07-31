import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobRunModel } from '../../models/job-run-model';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class JobRunService {
  http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/job_run`; }

  getRecentRuns(job_name: string, limit: number): Observable<JobRunModel[]> {
    const apiMethod = 'recent';
    return this.http.get<JobRunModel[]>(
      `${this.apiUrl}/${apiMethod}/?job_name=${job_name}&limit=${limit}`,
    );
  }
}
