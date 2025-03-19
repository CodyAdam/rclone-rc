# rclone-rc

A fully type-safe TypeScript API client for [Rclone's Remote Control](https://rclone.org/rc/) (RC) interface, powered by [@ts-rest](https://github.com/ts-rest/ts-rest) and [Zod](https://github.com/colinhacks/zod).

## ⚠️ Work in Progress

This library is currently under active development. Check out the [current status](current-status.md) for a list of implemented commands.

Consider contributing if you need a specific command:

1. Check `src/api/index.ts` for current implementation
2. Add your needed command following the same pattern
3. Open a Pull Request

## ✨ Features

- **🔒 Fully Type-Safe**: End-to-end type safety for all API calls, including async operations
- **📄 OpenAPI Support**: Generated spec for integration with any language/client
- **🧩 Framework Agnostic**: Works with any fetch client
- **🚀 Async Operations**: First-class support for Rclone's async operations
- **✅ Runtime Validation**: Uses Zod to validate types at runtime
- **💪 HTTP Status Handling**: Error responses handled through typed status codes

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

### Basic Client

```typescript
import { createClient } from 'rclone-rc';

const client = createClient({
  baseUrl: 'http://localhost:5572',
  username: 'your-username', // Optional if running with --rc-no-auth
  password: 'your-password', // Optional if running with --rc-no-auth
});

try {
  // Get rclone version with typed response
  const { status, body } = await client.version();

  if (status === 200) {
    console.log('Rclone version:', body.version); // typed
  } else if (status === 500) {
    console.log('Error:', body.error); // also typed
  }

  // List files with type-safe parameters and response
  const files = await client.list({
    body: { fs: 'remote:path', remote: '' }
  });

  if (files.status === 200) {
    console.log('Files:', files.body.list);
  }
} catch (error) {
  // Only network errors will throw exceptions
  console.error('Network error:', error);
}
```

### Error Handling

This library handles errors in two ways:

1. **HTTP Status Errors**: Returned as typed responses with appropriate status codes
2. **Network Errors**: Thrown as exceptions when server is unreachable

### Async Operations

For long-running operations:

```typescript
import { createAsyncClient } from 'rclone-rc';

const asyncClient = createAsyncClient({ baseUrl: 'http://localhost:5572' });

try {
  // Start async job
  const job = await asyncClient.list({
    body: {
      fs: 'remote:path',
      remote: '',
      _async: true, // Type-safe flag for async operations
    }
  });

  // Access job ID and check status
  const jobId = job.body.jobid;
  const status = await client.jobStatus({ body: { jobid: jobId } });

  if (status.status === 200 && status.body.finished) {
    console.log('Job output:', status.body.output);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Runtime Type Validation

Zod validates both request and response types at runtime:

- **Request validation**: Parameters, body, and query are validated before sending
- **Response validation**: Can be disabled with `validateResponse: false` in client options
  ```typescript
  const client = createClient({
    baseUrl: 'http://localhost:5572',
    validateResponse: false, // true by default
  });
  ```

## OpenAPI Integration

Generate an OpenAPI specification for use with other languages and tools:

```typescript
import { generateOpenApi } from '@ts-rest/open-api';
import { rcloneContract } from 'rclone-rc';

const openApiDocument = generateOpenApi(rcloneContract, {
  info: { title: 'Rclone RC API', version: '1.0.0' }
});
```

Access the raw OpenAPI specifications at:
- https://raw.githubusercontent.com/CodyAdam/rclone-rc/main/openapi.json
- https://raw.githubusercontent.com/CodyAdam/rclone-rc/main/async.openapi.json

## Development

```bash
pnpm install     # Install dependencies
pnpm build       # Build the project
pnpm test        # Run tests
pnpm lint        # Lint code
pnpm format      # Format code
pnpm openapi     # Generate OpenAPI spec
```

## Requirements

- Node.js 18+
- TypeScript 5.0+

## License

MIT
