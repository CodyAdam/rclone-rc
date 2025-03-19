import { z } from 'zod';
import { errorSchema, globalOptionsSchema, Paths, Router } from './shared';

export const jobEndpoints = {
  jobList: {
    method: 'POST',
    path: '/job/list' satisfies Paths,
    body: globalOptionsSchema.optional(),
    responses: {
      200: z.object({
        executeId: z.string().describe('string id of rclone executing (change after restart)'),
        jobids: z.array(z.number()).describe('array of integer job ids (starting at 1 on each restart)'),
      }),
      500: errorSchema,
    },
  },
  jobStatus: {
    method: 'POST',
    path: '/job/status' satisfies Paths,
    body: z
      .object({
        jobid: z.number().describe('id of the job (integer)'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({
        finished: z.boolean().describe('boolean whether the job has finished or not'),
        duration: z.number().describe('time in seconds that the job ran for'),
        endTime: z.string().describe('time the job finished (e.g. "2018-10-26T18:50:20.528746884+01:00")'),
        error: z.string().describe('error from the job or empty string for no error'),
        id: z.number().describe('as passed in above'),
        startTime: z.string().describe('time the job started (e.g. "2018-10-26T18:50:20.528336039+01:00")'),
        success: z.boolean().describe('boolean - true for success false otherwise'),
        output: z.unknown().describe('output of the job as would have been returned if called synchronously'),
        progress: z.unknown().describe('output of the progress related to the underlying job'),
      }),
      500: errorSchema,
    },
  },
  jobStop: {
    method: 'POST',
    path: '/job/stop' satisfies Paths,
    body: z
      .object({
        jobid: z.number().describe('id of the job (integer)'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
  jobStopGroup: {
    method: 'POST',
    path: '/job/stopgroup' satisfies Paths,
    body: z
      .object({
        group: z.string().describe('name of the group (string)'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
} as const satisfies Router;
