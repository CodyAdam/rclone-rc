import { z } from 'zod';

export const fsConnectionSchema = z
  .object({
    type: z.string().optional().describe('Remote type (e.g., "local", "sftp")'),
    name: z.string().optional().describe('Name of the remote'),
    config: z.record(z.unknown()).optional().describe('Additional configuration parameters for the remote'),
    root: z
      .string()
      .optional()
      .describe('Root path of the remote, defaults to the root of the remote if not specified'),
  })
  .refine(data => (data.type && !data.name) || (!data.type && data.name), {
    message: "Either 'type' or 'name' must be provided, but not both",
    path: ['type', 'name'],
  });

export type FsConnection = z.infer<typeof fsConnectionSchema>;

/**
 * Converts an fsConnection object to a rclone connection string.
 *
 * Connection strings have the following syntax:
 * - For on-the-fly backends: `:backend,parameter=value,parameter2=value2:path/to/dir`
 * - For named remotes: `remote,parameter=value,parameter2=value2:path/to/dir`
 *
 * Special characters in values are handled as follows:
 * - Values containing spaces, commas, or colons are enclosed in quotes (single or double)
 * - If a quoted value needs to include the same quote character, it should be doubled
 * - Parameters without values are treated as boolean flags with value=true
 *
 * @param remote The filesystem connection object to stringify
 * @returns A properly formatted rclone connection string
 */
export function createConnectionString(remote: FsConnection) {
  // Start with either the named remote or on-the-fly backend
  let url = remote.name ? `${remote.name}` : `:${remote.type}`;
  let path = remote.root || '';

  // Ensure path doesn't have leading/trailing slashes for proper formatting
  path = path.replace(/^\/+|\/+$/g, '');

  // Add config parameters if present
  if (remote.config && Object.keys(remote.config).length > 0) {
    const configParams = Object.entries(remote.config)
      .map(([key, value]) => {
        // Handle boolean values (true becomes just the parameter name)
        if (value === true) {
          return key;
        }

        if (value === false) {
          return `${key}=false`;
        }

        // Convert value to string for processing
        const stringValue = String(value);

        // Determine if we need quotes and which type to use
        // We'll prefer single quotes by default, but use double quotes if the value contains single quotes
        const needsQuotes = stringValue.includes(' ') || stringValue.includes(',') || stringValue.includes(':');

        if (needsQuotes) {
          // If the value contains single quotes, use double quotes
          if (stringValue.includes("'")) {
            // Escape double quotes by doubling them
            const escapedValue = stringValue.replace(/"/g, '""');
            return `${key}="${escapedValue}"`;
          } else {
            // Use single quotes for values with spaces, commas, or colons
            const escapedValue = stringValue.replace(/'/g, "''");
            return `${key}='${escapedValue}'`;
          }
        }

        return `${key}=${value}`;
      })
      .join(',');

    if (configParams) {
      url += `,${configParams}`;
    }
  }

  // Add the root path
  return `${url}:${path}`;
}
