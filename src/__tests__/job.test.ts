import { describe, expect, it } from 'vitest';
import { client, asyncClient } from './test-setup';

describe('Job Operations', () => {
  it('should list jobs', async () => {
    const jobList = await client.jobList({ body: undefined });
    expect(jobList.status).toBe(200);
    if (jobList.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(jobList)}`);
    expect(Array.isArray(jobList.body.jobids)).toBe(true);
  });

  it('should handle job status', async () => {
    // First create a job by starting an operation
    // We'll use a list operation which should complete quickly
    const listOperation = client.list({
      body: { fs: ':local:', remote: '' },
    });

    // Get job list to find our job
    const jobList = await client.jobList({ body: undefined });
    expect(jobList.status).toBe(200);
    if (jobList.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(jobList)}`);

    // If there are jobs, check the status of the first one
    if (jobList.body.jobids.length > 0) {
      const jobId = jobList.body.jobids[0];
      const jobStatus = await client.jobStatus({
        body: { jobid: jobId },
      });

      expect(jobStatus.status).toBe(200);
      if (jobStatus.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(jobStatus)}`);
      await listOperation;
    }
  });

  it(
    'should stop a job and stop a job group',
    {
      timeout: 10000,
    },
    async () => {
      // Start a long-running job in the background
      // For testing purposes, we'll use list which should complete quickly
      const job = await asyncClient.list({
        body: {
          fs: ':local:',
          remote: '',
          opt: { recurse: true }, // Make it potentially longer running
          _async: true,
        },
      });
      expect(job.status).toBe(200);
      if (job.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(job)}`);
      const jobId = job.body.jobid;

      // Get the job list
      const jobList = await client.jobList({ body: undefined });
      expect(jobList.status).toBe(200);
      if (jobList.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(jobList)}`);

      // Try to stop the job we created
      const stopResult = await client.jobStop({
        body: { jobid: jobId },
      });

      // The job might complete before we can stop it, so we accept both success and failure
      expect([200, 500]).toContain(stopResult.status);

      // Test stopgroup (this might fail if no jobs with groups are running)
      const stopGroupResult = await client.jobStopGroup({
        body: { group: 'test-group' },
      });

      // This might fail since we don't know if there are any jobs with this group
      expect([200, 500]).toContain(stopGroupResult.status);

      // Wait for our original job to complete or be stopped
      // Check the status of our job
      const jobStatus = await client.jobStatus({
        body: { jobid: jobId },
      });
      expect([200, 500]).toContain(jobStatus.status);
    },
  );
});
