import { createAsyncClient, createClient } from '../client';

/**
 * To run test you need an instance of rclone running with rc enabled.
 *
 * Recommanded way:
 * ```bash
 * rclone rcd -vv --rc-web-gui --rc-user admin --rc-pass password
 * ```
 */

export const client = createClient({
  username: 'admin',
  password: 'password',
});
export const asyncClient = createAsyncClient({
  username: 'admin',
  password: 'password',
});

export async function purgeMemoryFs(folder: string) {
  const response = await client.purge({ body: { fs: ':memory:', remote: folder } });
  return response;
}
