import { makeApi } from '@zodios/core';
import { z } from 'zod';

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
  '/job/list',
  '/job/status',
  '/job/stop',
  '/job/stopgroup',
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
  '/rc/noop',
  '/rc/noopauth',
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

const errors = [
  {
    status: 'default',
    schema: errorSchema,
    description: 'Error response from the server',
  } as const,
];

// Basic schemas for RC API responses
const versionInfoSchema = z.object({
  version: z.string().describe("rclone version, e.g. 'v1.53.0'"),
  os: z.string().describe('OS in use as according to Go'),
  arch: z.string().describe('cpu architecture in use according to Go'),
  decomposed: z.array(z.number()).describe('version number as [major, minor, patch]'),
  isGit: z.boolean().describe('true if this was compiled from the git version'),
  isBeta: z.boolean().describe('true if this is a beta version'),
  goVersion: z.string().describe('version of Go runtime in use'),
  linking: z.string().describe('type of rclone executable (static or dynamic)'),
  goTags: z.string().describe("space separated build tags or 'none'"),
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

export const rcloneApi = makeApi([
  {
    method: 'post',
    path: '/core/version' satisfies (typeof paths)[number],
    alias: 'version',
    description: 'Get rclone version information',
    response: versionInfoSchema,
    errors,
  },
  {
    method: 'post',
    path: '/operations/list' satisfies (typeof paths)[number],
    alias: 'list',
    description: 'List the given remote and path in JSON format',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({
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
        }),
      },
    ],
    response: z.object({
      list: z.array(itemSchema).describe('Array of objects in the path in JSON format'),
    }),
    errors,
  },
  {
    method: 'post',
    path: '/operations/about' satisfies (typeof paths)[number],
    alias: 'about',
    description: 'Return the space used on the remote',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({
          fs: z.string().describe('a remote name string e.g. "drive:"'),
        }),
      },
    ],
    response: z.object({
      total: z.number().describe('Total size of the remote in bytes'),
      used: z.number().describe('Used space on the remote in bytes'),
      free: z.number().describe('Free space on the remote in bytes'),
      trashed: z.number().optional().describe('Space used by trash on the remote in bytes'),
      other: z.number().optional().describe('Other space on the remote in bytes'),
      objects: z.number().optional().describe('Total number of objects on the remote'),
    }),
    errors,
  },
  {
    method: 'post',
    path: '/operations/uploadfile' satisfies (typeof paths)[number],
    alias: 'uploadFile',
    requestFormat: 'binary',
    description: 'Upload file using multipart/form-data',
    parameters: [
      {
        name: 'fs',
        type: 'Query',
        schema: z.string().describe('a remote name string e.g. "drive:"'),
      },
      {
        name: 'remote',
        type: 'Query',
        schema: z.string().describe('a path within that remote e.g. "dir"'),
      },
      {
        name: 'file',
        type: 'Body',
        schema: z.instanceof(FormData).describe('FormData containing the file to upload'),
      },
    ],
    response: z.object({
      // The server returns an empty object on success
    }),
    errors,
  },

  {
    method: 'post',
    path: '/core/stats' satisfies (typeof paths)[number],
    alias: 'stats',
    description: 'Get stats about the current transfer',
    response: z.object({
      bytes: z.number().describe('Total number of bytes transferred'),
      checks: z.number().describe('Number of checks'),
      deletedDirs: z.number().describe('Number of deleted directories'),
      deletes: z.number().describe('Number of deletions'),
      elapsedTime: z.number().describe('Time in seconds the operation has been running for'),
      errors: z.number().describe('Number of errors'),
      eta: z.number().nullable().describe('Estimated time in seconds until completion'),
      fatalError: z.boolean().describe('Whether there has been a fatal error'),
      lastError: z.string().optional().describe('Last error (string)'),
      retryError: z.boolean().describe('Whether the last error was retryable'),
      renames: z.number().describe('Number of renames'),
      serverSideCopies: z.number().describe('Number of server-side copies'),
      serverSideCopyBytes: z.number().describe('Number of bytes server-side copied'),
      serverSideMoveBytes: z.number().describe('Number of bytes server-side moved'),
      serverSideMoves: z.number().describe('Number of server-side moves'),
      speed: z.number().describe('Average speed in bytes per second'),
      totalBytes: z.number().describe('Total size of the transfer in bytes'),
      totalChecks: z.number().describe('Total number of checks'),
      totalTransfers: z.number().describe('Total number of transfers'),
      transferTime: z.number().describe('Total time spent on transfers in seconds'),
      transfers: z.number().describe('Number of transferred files'),
    }),
    errors,
  },
  {
    method: 'post',
    path: '/operations/purge' satisfies (typeof paths)[number],
    alias: 'purge',
    description: 'Remove a directory or container and all of its contents',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({
          fs: z.string().describe('a remote name string e.g. "drive:"'),
          remote: z.string().describe('a path within that remote e.g. "dir"'),
        }),
      },
    ],
    response: z.object({
      // The server returns an empty object on success
    }),
    errors,
  },
  {
    method: 'post',
    path: '/operations/mkdir' satisfies (typeof paths)[number],
    alias: 'mkdir',
    description: 'Make a destination directory or container',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({
          fs: z.string().describe('a remote name string e.g. "drive:"'),
          remote: z.string().describe('a path within that remote e.g. "dir"'),
        }),
      },
    ],
    response: z.object({
      // The server returns an empty object on success
    }),
    errors,
  },
  {
    method: 'post',
    path: '/operations/rmdir' satisfies (typeof paths)[number],
    alias: 'rmdir',
    description: 'Remove an empty directory or container',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({
          fs: z.string().describe('a remote name string e.g. "drive:"'),
          remote: z.string().describe('a path within that remote e.g. "dir"'),
        }),
      },
    ],
    response: z.object({
      // The server returns an empty object on success
    }),
    errors,
  },
] as const);
