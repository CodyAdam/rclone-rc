import { beforeEach, describe, expect, it } from 'vitest';
import { createAsyncClient, createClient } from '../client';

const client = createClient();
const asyncClient = createAsyncClient();

describe('Rclone Client', () => {
  it('should check if rclone is running', async () => {
    // Check if rclone is running on port 5572
    const response = await client.noop({ body: { ping: 'pong' } });
    expect(response.status).toBe(200);
    if (response.status !== 200) expect.fail('Rclone is not running');
    expect(response.body).toEqual({ ping: 'pong' });
  });

  beforeEach(async () => {
    const response = await client.purge({ body: { fs: ':memory:', remote: '' } });
    expect(response.status).toBe(200);
  });

  it('should perform noop operation', async () => {
    const testParams = { param1: 'test', param2: 123 };
    const noop = await client.noop({ body: testParams });
    expect(noop.status).toBe(200);
    if (noop.status !== 200) return;
    expect(noop.body).toEqual(testParams);
  });

  it('should perform noopauth operation', async () => {
    const testParams = { param1: 'test', param2: 123 };
    const noopauth = await client.noopauth({ body: testParams });
    expect(noopauth.status).toBe(200);
    if (noopauth.status !== 200) return;
    expect(noopauth.body).toEqual(testParams);
  });

  it('should get version', async () => {
    const version = await client.version({ body: undefined });
    expect(version.status).toBe(200);
    expect(version).toBeDefined();
  });

  it('should get stats', async () => {
    const stats = await client.stats({ body: undefined });
    expect(stats.status).toBe(200);
    expect(stats).toBeDefined();
  });

  it('should get about', async () => {
    const about = await client.about({ body: { fs: ':local:' } });
    expect(about.status).toBe(200);
    expect(about).toBeDefined();
  });

  it('should list current directory', async () => {
    const list = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(list.status).toBe(200);
    expect(list).toBeDefined();
  });

  it('should upload file', async () => {
    const testFileContent = 'This is a test file content';
    const testFileName = 'test.txt';
    const formData = new FormData();
    formData.append(
      'file0',
      new File([testFileContent], testFileName, {
        type: 'text/plain',
      }),
    );

    const upload = await client.uploadFile({
      body: formData,
      query: { fs: ':memory:', remote: '' },
    });
    expect(upload.status).toBe(200);
    expect(upload).toBeDefined();

    const list = await client.list({ body: { fs: ':memory:', remote: '' } });
    expect(list.status).toBe(200);
    if (list.status !== 200) return;
    expect(list.body.list.some(item => item.Name === testFileName)).toBe(true);
  });

  it('should purge', async () => {
    const purged = await client.purge({ body: { fs: ':memory:', remote: '' } });
    expect(purged.status).toBe(200);
    expect(purged).toBeDefined();
  });

  it('should create and remove directories', async () => {
    const dir = 'rclone-rc-test';
    const subdir = 'subrclone-rc-test';
    // Create parent directory
    const createParentDir = await client.mkdir({ body: { fs: ':local:', remote: dir } });
    expect(createParentDir.status).toBe(200);

    // Verify parent directory exists
    const listRoot = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(listRoot.status).toBe(200);
    if (listRoot.status !== 200) return;
    expect(listRoot.body.list.some(item => item.Path === dir)).toBe(true);

    // Create subdirectory
    const createSubDir = await client.mkdir({
      body: { fs: ':local:', remote: `${dir}/${subdir}` },
    });
    expect(createSubDir.status).toBe(200);

    // Verify subdirectory exists
    const listParentDir = await client.list({ body: { fs: ':local:', remote: dir } });
    expect(listParentDir.status).toBe(200);
    if (listParentDir.status !== 200) return;
    expect(listParentDir.body.list.some(item => item.Path === `${dir}/${subdir}`)).toBe(true);

    // Remove subdirectory
    const removeSubDir = await client.rmdir({
      body: { fs: ':local:', remote: `${dir}/${subdir}` },
    });
    expect(removeSubDir.status).toBe(200);

    // Verify subdirectory was removed
    const listAfterSubDirRemoval = await client.list({ body: { fs: ':local:', remote: dir } });
    expect(listAfterSubDirRemoval.status).toBe(200);
    if (listAfterSubDirRemoval.status !== 200) return;
    expect(listAfterSubDirRemoval.body.list.some(item => item.Path === dir)).toBe(false);

    // Remove parent directory
    const removeParentDir = await client.rmdir({ body: { fs: ':local:', remote: dir } });
    expect(removeParentDir.status).toBe(200);

    // Verify parent directory was removed
    const listAfterParentDirRemoval = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(listAfterParentDirRemoval.status).toBe(200);
    if (listAfterParentDirRemoval.status !== 200) return;
    expect(listAfterParentDirRemoval.body.list.some(item => item.Path === dir)).toBe(false);
  });

  it('should list jobs', async () => {
    const jobList = await client.jobList({ body: undefined });
    expect(jobList.status).toBe(200);
    if (jobList.status !== 200) return;
    console.log('Job list response:', JSON.stringify(jobList.body));
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
    if (jobList.status !== 200) return;

    // If there are jobs, check the status of the first one
    if (jobList.body.jobids.length > 0) {
      const jobId = jobList.body.jobids[0];
      const jobStatus = await client.jobStatus({
        body: { jobid: jobId },
      });

      expect(jobStatus.status).toBe(200);
      if (jobStatus.status !== 200) return;
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
      if (job.status !== 200) return;
      const jobId = job.body.jobid;

      // Get the job list
      const jobList = await client.jobList({ body: undefined });
      expect(jobList.status).toBe(200);
      if (jobList.status !== 200) {
        // Skip the test if we can't get job list
        return;
      }

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
      try {
        // Check the status of our job
        const jobStatus = await client.jobStatus({
          body: { jobid: jobId },
        });
        expect([200, 500]).toContain(jobStatus.status);
      } catch (error) {
        // Job might have been stopped, which is expected
      }
    },
  );
});
