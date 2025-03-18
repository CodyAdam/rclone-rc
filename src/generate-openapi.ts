import { generateOpenApi } from '@ts-rest/open-api';
import { writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { rcloneAsyncContract, rcloneContract } from './index';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate OpenAPI spec for regular contract
const openApiDocument = generateOpenApi(rcloneContract, {
  info: {
    title: 'Rclone RC API',
    version: '0.1.0',
    description:
      "A fully type-safe TypeScript API client for Rclone's Remote Control (RC) interface",
    contact: {
      name: 'GitHub Repository',
      url: 'https://github.com/CodyAdam/rclone-rc',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
});

// Generate OpenAPI spec for async contract
const asyncOpenApiDocument = generateOpenApi(rcloneAsyncContract, {
  info: {
    title: 'Rclone RC Async API',
    version: '0.1.0',
    description:
      "A fully type-safe TypeScript API client for Rclone's Remote Control (RC) interface with async support",
    contact: {
      name: 'GitHub Repository',
      url: 'https://github.com/CodyAdam/rclone-rc',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
});

// Save regular contract to file
const outputPath = resolve(__dirname, '../openapi.json');
await writeFile(outputPath, JSON.stringify(openApiDocument, null, 2));
console.log(`OpenAPI specification saved to ${outputPath}`);

// Save async contract to file
const asyncOutputPath = resolve(__dirname, '../async.openapi.json');
await writeFile(asyncOutputPath, JSON.stringify(asyncOpenApiDocument, null, 2));
console.log(`Async OpenAPI specification saved to ${asyncOutputPath}`);
