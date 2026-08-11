export interface BackgroundJob {
  id: string;
  type: 'retry_email' | 'retry_push' | 'sync_shipment_status' | 'cleanup_carts' | 'expire_coupons';
  payload: Record<string, any>;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lastError?: string;
  createdAt: string;
}

export class BackgroundJobProcessor {
  private queue: BackgroundJob[] = [];

  public enqueueJob(type: BackgroundJob['type'], payload: Record<string, any>, maxAttempts = 3): BackgroundJob {
    const job: BackgroundJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      payload,
      attempts: 0,
      maxAttempts,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.queue.push(job);
    return job;
  }

  public async processNextBatch(): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;

    const pendingJobs = this.queue.filter((j) => j.status === 'pending' || j.status === 'failed');

    for (const job of pendingJobs) {
      if (job.attempts >= job.maxAttempts) continue;

      job.status = 'processing';
      job.attempts += 1;

      try {
        // Execute simulated job logic
        job.status = 'completed';
        processed += 1;
      } catch (err: any) {
        job.status = 'failed';
        job.lastError = err.message || 'Job execution error';
        failed += 1;
      }
    }

    return { processed, failed };
  }

  public getQueueStatus(): { total: number; pending: number; completed: number; failed: number } {
    return {
      total: this.queue.length,
      pending: this.queue.filter((j) => j.status === 'pending').length,
      completed: this.queue.filter((j) => j.status === 'completed').length,
      failed: this.queue.filter((j) => j.status === 'failed').length,
    };
  }
}
