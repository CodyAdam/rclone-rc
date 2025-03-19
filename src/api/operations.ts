import { z } from 'zod';
import { Paths, Router, errorSchema, globalOptionsSchema, itemSchema } from './shared';

export const operationsEndpoints = {
  list: {
    method: 'POST',
    path: '/operations/list' satisfies Paths,
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
    path: '/operations/about' satisfies Paths,
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
    path: '/operations/uploadfile' satisfies Paths,
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
  purge: {
    method: 'POST',
    path: '/operations/purge' satisfies Paths,
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
    path: '/operations/mkdir' satisfies Paths,
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
    path: '/operations/rmdir' satisfies Paths,
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
  sync: {
    method: 'POST',
    path: '/sync/sync' satisfies Paths,
    body: z
      .object({
        srcFs: z.string().describe('a remote name string e.g. "drive:src" for the source'),
        dstFs: z.string().describe('a remote name string e.g. "drive:dst" for the destination'),
        createEmptySrcDirs: z
          .boolean()
          .optional()
          .describe('create empty src directories on destination if set'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({}),
      500: errorSchema,
    },
  },
} satisfies Router;
