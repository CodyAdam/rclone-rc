import { rcloneAsyncContract, rcloneContract } from './api';
import { createAsyncClient, createClient, RcloneRcOptions } from './client';

export default createClient;
export {
  createAsyncClient,
  createClient,
  rcloneAsyncContract,
  rcloneContract,
  type RcloneRcOptions,
};
