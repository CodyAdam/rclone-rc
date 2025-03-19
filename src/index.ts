import { rcloneAsyncContract, rcloneContract } from './api';
import { createAsyncClient, createClient, type RcloneRcOptions } from './client';
import { createConnectionString, fsConnectionSchema, type FsConnection } from './utils';

export default createClient;
export {
  createAsyncClient,
  createClient,
  createConnectionString,
  fsConnectionSchema,
  rcloneAsyncContract,
  rcloneContract,
  type FsConnection,
  type RcloneRcOptions,
};
