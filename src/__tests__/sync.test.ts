import { beforeEach, describe, expect, it } from 'vitest';
import { client, purgeMemoryFs } from './test-setup';
const testFileContent = 'This is a test file for sync';
const testFileName = 'sync-test.txt';
const sourceFolder = 'source-folder';
const destFolder = 'dest-folder';
describe('Sync Operations', () => {
  beforeEach(async () => {
    await purgeMemoryFs(sourceFolder);
    await purgeMemoryFs(destFolder);

    // Create source folder in memory filesystem
    await client.mkdir({
      body: { fs: ':memory:', remote: sourceFolder },
    });

    // Create test files in source folder
    const formData = new FormData();
    formData.append(
      'file0',
      new File([testFileContent], testFileName, {
        type: 'text/plain',
      }),
    );
    // Upload file to source folder in memory
    const upload = await client.uploadFile({
      body: formData,
      query: { fs: ':memory:', remote: sourceFolder },
    });
    expect(upload.status).toBe(200);
    expect(upload).toBeDefined();

    // Verify file exists in source folder
    const sourceList = await client.list({ body: { fs: ':memory:', remote: sourceFolder } });
    if (sourceList.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(sourceList.body)}`);
    expect(sourceList.body.list.some(item => item.Name === testFileName)).toBe(true);
  });

  it('should sync files between different folders in memory', async () => {
    // Sync from source folder to destination folder
    const sync = await client.sync({
      body: {
        srcFs: ':memory:' + sourceFolder,
        dstFs: ':memory:' + destFolder,
        createEmptySrcDirs: true,
      },
    });
    if (sync.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(sync.body)}`);

    // Verify file was synced to destination folder
    const destList = await client.list({ body: { fs: ':memory:', remote: destFolder } });
    if (destList.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(destList.body)}`);
    expect(destList.body.list.some(item => item.Name === testFileName)).toBe(true);
  });

  it('should not sync with dry run option', async () => {
    // Sync from source folder to destination folder with dry-run option
    const dryRunSync = await client.sync({
      body: {
        srcFs: ':memory:' + sourceFolder,
        dstFs: ':memory:' + destFolder,
        _config: {
          DryRun: true,
        },
      },
    });
    expect(dryRunSync.status).toBe(200);

    // Verify files were not actually synced to destination folder (dry run)
    const folderListAfterDryRun = await client.list({ body: { fs: ':memory:', remote: '' } });
    if (folderListAfterDryRun.status !== 200)
      expect.fail(`Response had an issue : ${JSON.stringify(folderListAfterDryRun.body)}`);
    expect(folderListAfterDryRun.body.list.some(item => item.Path === destFolder)).toBe(false);
  });

  it('should check files different between two remotes', async () => {
    const check = await client.check({
      body: {
        srcFs: ':memory:' + sourceFolder,
        dstFs: ':memory:' + destFolder,
      },
    });
    if (check.status !== 200) expect.fail(`Response had an issue : ${JSON.stringify(check.body)}`);
    expect(check.body.success).toBe(false); // since it is different
    expect(check.body.missingOnDst).toContain(testFileName);
  });
  it('should detect files with different content between two remotes', async () => {
    // Create a file with different content in the destination folder
    const differentContent = 'This is different content';
    const formData = new FormData();
    formData.append(
      'file0',
      new File([differentContent], testFileName, {
        type: 'text/plain',
      }),
    );
    const createDifferentFile = await client.uploadFile({
      query: {
        fs: ':memory:',
        remote: destFolder,
      },
      body: formData,
    });
    if (createDifferentFile.status !== 200)
      expect.fail(`Failed to create file with different content: ${JSON.stringify(createDifferentFile.body)}`);

    // Check the two folders
    const check = await client.check({
      body: {
        srcFs: ':memory:' + sourceFolder,
        dstFs: ':memory:' + destFolder,
        differ: true,
      },
    });
    if (check.status !== 200) expect.fail(`Response had an issue: ${JSON.stringify(check.body)}`);

    // Verify that the check detects the files with different content
    expect(check.body.success).toBe(false);
    expect(check.body.differ).toContain(testFileName);
  });
  it('should check with the combined option', async () => {
    // Create a file with different content in the destination folder
    const differentContent = 'This is different content';
    const formData = new FormData();
    formData.append(
      'file0',
      new File([differentContent], testFileName, {
        type: 'text/plain',
      }),
    );
    const createDifferentFile = await client.uploadFile({
      query: {
        fs: ':memory:',
        remote: destFolder,
      },
      body: formData,
    });
    if (createDifferentFile.status !== 200)
      expect.fail(`Failed to create file with different content: ${JSON.stringify(createDifferentFile.body)}`);

    // Check the two folders
    const check = await client.check({
      body: {
        srcFs: ':memory:' + sourceFolder,
        dstFs: ':memory:' + destFolder,
        combined: true,
      },
    });
    if (check.status !== 200) expect.fail(`Response had an issue: ${JSON.stringify(check.body)}`);

    // Verify that the check detects the files with different content
    expect(check.body.success).toBe(false);
    expect(check.body.combined).toContain(`* ${testFileName}`);
  });
});
