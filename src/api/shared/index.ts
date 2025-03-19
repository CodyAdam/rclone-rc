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

export const globalOptionsSchema = z.object({
  _async: z
    .boolean()
    .optional()
    .describe('If set run asynchronously, which means the command will return a job id and then return'),
  _config: z
    .object({
      AskPassword: z.boolean().optional(),
      AutoConfirm: z.boolean().optional(),
      BackupDir: z.string().optional(),
      BindAddr: z.string().optional(),
      BufferSize: z.number().optional(),
      BwLimit: z.string().optional(),
      BwLimitFile: z.string().optional(),
      CaCert: z.array(z.string()).optional(),
      CheckFirst: z.boolean().optional(),
      CheckSum: z.boolean().optional(),
      Checkers: z.number().optional(),
      ClientCert: z.string().optional(),
      ClientKey: z.string().optional(),
      CompareDest: z.array(z.string()).optional(),
      ConnectTimeout: z.number().optional(),
      Cookie: z.boolean().optional(),
      CopyDest: z.array(z.string()).optional(),
      CutoffMode: z.string().optional(),
      DataRateUnit: z.string().optional(),
      DefaultTime: z.string().optional(),
      DeleteMode: z.number().optional(),
      DisableFeatures: z.null().optional(),
      DisableHTTP2: z.boolean().optional(),
      DisableHTTPKeepAlives: z.boolean().optional(),
      DownloadHeaders: z.null().optional(),
      DryRun: z.boolean().optional(),
      Dump: z.string().optional(),
      ErrorOnNoTransfer: z.boolean().optional(),
      ExpectContinueTimeout: z.number().optional(),
      FixCase: z.boolean().optional(),
      FsCacheExpireDuration: z.number().optional(),
      FsCacheExpireInterval: z.number().optional(),
      Headers: z.null().optional(),
      HumanReadable: z.boolean().optional(),
      IgnoreCaseSync: z.boolean().optional(),
      IgnoreChecksum: z.boolean().optional(),
      IgnoreErrors: z.boolean().optional(),
      IgnoreExisting: z.boolean().optional(),
      IgnoreSize: z.boolean().optional(),
      IgnoreTimes: z.boolean().optional(),
      Immutable: z.boolean().optional(),
      Inplace: z.boolean().optional(),
      InsecureSkipVerify: z.boolean().optional(),
      Interactive: z.boolean().optional(),
      KvLockTime: z.number().optional(),
      Links: z.boolean().optional(),
      LogLevel: z.string().optional(),
      LowLevelRetries: z.number().optional(),
      MaxBacklog: z.number().optional(),
      MaxBufferMemory: z.number().optional(),
      MaxDelete: z.number().optional(),
      MaxDeleteSize: z.number().optional(),
      MaxDepth: z.number().optional(),
      MaxDuration: z.number().optional(),
      MaxStatsGroups: z.number().optional(),
      MaxTransfer: z.number().optional(),
      Metadata: z.boolean().optional(),
      MetadataMapper: z.null().optional(),
      MetadataSet: z.null().optional(),
      ModifyWindow: z.number().optional(),
      MultiThreadChunkSize: z.number().optional(),
      MultiThreadCutoff: z.number().optional(),
      MultiThreadSet: z.boolean().optional(),
      MultiThreadStreams: z.number().optional(),
      MultiThreadWriteBufferSize: z.number().optional(),
      NoCheckDest: z.boolean().optional(),
      NoConsole: z.boolean().optional(),
      NoGzip: z.boolean().optional(),
      NoTraverse: z.boolean().optional(),
      NoUnicodeNormalization: z.boolean().optional(),
      NoUpdateDirModTime: z.boolean().optional(),
      NoUpdateModTime: z.boolean().optional(),
      OrderBy: z.string().optional(),
      PartialSuffix: z.string().optional(),
      PasswordCommand: z.null().optional(),
      Progress: z.boolean().optional(),
      ProgressTerminalTitle: z.boolean().optional(),
      RefreshTimes: z.boolean().optional(),
      Retries: z.number().optional(),
      RetriesInterval: z.number().optional(),
      ServerSideAcrossConfigs: z.boolean().optional(),
      SizeOnly: z.boolean().optional(),
      StatsFileNameLength: z.number().optional(),
      StatsLogLevel: z.string().optional(),
      StatsOneLine: z.boolean().optional(),
      StatsOneLineDate: z.boolean().optional(),
      StatsOneLineDateFormat: z.string().optional(),
      StreamingUploadCutoff: z.number().optional(),
      Suffix: z.string().optional(),
      SuffixKeepExtension: z.boolean().optional(),
      TPSLimit: z.number().optional(),
      TPSLimitBurst: z.number().optional(),
      TerminalColorMode: z.string().optional(),
      Timeout: z.number().optional(),
      TrackRenames: z.boolean().optional(),
      TrackRenamesStrategy: z.string().optional(),
      TrafficClass: z.number().optional(),
      Transfers: z.number().optional(),
      UpdateOlder: z.boolean().optional(),
      UploadHeaders: z.null().optional(),
      UseJSONLog: z.boolean().optional(),
      UseListR: z.boolean().optional(),
      UseMmap: z.boolean().optional(),
      UseServerModTime: z.boolean().optional(),
      UserAgent: z.string().optional(),
    })
    .partial()
    .or(z.record(z.unknown()))
    .optional()
    .describe('A dictionary of config parameters to control the command execution'),
  _filter: z
    .object({
      DeleteExcluded: z.boolean().optional().describe('Delete files that are excluded from the sync'),
      ExcludeFile: z.array(z.string()).optional().describe('Read exclude patterns from file'),
      ExcludeFrom: z.array(z.string()).optional().describe('Read exclude patterns from file'),
      ExcludeRule: z.array(z.string()).optional().describe('Exclude files matching pattern'),
      FilesFrom: z.array(z.string()).optional().describe('Read list of source-file names from file'),
      FilesFromRaw: z
        .array(z.string())
        .optional()
        .describe('Read list of source-file names from file without any processing of lines'),
      FilterFrom: z.array(z.string()).optional().describe('Read filtering patterns from a file'),
      FilterRule: z.array(z.string()).optional().describe('Add a file-filtering rule'),
      HashFilter: z.string().optional().describe('Filter by hash type and value'),
      IgnoreCase: z.boolean().optional().describe('Ignore case when pattern matching'),
      IncludeFrom: z.array(z.string()).optional().describe('Read include patterns from file'),
      IncludeRule: z.array(z.string()).optional().describe('Include files matching pattern'),
      MaxAge: z.number().optional().describe('Only transfer files younger than this in seconds'),
      MaxSize: z.number().optional().describe('Only transfer files smaller than this in bytes'),
      MetadataExclude: z.array(z.string()).optional().describe('Exclude metadatas matching pattern'),
      MetadataExcludeFrom: z
        .array(z.string())
        .optional()
        .describe('Read metadata exclude patterns from file (use - to read from stdin)'),
      MetadataFilter: z.array(z.string()).optional().describe('Add a metadata filtering rule'),
      MetadataFilterFrom: z
        .array(z.string())
        .optional()
        .describe('Read metadata filtering patterns from a file (use - to read from stdin)'),
      MetadataInclude: z.array(z.string()).optional().describe('Include metadatas matching pattern'),
      MetadataIncludeFrom: z
        .array(z.string())
        .optional()
        .describe('Read metadata include patterns from file (use - to read from stdin)'),
      MinAge: z.number().optional().describe('Only transfer files older than this in seconds'),
      MinSize: z.number().optional().describe('Only transfer files bigger than this in bytes'),
    })
    .optional()
    .describe('A dictionary of filter parameters to apply for this command only'),
  _group: z.string().optional().describe('Group name for this command to track stats under a custom name'),
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
