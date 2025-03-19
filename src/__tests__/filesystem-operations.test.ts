import { beforeEach, describe, expect, it } from 'vitest';
import { client, purgeMemoryFs } from './test-setup';

describe('Filesystem Operations', () => {
  beforeEach(async () => {
    const response = await purgeMemoryFs();
    expect(response.status).toBe(200);
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
    expect(upload.status).toBe(200);
    expect(upload).toBeDefined();

    const list = await client.list({ body: { fs: ':memory:', remote: '' } });
    expect(list.status).toBe(200);
    if (list.status !== 200) return;
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
    if (listRoot.status !== 200) return;
    expect(listRoot.body.list.some(item => item.Path === dir)).toBe(true);

    // Create subdirectory
    const createSubDir = await client.mkdir({
      body: { fs: ':local:', remote: `${dir}/${subdir}` },
    });
    expect(createSubDir.status).toBe(200);

    // Verify subdirectory exists
    const listParentDir = await client.list({ body: { fs: ':local:', remote: dir } });
    expect(listParentDir.status).toBe(200);
    if (listParentDir.status !== 200) return;
    expect(listParentDir.body.list.some(item => item.Path === `${dir}/${subdir}`)).toBe(true);

    // Remove subdirectory
    const removeSubDir = await client.rmdir({
      body: { fs: ':local:', remote: `${dir}/${subdir}` },
    });
    expect(removeSubDir.status).toBe(200);

    // Verify subdirectory was removed
    const listAfterSubDirRemoval = await client.list({ body: { fs: ':local:', remote: dir } });
    expect(listAfterSubDirRemoval.status).toBe(200);
    if (listAfterSubDirRemoval.status !== 200) return;
    expect(listAfterSubDirRemoval.body.list.some(item => item.Path === dir)).toBe(false);

    // Remove parent directory
    const removeParentDir = await client.rmdir({ body: { fs: ':local:', remote: dir } });
    expect(removeParentDir.status).toBe(200);

    // Verify parent directory was removed
    const listAfterParentDirRemoval = await client.list({ body: { fs: ':local:', remote: '' } });
    expect(listAfterParentDirRemoval.status).toBe(200);
    if (listAfterParentDirRemoval.status !== 200) return;
    expect(listAfterParentDirRemoval.body.list.some(item => item.Path === dir)).toBe(false);
  });
});
