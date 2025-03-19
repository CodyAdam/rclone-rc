import { createAsyncClient, createClient } from '../client';

export const client = createClient();
export const asyncClient = createAsyncClient();

export async function purgeMemoryFs(folder: string) {
  const response = await client.purge({ body: { fs: ':memory:', remote: folder } });
  return response;
}
