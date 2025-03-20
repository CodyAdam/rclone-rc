import { z } from 'zod';
import { Paths, Router, errorSchema, globalOptionsSchema } from './shared';

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
            showOrigIDs: z.boolean().optional().describe('If set show the IDs for each item if known'),
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
      200: z.object({
        list: z.array(
          z.object({
            Path: z.string().optional().describe('Full path of the item'),
            Name: z.string().optional().describe('Name of the item'),
            Size: z.number().optional().describe('Size of the item in bytes'),
            MimeType: z.string().optional().describe('MIME type of the item'),
            ModTime: z.string().optional().describe('Modification time of the item'),
            IsDir: z.boolean().optional().describe('Whether the item is a directory'),
            Hashes: z.record(z.string()).optional().describe('Hashes of the item (SHA-1, MD5, DropboxHash, etc.)'),
            ID: z.string().optional().describe('ID of the item'),
            OrigID: z.string().optional().describe('Original ID of the item'),
            IsBucket: z.boolean().optional().describe('Whether the item is a bucket'),
            Tier: z.string().optional().describe('Storage tier of the item (e.g., "hot")'),
            Encrypted: z.string().optional().describe('Encrypted name of the item'),
            EncryptedPath: z.string().optional().describe('Encrypted path of the item'),
            Metadata: z.record(z.unknown()).optional().describe('Additional metadata of the item'),
          }),
        ),
      }),
      500: errorSchema,
      404: errorSchema,
    },
  },
  stat: {
    method: 'POST',
    path: '/operations/stat' satisfies Paths,
    body: z
      .object({
        fs: z.string().describe('a remote name string e.g. "drive:"'),
        remote: z.string().describe('a path within that remote e.g. "dir"'),
        opt: z
          .object({
            recurse: z.boolean().optional().describe('If set recurse directories'),
            noModTime: z.boolean().optional().describe('If set return modification time'),
            showEncrypted: z.boolean().optional().describe('If set show decrypted names'),
            showOrigIDs: z.boolean().optional().describe('If set show the IDs for each item if known'),
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
      200: z.object({
        Path: z.string().optional().describe('Full path of the item'),
        Name: z.string().optional().describe('Name of the item'),
        Size: z.number().optional().describe('Size of the item in bytes'),
        MimeType: z.string().optional().describe('MIME type of the item'),
        ModTime: z.string().optional().describe('Modification time of the item'),
        IsDir: z.boolean().optional().describe('Whether the item is a directory'),
        Hashes: z.record(z.string()).optional().describe('Hashes of the item (SHA-1, MD5, DropboxHash, etc.)'),
        ID: z.string().optional().describe('ID of the item'),
        OrigID: z.string().optional().describe('Original ID of the item'),
        IsBucket: z.boolean().optional().describe('Whether the item is a bucket'),
        Tier: z.string().optional().describe('Storage tier of the item (e.g., "hot")'),
        Encrypted: z.string().optional().describe('Encrypted name of the item'),
        EncryptedPath: z.string().optional().describe('Encrypted path of the item'),
        Metadata: z.record(z.unknown()).optional().describe('Additional metadata of the item'),
      }),
      500: errorSchema,
      404: errorSchema,
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
  check: {
    method: 'POST',
    path: '/operations/check' satisfies Paths,
    body: z
      .object({
        srcFs: z.string().describe('a remote name string e.g. "drive:" for the source, "/" for local filesystem'),
        dstFs: z.string().describe('a remote name string e.g. "drive2:" for the destination, "/" for local filesystem'),
        download: z.boolean().optional().describe('check by downloading rather than with hash'),
        checkFileHash: z
          .string()
          .optional()
          .describe('treat checkFileFs:checkFileRemote as a SUM file with hashes of given type'),
        checkFileFs: z
          .string()
          .optional()
          .describe('treat checkFileFs:checkFileRemote as a SUM file with hashes of given type'),
        checkFileRemote: z
          .string()
          .optional()
          .describe('treat checkFileFs:checkFileRemote as a SUM file with hashes of given type'),
        oneWay: z.boolean().optional().describe('check one way only, source files must exist on remote'),
        combined: z.boolean().optional().describe('make a combined report of changes (default false)'),
        missingOnSrc: z.boolean().optional().describe('report all files missing from the source (default true)'),
        missingOnDst: z.boolean().optional().describe('report all files missing from the destination (default true)'),
        match: z.boolean().optional().describe('report all matching files (default false)'),
        differ: z.boolean().optional().describe('report all non-matching files (default true)'),
        error: z.boolean().optional().describe('report all files with errors (hashing or reading) (default true)'),
      })
      .extend(globalOptionsSchema.shape),
    responses: {
      200: z.object({
        success: z.boolean().describe('true if no error, false otherwise'),
        status: z.string().describe('textual summary of check, OK or text string'),
        hashType: z.string().optional().describe('hash used in check, may be missing'),
        combined: z.array(z.string()).optional().describe('array of strings of combined report of changes'),
        missingOnSrc: z.array(z.string()).optional().describe('array of strings of all files missing from the source'),
        missingOnDst: z
          .array(z.string())
          .optional()
          .describe('array of strings of all files missing from the destination'),
        match: z.array(z.string()).optional().describe('array of strings of all matching files'),
        differ: z.array(z.string()).optional().describe('array of strings of all non-matching files'),
        error: z
          .array(z.string())
          .optional()
          .describe('array of strings of all files with errors (hashing or reading)'),
      }),
      500: errorSchema,
    },
  },
} satisfies Router;
