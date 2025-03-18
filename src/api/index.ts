import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const paths = [
  '/backend/command',
  '/cache/expire',
  '/cache/fetch',
  '/cache/stats',
  '/config/create',
  '/config/delete',
  '/config/dump',
  '/config/get',
  '/config/listremotes',
  '/config/password',
  '/config/paths',
  '/config/providers',
  '/config/setpath',
  '/config/update',
  '/core/bwlimit',
  '/core/command',
  '/core/du',
  '/core/gc',
  '/core/group-list',
  '/core/memstats',
  '/core/obscure',
  '/core/pid',
  '/core/quit',
  '/core/stats', // DONE
  '/core/stats-delete',
  '/core/stats-reset',
  '/core/transferred',
  '/core/version', // DONE
  '/debug/set-block-profile-rate',
  '/debug/set-gc-percent',
  '/debug/set-mutex-profile-fraction',
  '/debug/set-soft-memory-limit',
  '/fscache/clear',
  '/fscache/entries',
  '/job/list', // DONE
  '/job/status', // DONE
  '/job/stop', // DONE
  '/job/stopgroup', // DONE
  '/mount/listmounts',
  '/mount/mount',
  '/mount/types',
  '/mount/unmount',
  '/mount/unmountall',
  '/operations/about', // DONE
  '/operations/check',
  '/operations/cleanup',
  '/operations/copyfile',
  '/operations/copyurl',
  '/operations/delete',
  '/operations/deletefile',
  '/operations/fsinfo',
  '/operations/hashsum',
  '/operations/list', // DONE
  '/operations/mkdir', // DONE
  '/operations/movefile',
  '/operations/publiclink',
  '/operations/purge', // DONE
  '/operations/rmdir', // DONE
  '/operations/rmdirs',
  '/operations/settier',
  '/operations/settierfile',
  '/operations/size',
  '/operations/stat',
  '/operations/uploadfile',
  '/options/blocks',
  '/options/get',
  '/options/info',
  '/options/local',
  '/options/set',
  '/pluginsctl/addPlugin',
  '/pluginsctl/getPluginsForType',
  '/pluginsctl/listPlugins',
  '/pluginsctl/listTestPlugins',
  '/pluginsctl/removePlugin',
  '/pluginsctl/removeTestPlugin',
  '/rc/error',
  '/rc/list',
  '/rc/noop', // DONE
  '/rc/noopauth', // DONE
  '/sync/bisync',
  '/sync/copy',
  '/sync/move',
  '/sync/sync',
  '/vfs/forget',
  '/vfs/list',
  '/vfs/poll-interval',
  '/vfs/queue',
  '/vfs/queue-set-expiry',
  '/vfs/refresh',
  '/vfs/stats',
] as const;

export const errorSchema = z.object({
  error: z.string().describe('Error message'),
  input: z.record(z.unknown()).optional().describe('Input parameters that caused the error'),
  path: z.string().optional().describe('API path that was called'),
  status: z.number().optional().describe('HTTP status code'),
});

const itemSchema = z.object({
  Path: z.string().optional().describe('Full path of the item'),
  Name: z.string().optional().describe('Name of the item'),
  Size: z.number().optional().describe('Size of the item in bytes'),
  MimeType: z.string().optional().describe('MIME type of the item'),
  ModTime: z.string().optional().describe('Modification time of the item'),
  IsDir: z.boolean().optional().describe('Whether the item is a directory'),
  Hashes: z
    .record(z.string())
    .optional()
    .describe('Hashes of the item (SHA-1, MD5, DropboxHash, etc.)'),
  ID: z.string().optional().describe('ID of the item'),
  OrigID: z.string().optional().describe('Original ID of the item'),
  IsBucket: z.boolean().optional().describe('Whether the item is a bucket'),
  Tier: z.string().optional().describe('Storage tier of the item (e.g., "hot")'),
  Encrypted: z.string().optional().describe('Encrypted name of the item'),
  EncryptedPath: z.string().optional().describe('Encrypted path of the item'),
  Metadata: z.record(z.unknown()).optional().describe('Additional metadata of the item'),
});

const globalOptionsSchema = z.object({
  _async: z
    .boolean()
    .optional()
    .describe(
      'If set run asynchronously, which means the command will return a job id and then return',
    ),
  _config: z
    .record(z.unknown())
    .optional()
    .describe('A dictionary of config parameters to control the command execution'),
  _filter: z
    .record(z.unknown())
    .optional()
    .describe('A dictionary of filter parameters to apply for this command only'),
  _group: z
    .string()
    .optional()
    .describe('Group name for this command to track stats under a custom name'),
});

