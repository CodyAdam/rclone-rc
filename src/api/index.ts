import { makeApi } from '@zodios/core';
import { z } from 'zod';

// Basic schemas for RC API responses
const VersionInfoSchema = z.object({
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

export const rcloneApi = makeApi([
  {
    method: 'post',
    path: '/core/version',
    alias: 'version',
    description: 'Get rclone version information',
    response: VersionInfoSchema,
  },
]);
