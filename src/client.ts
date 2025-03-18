import { initClient } from '@ts-rest/core';
import { rcloneAsyncContract, rcloneContract } from './api';

/**
 * Options for configuring the RcloneClient
 */
export interface RcloneRcOptions {
  /**
   * Base URL for the rclone RC API
   * @default 'http://localhost:5572'
   */
  baseUrl?: string;

  /**
   * Username for basic authentication
   */
  username?: string;

  /**
   * Password for basic authentication
   */
  password?: string;
}

/**
 * Rclone is a fully typed API client for rclone RC
 *
 * @example
 * ```ts
 * const client = createClient({
 *   baseUrl: 'http://localhost:5572', // endpoint where rclone is running
 *   username: 'admin',
 *   password: 'password',
 * });
 * 
 * // Perform a noop operation
 * const noop = await client.noop({ body: { param1: 'test', param2: 123 } });
 * 
 * // List files in a directory
 * const list = await client.list({ body: { fs: ':local:', remote: '' } });
 * 
 * // Upload a file
 * const formData = new FormData();
 * formData.append('file0', new File(['content'], 'test.txt', { type: 'text/plain' }));
 * const upload = await client.uploadFile({
 *   body: formData,
 *   query: { fs: ':memory:', remote: '' },
 * });
 * ```
 */
export function createClient(options: RcloneRcOptions = {}) {
  const { baseUrl = 'http://localhost:5572', username, password } = options;

  const client = initClient(rcloneContract, {
    baseUrl,
    baseHeaders: username && password ? { auth: `${username}:${password}` } : undefined,
    validateResponse: true,
  });

  return client;
}

/**
 * Creates an async client for rclone RC that supports asynchronous operations
 * 
 * @example
 * ```ts
 * const asyncClient = createAsyncClient({
 *   baseUrl: 'http://localhost:5572',
 *   username: 'admin',
 *   password: 'password',
 * });
 * 
 * // Start a long-running job in the background
 * const job = await asyncClient.list({
 *   body: {
 *     fs: ':local:',
 *     remote: '',
 *     opt: { recurse: true },
 *     _async: true, // This flag makes the operation run asynchronously
 *   },
 * });
 * 
 * // Get the job ID from the response
 * const jobId = job.body.jobid;
 * 
 * // Check job status
 * const jobStatus = await client.jobStatus({
 *   body: { jobid: jobId },
 * });
 * ```
 */
export function createAsyncClient(options: RcloneRcOptions = {}) {
  const { baseUrl = 'http://localhost:5572', username, password } = options;

  const client = initClient(rcloneAsyncContract, {
    baseUrl,
    baseHeaders: username && password ? { auth: `${username}:${password}` } : undefined,
    validateResponse: true,
  });

  return client;
}
