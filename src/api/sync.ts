import { z } from 'zod';
import { Paths, Router, errorSchema, globalOptionsSchema } from './shared';

export const syncEndpoints = {
  sync: {
    method: 'POST',
    path: '/sync/sync' satisfies Paths,
    body: z
      .object({
        srcFs: z.string().describe('a remote name string e.g. "drive:src" for the source'),
        dstFs: z.string().describe('a remote name string e.g. "drive:dst" for the destination'),
        createEmptySrcDirs: z.boolean().optional().describe('create empty src directories on destination if set'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
} satisfies Router;
