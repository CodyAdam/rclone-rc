

# Current completed endpoints

Percentage complete: **25.29%** (22/87)

*🔒: Requires authentication*

| Endpoint | Done | Alias | Description |
|----------|------|-------|-------------|
| [:fs]/:remote | ✅ | `api.download()` | 🔒 Download a file from a remote filesystem (Requires `--rc-serve` or `--rc-web-gui`) |
| backend/command | ❌ |  | 🔒 Runs a backend command. |
| config/create | ❌ |  | 🔒 create the config for a remote. |
| config/delete | ❌ |  | 🔒 Delete a remote in the config file. |
| config/dump | ❌ |  | 🔒 Dumps the config file. |
| config/get | ❌ |  | 🔒 Get a remote in the config file. |
| config/listremotes | ❌ |  | 🔒 Lists the remotes in the config file and defined in environment variables. |
| config/password | ❌ |  | 🔒 password the config for a remote. |
| config/paths | ❌ |  | 🔒 Reads the config file path and other important paths. |
| config/providers | ❌ |  | 🔒 Shows how providers are configured in the config file. |
| config/setpath | ❌ |  | 🔒 Set the path of the config file |
| config/update | ❌ |  | 🔒 update the config for a remote. |
| core/bwlimit | ❌ |  | Set the bandwidth limit. |
| core/command | ❌ |  | 🔒 Run a rclone terminal command over rc. |
| core/du | ❌ |  | Returns disk usage of a locally attached disk. |
| core/gc | ❌ |  | Runs a garbage collection. |
| core/group-list | ❌ |  | Returns list of stats. |
| core/memstats | ❌ |  | Returns the memory statistics |
| core/obscure | ❌ |  | Obscures a string passed in. |
| core/pid | ❌ |  | Return PID of current process |
| core/quit | ❌ |  | Terminates the app. |
| core/stats | ✅ | `api.stats()` | Returns stats about current transfers. |
| core/stats-delete | ❌ |  | Delete stats group. |
| core/stats-reset | ❌ |  | Reset stats. |
| core/transferred | ❌ |  | Returns stats about completed transfers. |
| core/version | ✅ | `api.version()` | Shows the current version of rclone and the go runtime. |
| debug/set-block-profile-rate | ❌ |  | Set runtime.SetBlockProfileRate for blocking profiling. |
| debug/set-gc-percent | ❌ |  | Call runtime/debug.SetGCPercent for setting the garbage collection target percentage. |
| debug/set-mutex-profile-fraction | ❌ |  | Set runtime.SetMutexProfileFraction for mutex profiling. |
| debug/set-soft-memory-limit | ❌ |  | Call runtime/debug.SetMemoryLimit for setting a soft memory limit for the runtime. |
| fscache/clear | ❌ |  | 🔒 Clear the Fs cache. |
| fscache/entries | ❌ |  | 🔒 Returns the number of entries in the fs cache. |
| job/list | ✅ | `api.jobList()` | Lists the IDs of the running jobs |
| job/status | ✅ | `api.jobStatus()` | Reads the status of the job ID |
| job/stop | ✅ | `api.jobStop()` | Stop the running job |
| job/stopgroup | ✅ | `api.jobStopGroup()` | Stop all running jobs in a group |
| mount/listmounts | ❌ |  | 🔒 Show current mount points |
| mount/mount | ❌ |  | 🔒 Create a new mount point |
| mount/types | ❌ |  | 🔒 Show all possible mount types |
| mount/unmount | ❌ |  | 🔒 Unmount selected active mount |
| mount/unmountall | ❌ |  | 🔒 Unmount all active mounts |
| operations/about | ✅ | `api.about()` | 🔒 Return the space used on the remote |
| operations/check | ✅ | `api.check()` | 🔒 check the source and destination are the same |
| operations/cleanup | ❌ |  | 🔒 Remove trashed files in the remote or path |
| operations/copyfile | ❌ |  | 🔒 Copy a file from source remote to destination remote |
| operations/copyurl | ❌ |  | 🔒 Copy the URL to the object |
| operations/delete | ❌ |  | 🔒 Remove files in the path |
| operations/deletefile | ❌ |  | 🔒 Remove the single file pointed to |
| operations/fsinfo | ❌ |  | Return information about the remote |
| operations/hashsum | ❌ |  | 🔒 Produces a hashsum file for all the objects in the path. |
| operations/list | ✅ | `api.list()` | 🔒 List the given remote and path in JSON format |
| operations/mkdir | ✅ | `api.mkdir()` | 🔒 Make a destination directory or container |
| operations/movefile | ❌ |  | 🔒 Move a file from source remote to destination remote |
| operations/publiclink | ❌ |  | 🔒 Create or retrieve a public link to the given file or folder. |
| operations/purge | ✅ | `api.purge()` | 🔒 Remove a directory or container and all of its contents |
| operations/rmdir | ✅ | `api.rmdir()` | 🔒 Remove an empty directory or container |
| operations/rmdirs | ❌ |  | 🔒 Remove all the empty directories in the path |
| operations/settier | ❌ |  | 🔒 Changes storage tier or class on all files in the path |
| operations/settierfile | ❌ |  | 🔒 Changes storage tier or class on the single file pointed to |
| operations/size | ❌ |  | 🔒 Count the number of bytes and files in remote |
| operations/stat | ✅ | `api.stat()` | 🔒 Give information about the supplied file or directory |
| operations/uploadfile | ✅ | `api.uploadFile()` | 🔒 Upload file using multiform/form-data |
| options/blocks | ❌ |  | List all the option blocks |
| options/get | ❌ |  | Get all the global options |
| options/info | ❌ |  | Get info about all the global options |
| options/local | ✅ | `api.optionsLocal()` | Get the currently active config for this call |
| options/set | ❌ |  | Set an option |
| pluginsctl/addPlugin | ❌ |  | 🔒 Add a plugin using url |
| pluginsctl/getPluginsForType | ❌ |  | 🔒 Get plugins with type criteria |
| pluginsctl/listPlugins | ❌ |  | 🔒 Get the list of currently loaded plugins |
| pluginsctl/listTestPlugins | ❌ |  | 🔒 Show currently loaded test plugins |
| pluginsctl/removePlugin | ❌ |  | 🔒 Remove a loaded plugin |
| pluginsctl/removeTestPlugin | ❌ |  | 🔒 Remove  a test plugin |
| rc/error | ❌ |  | This returns an error |
| rc/list | ❌ |  | List all the registered remote control commands |
| rc/noop | ✅ | `api.noop()` | Echo the input to the output parameters |
| rc/noopauth | ✅ | `api.noopAuth()` | 🔒 Echo the input to the output parameters requiring auth |
| sync/bisync | ✅ | `api.bisync()` | 🔒 Perform bidirectional synchronization between two paths. |
| sync/copy | ✅ | `api.copy()` | 🔒 copy a directory from source remote to destination remote |
| sync/move | ✅ | `api.move()` | 🔒 move a directory from source remote to destination remote |
| sync/sync | ✅ | `api.sync()` | 🔒 sync a directory from source remote to destination remote |
| vfs/forget | ❌ |  | Forget files or directories in the directory cache. |
| vfs/list | ❌ |  | List active VFSes. |
| vfs/poll-interval | ❌ |  | Get the status or update the value of the poll-interval option. |
| vfs/queue | ❌ |  | Queue info for a VFS. |
| vfs/queue-set-expiry | ❌ |  | Set the expiry time for an item queued for upload. |
| vfs/refresh | ❌ |  | Refresh the directory cache. |
| vfs/stats | ❌ |  | Stats for a VFS. |
