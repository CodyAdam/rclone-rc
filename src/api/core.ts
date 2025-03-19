import { z } from 'zod';
import { errorSchema, globalOptionsSchema, Paths, Router } from './shared';

export const coreEndpoints = {
  version: {
    method: 'POST',
    path: '/core/version' satisfies Paths,
    body: globalOptionsSchema.optional(),
    responses: {
      200: z.object({
        version: z.string().describe("rclone version, e.g. 'v1.53.0'"),
        os: z.string().describe('OS in use as according to Go'),
        arch: z.string().describe('cpu architecture in use according to Go'),
        decomposed: z.array(z.number()).describe('version number as [major, minor, patch]'),
        isGit: z.boolean().describe('true if this was compiled from the git version'),
        isBeta: z.boolean().describe('true if this is a beta version'),
        goVersion: z.string().describe('version of Go runtime in use'),
        linking: z.string().describe('type of rclone executable (static or dynamic)'),
        goTags: z.string().describe("space separated build tags or 'none'"),
      }),
      500: errorSchema,
    },
  },
  stats: {
    method: 'POST',
    path: '/core/stats' satisfies Paths,
    body: globalOptionsSchema.optional(),
    responses: {
      200: z.object({
        bytes: z.number(),
        checks: z.number(),
        deletedDirs: z.number(),
        deletes: z.number(),
        elapsedTime: z.number(),
        errors: z.number(),
        eta: z.number().nullable(),
        fatalError: z.boolean(),
        lastError: z.string().optional(),
        retryError: z.boolean(),
        renames: z.number(),
        serverSideCopies: z.number(),
        serverSideCopyBytes: z.number(),
        serverSideMoveBytes: z.number(),
        serverSideMoves: z.number(),
        speed: z.number(),
        totalBytes: z.number(),
        totalChecks: z.number(),
        totalTransfers: z.number(),
        transferTime: z.number(),
        transfers: z.number(),
      }),
      500: errorSchema,
    },
  },
  jobList: {
    method: 'POST',
    path: '/job/list' satisfies Paths,
    body: globalOptionsSchema.optional(),
    responses: {
      200: z.object({
        executeId: z.string().describe('string id of rclone executing (change after restart)'),
        jobids: z
          .array(z.number())
          .describe('array of integer job ids (starting at 1 on each restart)'),
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
        endTime: z
          .string()
          .describe('time the job finished (e.g. "2018-10-26T18:50:20.528746884+01:00")'),
        error: z.string().describe('error from the job or empty string for no error'),
        id: z.number().describe('as passed in above'),
        startTime: z
          .string()
          .describe('time the job started (e.g. "2018-10-26T18:50:20.528336039+01:00")'),
        success: z.boolean().describe('boolean - true for success false otherwise'),
        output: z
          .unknown()
          .describe('output of the job as would have been returned if called synchronously'),
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
