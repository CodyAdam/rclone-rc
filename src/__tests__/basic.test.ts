import { describe, expect, it } from 'vitest';
import { client } from './test-setup';

describe('Basic Operations', () => {
  it('should check if rclone is running', async () => {
    const response = await client.noop({ body: { ping: 'pong' } });
    expect(response.status).toBe(200);
    if (response.status !== 200) expect.fail('Rclone is not running');
    expect(response.body).toEqual({ ping: 'pong' });
  });

  it('should perform noop operation', async () => {
    const testParams = { param1: 'test', param2: 123 };
    const noop = await client.noop({ body: testParams });
    expect(noop.status).toBe(200);
    if (noop.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(noop)}`);
    expect(noop.body).toEqual(testParams);
  });

  it('should perform noopauth operation', async () => {
    const testParams = { param1: 'test', param2: 123 };
    const noopauth = await client.noopAuth({ body: testParams });
    expect(noopauth.status).toBe(200);
    if (noopauth.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(noopauth)}`);
    expect(noopauth.body).toEqual(testParams);
  });

  it('should get version', async () => {
    const version = await client.version({ body: undefined });
    expect(version.status).toBe(200);
    expect(version).toBeDefined();
  });

  it('should get stats', async () => {
    const stats = await client.stats({ body: undefined });
    expect(stats.status).toBe(200);
    expect(stats).toBeDefined();
  });

  it('should get about', async () => {
    const about = await client.about({ body: { fs: ':local:' } });
    expect(about.status).toBe(200);
    expect(about).toBeDefined();
  });
});