const spec = {
  noop: {
    method: 'POST',
    path: '/rc/noop' satisfies (typeof paths)[number],
    body: z.record(z.unknown()).optional(),
    responses: {
      200: z.record(z.unknown()).describe('input parameters echoed'),
      500: errorSchema,
    },
  },
  noopauth: {
    method: 'POST',
    path: '/rc/noopauth' satisfies (typeof paths)[number],
    body: z.record(z.unknown()).optional(),
    responses: {
      200: z.record(z.unknown()).describe('input parameters echoed'),
      500: errorSchema,
    },
  },
  version: {
    method: 'POST',
    path: '/core/version' satisfies (typeof paths)[number],
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
  list: {
    method: 'POST',
    path: '/operations/list' satisfies (typeof paths)[number],
    body: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
        remote: z.string().describe('a path within that remote e.g. "dir"'),
        opt: z
          .object({
            recurse: z.boolean().optional().describe('If set recurse directories'),
            noModTime: z.boolean().optional().describe('If set return modification time'),
            showEncrypted: z.boolean().optional().describe('If set show decrypted names'),
            showOrigIDs: z
              .boolean()
              .optional()
              .describe('If set show the IDs for each item if known'),
            showHash: z.boolean().optional().describe('If set return a dictionary of hashes'),
            noMimeType: z.boolean().optional().describe("If set don't show mime types"),
            dirsOnly: z.boolean().optional().describe('If set only show directories'),
            filesOnly: z.boolean().optional().describe('If set only show files'),
            metadata: z.boolean().optional().describe('If set return metadata of objects also'),
            hashTypes: z
              .array(z.string())
              .optional()
              .describe('array of strings of hash types to show if showHash set'),
          })
          .optional()
          .describe('a dictionary of options to control the listing (optional)'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({ list: z.array(itemSchema) }),
      500: errorSchema,
    },
  },
  about: {
    method: 'POST',
    path: '/operations/about' satisfies (typeof paths)[number],
    body: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({
        total: z.number(),
        used: z.number(),
        free: z.number(),
        trashed: z.number().optional(),
        other: z.number().optional(),
        objects: z.number().optional(),
      }),
      500: errorSchema,
    },
  },
  uploadFile: {
    method: 'POST',
    path: '/operations/uploadfile' satisfies (typeof paths)[number],
    query: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
        remote: z.string().describe('a path within that remote e.g. "dir"'),
      })
      .extend(globalOptionsSchema.shape),
    contentType: 'multipart/form-data',
    body: z.instanceof(FormData),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
  stats: {
    method: 'POST',
    path: '/core/stats' satisfies (typeof paths)[number],
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
  purge: {
    method: 'POST',
    path: '/operations/purge' satisfies (typeof paths)[number],
    body: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
        remote: z.string().describe('a path within that remote e.g. "dir"'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
  mkdir: {
    method: 'POST',
    path: '/operations/mkdir' satisfies (typeof paths)[number],
    body: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
        remote: z.string().describe('a path within that remote e.g. "dir"'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
  rmdir: {
    method: 'POST',
    path: '/operations/rmdir' satisfies (typeof paths)[number],
    body: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
        remote: z.string().describe('a path within that remote e.g. "dir"'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },

  jobList: {
    method: 'POST',
    path: '/job/list' satisfies (typeof paths)[number],
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
    path: '/job/status' satisfies (typeof paths)[number],
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
    path: '/job/stop' satisfies (typeof paths)[number],
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
    path: '/job/stopgroup' satisfies (typeof paths)[number],
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
} satisfies Parameters<typeof c.router>[0];

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
);

export const rcloneContract = c.router(spec);

// Define a type for route objects with responses
interface RouteWithResponses {
  responses: Record<number | string, unknown>;
}

// Define a type that transforms the 200 response to a jobid response
type AsyncContract<T> = {
  [K in keyof T]: T[K] extends RouteWithResponses
    ? Omit<T[K], 'responses'> & {
        responses: {
          200: z.ZodObject<{ jobid: z.ZodNumber }>;
        } & Omit<T[K]['responses'], 200>;
      }
    : T[K];
};

// Create the async contract and apply the type transformation
export const rcloneAsyncContract = c.router(asyncSpec) as AsyncContract<typeof rcloneContract>;
