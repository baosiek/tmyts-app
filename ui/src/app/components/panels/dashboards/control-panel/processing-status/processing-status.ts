import { DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  'daily_backup'
];

// Job run statuses, grouped by the chip style they should render with.
const SUCCESS_STATUSES = ['success', 'succeeded', 'completed'];
const FAILURE_STATUSES = ['failed', 'failure', 'error'];

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

  spinnerFlagIsSet: boolean = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  dataSource: MatTableDataSource<JobRunModel> = new MatTableDataSource();

  displayedColumns: string[] = [
    'job_name',
    'status',
    'start_time',
    'end_time',
    'records_processed',
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
      },
    });
  }
}
