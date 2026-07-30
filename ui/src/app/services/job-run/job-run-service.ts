import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobRunModel } from '../../models/job-run-model';

@Injectable({
  providedIn: 'root'
})
export class JobRunService {
  http = inject(HttpClient);
  apiUrl = 'http://127.0.0.1:8000/job_run';

  getRecentRuns(job_name: string, limit: number): Observable<JobRunModel[]> {
    const apiMethod = 'recent';
    return this.http.get<JobRunModel[]>(
      `${this.apiUrl}/${apiMethod}/?job_name=${job_name}&limit=${limit}`,
    );
  }
}
