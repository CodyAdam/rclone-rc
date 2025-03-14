import { Zodios } from '@zodios/core';
import { AxiosRequestConfig } from 'axios';
import { rcloneApi } from './api';

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

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Rclone is a fully typed API client for rclone RC
 *
 * @example
 * ```ts
 * const api = createClient({
 *   baseUrl: 'http://localhost:5572', // endpoint where rclone is running
 *   username: 'admin',
 *   password: 'password',
 * });
 *
 * // use type-safe path
 * const version = await api.post("/core/version", undefined)
 * console.log(version)
 *
 * // or use alias function
 * const version = await api.version(undefined)
 * console.log(version)
 * ```
 */
export function createClient(options: RcloneRcOptions = {}) {
  const { baseUrl = 'http://localhost:5572', username, password, timeout = 30000 } = options;

  const config: AxiosRequestConfig = {
    timeout,
    auth: username && password ? { username, password } : undefined,
  };

  return new Zodios(baseUrl, rcloneApi, { axiosConfig: config });
}
