import { beforeEach, describe, expect, it } from 'vitest';
import { client, purgeMemoryFs } from './test-setup';

describe('Filesystem Operations', () => {
  beforeEach(async () => {
    await purgeMemoryFs();
  });

  it('should list current directory', async () => {
    const list = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(list.status).toBe(200);
    expect(list).toBeDefined();
  });

  it('should upload file', async () => {
    const testFileContent = 'This is a test file content';
    const testFileName = 'test.txt';
    const formData = new FormData();
    formData.append(
      'file0',
      new File([testFileContent], testFileName, {
        type: 'text/plain',
      }),
    );
    const upload = await client.uploadFile({
      body: formData,
      query: { fs: ':memory:', remote: '' },
    });
    if (upload.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(upload)}`);

    const list = await client.list({ body: { fs: ':memory:', remote: '' } });
    if (list.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(list)}`);
    expect(list.body.list.some(item => item.Name === testFileName)).toBe(true);
  });

  it('should purge', async () => {
    const purged = await client.purge({ body: { fs: ':memory:', remote: '' } });
    expect(purged.status).toBe(200);
    expect(purged).toBeDefined();
  });

  it('should create and remove directories', async () => {
    const dir = 'rclone-rc-test';
    const subdir = 'subrclone-rc-test';
    // Create parent directory
    const createParentDir = await client.mkdir({ body: { fs: ':local:', remote: dir } });
    expect(createParentDir.status).toBe(200);

    // Verify parent directory exists
    const listRoot = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(listRoot.status).toBe(200);
    if (listRoot.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(listRoot)}`);
    expect(listRoot.body.list.some(item => item.Path === dir)).toBe(true);

    // Create subdirectory
    const createSubDir = await client.mkdir({
      body: { fs: ':local:', remote: `${dir}/${subdir}` },
    });
    expect(createSubDir.status).toBe(200);

    // Verify subdirectory exists
    const listParentDir = await client.list({ body: { fs: ':local:', remote: dir } });
    expect(listParentDir.status).toBe(200);
    if (listParentDir.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(listParentDir)}`);
    expect(listParentDir.body.list.some(item => item.Path === `${dir}/${subdir}`)).toBe(true);

    // Remove subdirectory
    const removeSubDir = await client.rmdir({
      body: { fs: ':local:', remote: `${dir}/${subdir}` },
    });
    expect(removeSubDir.status).toBe(200);

    // Verify subdirectory was removed
    const listAfterSubDirRemoval = await client.list({ body: { fs: ':local:', remote: dir } });
    expect(listAfterSubDirRemoval.status).toBe(200);
    if (listAfterSubDirRemoval.status !== 200)
      expect.fail(`Response had an issue : ${JSON.stringify(listAfterSubDirRemoval)}`);
    expect(listAfterSubDirRemoval.body.list.some(item => item.Path === dir)).toBe(false);

    // Remove parent directory
    const removeParentDir = await client.rmdir({ body: { fs: ':local:', remote: dir } });
    expect(removeParentDir.status).toBe(200);

    // Verify parent directory was removed
    const listAfterParentDirRemoval = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(listAfterParentDirRemoval.status).toBe(200);
    if (listAfterParentDirRemoval.status !== 200)
      expect.fail(`Response had an issue : ${JSON.stringify(listAfterParentDirRemoval)}`);
    expect(listAfterParentDirRemoval.body.list.some(item => item.Path === dir)).toBe(false);
  });

  it('should dryrun on mkdir', async () => {
    const dirName = 'rclone-rc-dryrun-test';

    // Create directory
    const createDir = await client.mkdir({
      body: {
        fs: ':memory:',
        remote: dirName,
        _config: {
          DryRun: true,
        },
      },
    });
    expect(createDir.status).toBe(200);
    // Verify directory doesn't exist
    const listAfterCreate = await client.list({
      body: { fs: ':memory:', remote: '' },
    });
    expect(listAfterCreate.status).toBe(200);
    if (listAfterCreate.status !== 200) expect.fail(`Response had an issue: ${JSON.stringify(listAfterCreate)}`);
    expect(listAfterCreate.body.list.some(item => item.Path === dirName)).toBe(false);
  });
});
