import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { createClient } from '../client';

describe('Rclone Client', () => {
  it('should check if rclone is running', async () => {
    try {
      // Check if rclone is running on port 5572
      await axios.post('http://localhost:5572/core/version');
      expect(true).toBe(true); // If we get here, rclone is running
    } catch (error) {
      expect.fail(
        'Rclone is not running on port 5572. Make sure rclone is running with `rclone rcd` on port 5572 (default).',
      );
    }
  });

  it('should be implemented', () => {
    // This is a placeholder test
    // TODO: Implement actual tests for the Rclone client
    expect(true).toBe(true);
  });

  it('should get version', async () => {
    const client = createClient();
    const version = await client.version(undefined);
    expect(version).toBeDefined();
  });
});
