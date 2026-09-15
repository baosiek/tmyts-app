import { DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { MATERIAL_IMPORTS } from '../../../../../material-imports';
import { JobRunModel } from '../../../../../models/job-run-model';
import { JobRunService } from '../../../../../services/job-run/job-run-service';
import { TmytsChip } from '../../../../reusable-components/tmyts-chip/tmyts-chip';

// Batch jobs whose most recent run status is displayed here.
const JOB_NAMES: string[] = [
  'daily_direction_inferencer',
  'price_history_downloader',
  'momentum_strategy',
  'train_industry_direction_classifier',
  'allocation_rebalancer',
  'nlp_history_sync',
  'train_unified_direction_classifier',
  'daily_backup',
  'compute_daily_ticker_vectors',
  'compute_surprise'
];

// Job run statuses, grouped by the chip style they should render with.
const SUCCESS_STATUSES = ['success', 'succeeded', 'completed'];
const FAILURE_STATUSES = ['failed', 'failure', 'error'];
const RUNNING_STATUSES = ['running'];

// Not every job_run job_name has a matching Kubernetes CronJob it can be
// manually started/killed through - only jobs scheduled as their own
// CronJob in the tmyts-trade namespace do. Maps job_run.job_name to the
// job_run/start_job & job_run/kill_job "job_name" (the CronJob's name in
// the tmyts-trade namespace, minus the "tmyts-trade-" prefix).
const MANUAL_CONTROL_JOB_NAMES: Record<string, string> = {
  daily_direction_inferencer: 'daily-direction-inferencer',
  price_history_downloader: 'history',
  momentum_strategy: 'momentum-strategy',
  train_industry_direction_classifier: 'train-industry-classifier',
  nlp_history_sync: 'nlp-history-sync',
  // The compute-ticker-surprise CronJob runs both compute_daily_ticker_vectors
  // and compute_surprise back-to-back in a single run.
  compute_daily_ticker_vectors: 'compute-ticker-surprise',
  compute_surprise: 'compute-ticker-surprise',
};

@Component({
  selector: 'app-processing-status',
  imports: [
    ...MATERIAL_IMPORTS,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    DecimalPipe,
    TmytsChip,
  ],
  templateUrl: './processing-status.html',
  styleUrl: './processing-status.scss',
})
export class ProcessingStatus implements OnInit, AfterViewInit {

  jobRunService: JobRunService = inject(JobRunService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  spinnerFlagIsSet: boolean = false;

  // job_name of the job whose start/kill request is currently in flight,
  // so its button can show a spinner and both buttons can be disabled.
  pendingJobName: string | null = null;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  dataSource: MatTableDataSource<JobRunModel> = new MatTableDataSource();

  displayedColumns: string[] = [
    'job_name',
    'status',
    'start_time',
    'end_time',
    'records_processed',
    'actions',
  ];

  ngOnInit(): void {
    this.loadRecentRuns();
  }

  ngAfterViewInit(): void {
    this.attachTableFeatures();
  }

  private attachTableFeatures(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    this.dataSource._updateChangeSubscription();
  }

  statusChipClass(status: string): string {
    const normalized = status?.toLowerCase();
    if (SUCCESS_STATUSES.includes(normalized)) return 'success-container';
    if (FAILURE_STATUSES.includes(normalized)) return 'error-container';
    return 'neutral-container';
  }

  statusChipIcon(status: string): string {
    const normalized = status?.toLowerCase();
    if (SUCCESS_STATUSES.includes(normalized)) return 'check_circle';
    if (FAILURE_STATUSES.includes(normalized)) return 'cancel';
    return 'schedule';
  }

  isJobRunning(status: string): boolean {
    return RUNNING_STATUSES.includes(status?.toLowerCase());
  }

  canControlJob(jobName: string): boolean {
    return jobName in MANUAL_CONTROL_JOB_NAMES;
  }

  startJob(element: JobRunModel): void {
    const k8sJobName = MANUAL_CONTROL_JOB_NAMES[element.job_name];
    this.pendingJobName = element.job_name;
    this.jobRunService.startJob(k8sJobName).subscribe({
      next: () => {
        this.snackBar.open(`Started ${element.job_name}.`, 'Close');
        this.loadRecentRuns();
      },
      error: (error: HttpErrorResponse) => {
        this.pendingJobName = null;
        this.snackBar.open(
          `Failed to start ${element.job_name}: ${this.describeError(error)}`,
          'Close',
        );
      },
    });
  }

  killJob(element: JobRunModel): void {
    const k8sJobName = MANUAL_CONTROL_JOB_NAMES[element.job_name];
    this.pendingJobName = element.job_name;
    this.jobRunService.killJob(k8sJobName).subscribe({
      next: () => {
        this.snackBar.open(`Killed ${element.job_name}.`, 'Close');
        this.loadRecentRuns();
      },
      error: (error: HttpErrorResponse) => {
        this.pendingJobName = null;
        this.snackBar.open(
          `Failed to kill ${element.job_name}: ${this.describeError(error)}`,
          'Close',
        );
      },
    });
  }

  private describeError(error: HttpErrorResponse): string {
    if (error.status === 404) return 'unknown job';
    if (error.status === 409) return 'nothing is currently running';
    return error.error?.detail ?? 'unexpected error';
  }

  private loadRecentRuns(): void {
    this.spinnerFlagIsSet = true;
    forkJoin(
      JOB_NAMES.map((jobName) => this.jobRunService.getRecentRuns(jobName, 1)),
    ).subscribe({
      next: (responses) => {
        this.dataSource.data = responses.flat();
        this.attachTableFeatures();
      },
      complete: () => {
        this.spinnerFlagIsSet = false;
        this.pendingJobName = null;
      },
    });
  }
}
