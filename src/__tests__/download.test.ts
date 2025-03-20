import { beforeEach, describe, expect, it } from 'vitest';
import { client, purgeMemoryFs } from './test-setup';

const testFileContent = 'This is a test file for download';
const testFileName = 'download-test.txt';
const testFolder = 'download-folder';

describe('Download Operations', () => {
  beforeEach(async () => {
    await purgeMemoryFs(testFolder);

    // Create test folder in memory filesystem
    await client.mkdir({
      body: { fs: ':memory:', remote: testFolder },
    });

    // Create test file in the folder
    const formData = new FormData();
    formData.append(
      'file0',
      new File([testFileContent], testFileName, {
        type: 'text/plain',
      }),
    );

    // Upload file to test folder in memory
    const upload = await client.uploadFile({
      body: formData,
      query: { fs: ':memory:', remote: testFolder },
    });
    expect(upload.status).toBe(200);
    expect(upload).toBeDefined();

    // Verify file exists in test folder
    const fileList = await client.list({ body: { fs: ':memory:', remote: testFolder } });
    if (fileList.status !== 200) expect.fail(`Response had an issue: ${JSON.stringify(fileList.body)}`);
    expect(fileList.body.list.some(item => item.Name === testFileName)).toBe(true);
  });

  it('should download a file from memory filesystem', async () => {
    const download = await client.download({
      params: {
        fs: '[:memory:]',
        remote: `${testFolder}/${testFileName}`,
      },
    });
    if (download.status !== 200) expect.fail(`Response had an issue: ${JSON.stringify(download.body)}`);
    // Check the content of the downloaded file
    const content = await download.body;
    expect(content).toBe(testFileContent);
  });

  it('should return error when downloading non-existent file', async () => {
    const download = await client.download({
      params: {
        fs: '[:memory:]',
        remote: `${testFolder}/non-existent-file.txt`,
      },
    });
    if (download.status !== 404) expect.fail(`Response had an issue: ${JSON.stringify(download.body)}`);
  });

  it('should input type should error if fs is not in brackets', async () => {
    const download = await client.download({
      params: {
        // @ts-expect-error - This should error because fs is not in brackets
        fs: ':memory:',
        remote: `${testFolder}/${testFileName}`,
      },
    });
    if (download.status === 200) expect.fail(`Response had an issue: ${JSON.stringify(download.body)}`);
  });
});
