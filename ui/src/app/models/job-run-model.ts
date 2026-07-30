export type JobRunModel = {
  id: number;
  job_name: string;
  job_type: string;
  frequency: string;
  scheduled_time?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status: string;
  records_processed?: number | null;
  error_message?: string | null;
  retry_count: number;
  triggered_by: string;
  created_at: string;
}
