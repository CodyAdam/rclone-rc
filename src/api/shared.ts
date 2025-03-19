import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export type Router = Parameters<ReturnType<typeof initContract>['router']>[0];

export type Paths =
  | '/backend/command'
  | '/cache/expire'
  | '/cache/fetch'
  | '/cache/stats'
  | '/config/create'
  | '/config/delete'
  | '/config/dump'
  | '/config/get'
  | '/config/listremotes'
  | '/config/password'
  | '/config/paths'
  | '/config/providers'
  | '/config/setpath'
  | '/config/update'
  | '/core/bwlimit'
  | '/core/command'
  | '/core/du'
  | '/core/gc'
  | '/core/group-list'
  | '/core/memstats'
  | '/core/obscure'
  | '/core/pid'
  | '/core/quit'
  | '/core/stats'
  | '/core/stats-delete'
  | '/core/stats-reset'
  | '/core/transferred'
  | '/core/version'
  | '/debug/set-block-profile-rate'
  | '/debug/set-gc-percent'
  | '/debug/set-mutex-profile-fraction'
  | '/debug/set-soft-memory-limit'
  | '/fscache/clear'
  | '/fscache/entries'
  | '/job/list'
  | '/job/status'
  | '/job/stop'
  | '/job/stopgroup'
  | '/mount/listmounts'
  | '/mount/mount'
  | '/mount/types'
  | '/mount/unmount'
  | '/mount/unmountall'
  | '/operations/about'
  | '/operations/check'
  | '/operations/cleanup'
  | '/operations/copyfile'
  | '/operations/copyurl'
  | '/operations/delete'
  | '/operations/deletefile'
  | '/operations/fsinfo'
  | '/operations/hashsum'
  | '/operations/list'
  | '/operations/mkdir'
  | '/operations/movefile'
  | '/operations/publiclink'
  | '/operations/purge'
  | '/operations/rmdir'
  | '/operations/rmdirs'
  | '/operations/settier'
  | '/operations/settierfile'
  | '/operations/size'
  | '/operations/stat'
  | '/operations/uploadfile'
  | '/options/blocks'
  | '/options/get'
  | '/options/info'
  | '/options/local'
  | '/options/set'
  | '/pluginsctl/addPlugin'
  | '/pluginsctl/getPluginsForType'
  | '/pluginsctl/listPlugins'
  | '/pluginsctl/listTestPlugins'
  | '/pluginsctl/removePlugin'
  | '/pluginsctl/removeTestPlugin'
  | '/rc/error'
  | '/rc/list'
  | '/rc/noop'
  | '/rc/noopauth'
  | '/sync/bisync'
  | '/sync/copy'
  | '/sync/move'
  | '/sync/sync'
  | '/vfs/forget'
  | '/vfs/list'
  | '/vfs/poll-interval'
  | '/vfs/queue'
  | '/vfs/queue-set-expiry'
  | '/vfs/refresh'
  | '/vfs/stats';

export const errorSchema = z.object({
  error: z.string().describe('Error message'),
  input: z.record(z.unknown()).optional().describe('Input parameters that caused the error'),
  path: z.string().optional().describe('API path that was called'),
  status: z.number().optional().describe('HTTP status code'),
});

export const itemSchema = z.object({
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

export const globalOptionsSchema = z.object({
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

// Define a type for route objects with responses
export interface RouteWithResponses {
  responses: Record<number | string, unknown>;
}

// Define a type that transforms the 200 response to a jobid response
export type AsyncContract<T> = {
  [K in keyof T]: T[K] extends RouteWithResponses
    ? Omit<T[K], 'responses'> & {
        responses: {
          200: z.ZodObject<{ jobid: z.ZodNumber }>;
        } & Omit<T[K]['responses'], 200>;
      }
    : T[K];
};
