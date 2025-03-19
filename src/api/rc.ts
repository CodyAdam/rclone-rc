import { z } from 'zod';
import { Paths, errorSchema, Router } from './shared';

export const rcEndpoints = {
  noop: {
    method: 'POST',
    path: '/rc/noop' satisfies Paths,
    body: z.record(z.unknown()).optional(),
    responses: {
      200: z.record(z.unknown()).describe('input parameters echoed'),
      500: errorSchema,
    },
  },
  noopAuth: {
    method: 'POST',
    path: '/rc/noopauth' satisfies Paths,
    body: z.record(z.unknown()).optional(),
    responses: {
      200: z.record(z.unknown()).describe('input parameters echoed'),
      500: errorSchema,
    },
  },
} satisfies Router;
