import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { coreEndpoints } from './core';
import { operationsEndpoints } from './operations';
import { rcEndpoints } from './rc';
import { AsyncContract, Router } from './shared';
import { syncEndpoints } from './sync';
import { optionsEndpoints } from './options';
import { jobEndpoints } from './job';
import { downloadEndpoints } from './download';

const c = initContract();

// Combine all endpoint specifications
const spec = {
  ...rcEndpoints,
  ...coreEndpoints,
  ...operationsEndpoints,
  ...syncEndpoints,
  ...optionsEndpoints,
  ...jobEndpoints,
  ...downloadEndpoints,
} satisfies Router;

// Create the contract from the combined spec
export const rcloneContract = c.router(spec);

// Create a modified spec with async responses
const asyncSpec = Object.fromEntries(
  Object.entries(spec).map(([key, value]) => [
    key,
    {
      ...value,
      responses: {
        ...value.responses,
        200: z.object({
          jobid: z.number().describe('ID of the asynchronous job'),
        }),
      },
    },
  ]),
) satisfies Router;

// Create the async contract and apply the type transformation
export const rcloneAsyncContract = c.router(asyncSpec) as AsyncContract<typeof rcloneContract>;

// Re-export all the endpoints for convenience
export { coreEndpoints, operationsEndpoints, rcEndpoints };

// Re-export shared types and schemas
export * from './shared';
