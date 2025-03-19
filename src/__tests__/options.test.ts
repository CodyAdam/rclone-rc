import { describe, expect, it } from 'vitest';
import { client } from './test-setup';

describe('Options Operations', () => {
  it('should have config', async () => {
    const response = await client.optionsLocal({ body: {} });
    expect(response.status).toBe(200);
  });

  it('should have custom filter in config', async () => {
    const response = await client.optionsLocal({
      body: {
        _filter: {
          ExcludeFile: ['*.txt'],
        },
      },
    });
    if (response.status !== 200) expect.fail('Rclone is not running');
    expect(response.status).toBe(200);
    expect(response.body.filter.ExcludeFile).toEqual(['*.txt']);
  });

  it('should have filter in config', async () => {
    const response = await client.optionsLocal({
      body: {
        _config: {
          CheckSum: true,
        },
      },
    });
    if (response.status !== 200) expect.fail('Rclone is not running');
    expect(response.status).toBe(200);
    expect(response.body.config.CheckSum).toBe(true);
  });
});
