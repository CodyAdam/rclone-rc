import { ZodiosError } from '@zodios/core';
import axios, { AxiosError } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';
import { errorSchema } from '../api';
import { createClient } from '../client';

const client = createClient();

describe('Rclone Client', () => {
  it('should check if rclone is running', async () => {
    try {
      // Check if rclone is running on port 5572
      await axios.post('http://127.0.0.1:5572/core/version');
      expect(true).toBe(true); // If we get here, rclone is running
    } catch (error) {
      expect.fail(
        'Rclone is not running on port 5572. Make sure rclone is running with `rclone rcd` on port 5572 (default).',
      );
    }
  });

  // Helper function to handle errors consistently
  const handleRcloneError = (error: unknown) => {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof AxiosError) {
      const errorData = errorSchema.safeParse(error?.response?.data);
      if (errorData.success) {
        errorMessage = `${errorData.data.path} - ${errorData.data.error}\n${JSON.stringify(errorData.data.input, null, 2)}`;
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof ZodiosError) {
      errorMessage = `Validation error: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return expect.fail(errorMessage);
  };

  beforeEach(async () => {
    try {
      await client.purge({ fs: ':memory:', remote: '' });
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should get version', async () => {
    try {
      const version = await client.version(undefined);
      expect(version).toBeDefined();
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should get stats', async () => {
    try {
      const stats = await client.stats(undefined);
      expect(stats).toBeDefined();
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should get about', async () => {
    try {
      const about = await client.about({ fs: ':local:' });
      expect(about).toBeDefined();
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should list current directory', async () => {
    try {
      const list = await client.list({ fs: ':local:', remote: '' });
      expect(list).toBeDefined();
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should upload file', async () => {
    try {
      const testFileContent = 'This is a test file content';
      const testFileName = 'test.txt';
      const formData = new FormData();
      formData.append(
        'file0',
        new File([testFileContent], testFileName, {
          type: 'text/plain',
        }),
      );

      const upload = await client.uploadFile(formData, {
        queries: {
          fs: ':memory:',
          remote: '',
        },
      });
      expect(upload).toBeDefined();

      await new Promise(resolve => setTimeout(resolve, 100));

      const list = await client.list({ fs: ':memory:', remote: '' });
      expect(list.list.some(item => item.Name === testFileName)).toBe(true);
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should purge', async () => {
    try {
      const purged = await client.purge({ fs: ':memory:', remote: '' });
      expect(purged).toBeDefined();
    } catch (error) {
      handleRcloneError(error);
    }
  });

  it('should mkdir and rmdir', async () => {
    try {
      await client.mkdir({ fs: ':local:', remote: 'test' });
      const list1 = await client.list({ fs: ':local:', remote: '' });
      expect(list1.list.some(item => item.Path === 'test')).toBe(true);

      await client.mkdir({ fs: ':local:', remote: 'test/subtest' });
      const list2 = await client.list({ fs: ':local:', remote: 'test' });
      expect(list2.list.some(item => item.Path === 'test/subtest')).toBe(true);

      await client.rmdir({ fs: ':local:', remote: 'test/subtest' });
      const list4 = await client.list({ fs: ':local:', remote: 'test' });
      expect(list4.list.some(item => item.Path === 'test')).toBe(false);

      await client.rmdir({ fs: ':local:', remote: 'test' });
      const list5 = await client.list({ fs: ':local:', remote: '' });
      expect(list5.list.some(item => item.Path === 'test/subtest')).toBe(false);
    } catch (error) {
      handleRcloneError(error);
    }
  });
});
