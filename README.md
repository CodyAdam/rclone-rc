# rclone-rc

A fully typed TypeScript API client for rclone's Remote Control (RC) interface.

## Features

- 🔒 Fully typed API client for rclone RC 
- 📜 TypeScript 5.4+ with strict typing
- 🔄 Built with Zodios for type-safe API calls
- 🧩 Node 22+ compatible
- 🌐 Simple and intuitive interface

## Installation

```bash
# Using npm
npm install rclone-rc

# Using yarn
yarn add rclone-rc

# Using pnpm
pnpm add rclone-rc
```

## Usage

```typescript
import { RcloneClient } from 'rclone-rc';

// Create a client
const client = new RcloneClient({
  baseUrl: 'http://localhost:5572', // Default
  username: 'your-username', // Optional
  password: 'your-password', // Optional
  timeout: 30000, // Default: 30 seconds
});

// Make API calls
async function example() {
  try {
    // Get rclone version
    const version = await client.getVersion();
    console.log('Rclone version:', version.result.version);
    
    // Get stats
    const stats = await client.getStats();
    console.log('Transfer speed:', stats.result.speed);
    
    // List remotes
    const remotes = await client.listRemotes();
    console.log('Available remotes:', Object.keys(remotes.result.remotes));
    
    // Make a custom call
    const result = await client.call('operations/list', {
      fs: 'remote:path',
      recursive: true,
    });
    console.log('Files:', result.result);
  } catch (error) {
    console.error('Error:', error);
  }
}

example();
```

## Available Methods

- `call<T>(path: string, params?: object): Promise<RcloneResponse<T>>` - Make a custom call to any RC endpoint
- `getVersion(): Promise<RcloneResponse<VersionInfo>>` - Get rclone version information
- `getStats(): Promise<RcloneResponse<StatsInfo>>` - Get current transfer statistics
- `listRemotes(): Promise<RcloneResponse<RemotesInfo>>` - List all configured remotes

## Type Definitions

The library includes full TypeScript type definitions for the rclone RC API.

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Format code
pnpm format
```

## Requirements

- Node.js 22 or higher
- TypeScript 5.4 or higher

## Dependencies

- Zodios - Type-safe API client
- Zod - TypeScript-first schema validation
- Axios - Promise based HTTP client

## License

MIT 