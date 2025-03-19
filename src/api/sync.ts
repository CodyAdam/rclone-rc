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
  copy: {
    method: 'POST',
    path: '/sync/copy' satisfies Paths,
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
  move: {
    method: 'POST',
    path: '/sync/move' satisfies Paths,
    body: z
      .object({
        srcFs: z.string().describe('a remote name string e.g. "drive:src" for the source'),
        dstFs: z.string().describe('a remote name string e.g. "drive:dst" for the destination'),
        createEmptySrcDirs: z.boolean().optional().describe('create empty src directories on destination if set'),
        deleteEmptySrcDirs: z.boolean().optional().describe('delete empty src directories if set'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
  bisync: {
    method: 'POST',
    path: '/sync/bisync' satisfies Paths,
    body: z
      .object({
        path1: z.string().describe('a remote directory string e.g. drive:path1'),
        path2: z.string().describe('a remote directory string e.g. drive:path2'),
        dryRun: z.boolean().optional().describe('dry-run mode'),
        resync: z.boolean().optional().describe('performs the resync run'),
        checkAccess: z.boolean().optional().describe('abort if RCLONE_TEST files are not found on both filesystems'),
        checkFilename: z.string().optional().describe('file name for checkAccess (default: RCLONE_TEST)'),
        maxDelete: z
          .number()
          .optional()
          .describe('abort sync if percentage of deleted files is above this threshold (default: 50)'),
        force: z.boolean().optional().describe('Bypass maxDelete safety check and run the sync'),
        checkSync: z
          .boolean()
          .optional()
          .describe(
            'true by default, false disables comparison of final listings, only will skip sync, only compare listings from the last run',
          ),
        createEmptySrcDirs: z
          .boolean()
          .optional()
          .describe('Sync creation and deletion of empty directories. (Not compatible with --remove-empty-dirs)'),
        removeEmptyDirs: z.boolean().optional().describe('remove empty directories at the final cleanup step'),
        filtersFile: z.string().optional().describe('read filtering patterns from a file'),
        ignoreListingChecksum: z.boolean().optional().describe('Do not use checksums for listings'),
        resilient: z
          .boolean()
          .optional()
          .describe(
            'Allow future runs to retry after certain less-serious errors, instead of requiring resync. Use at your own risk!',
          ),
        workdir: z.string().optional().describe('server directory for history files (default: ~/.cache/rclone/bisync)'),
        backupdir1: z
          .string()
          .optional()
          .describe('--backup-dir for Path1. Must be a non-overlapping path on the same remote.'),
        backupdir2: z
          .string()
          .optional()
          .describe('--backup-dir for Path2. Must be a non-overlapping path on the same remote.'),
        noCleanup: z.boolean().optional().describe('retain working files'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
} satisfies Router;
