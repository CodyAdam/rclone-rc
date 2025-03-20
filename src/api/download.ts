import { z } from 'zod';
import { errorSchema, Router } from './shared';
import { initContract } from '@ts-rest/core';

const c = initContract();

export const downloadEndpoints = {
  download: {
    method: 'GET',
    path: '/:fs/:remote',
    description: 'Download a file from a remote filesystem',
    pathParams: c.type<{ fs: `[${string}]`; remote: string }>(),
    responses: {
      200: z.any().describe('Binary file content'),
      404: errorSchema,
      500: errorSchema,
    },
  },
} as const satisfies Router;
