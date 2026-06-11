import { describe, expect, it } from 'bun:test';
import { assertWithinDownloadCap, MAX_DOWNLOAD_BYTES } from './limits.js';

describe('MAX_DOWNLOAD_BYTES', () => {
  it('is 25 MiB', () => {
    expect(MAX_DOWNLOAD_BYTES).toBe(26214400);
  });
});

describe('assertWithinDownloadCap', () => {
  it('passes sizes at or under the ceiling, including string metadata sizes', () => {
    expect(() =>
      assertWithinDownloadCap(MAX_DOWNLOAD_BYTES, { subject: 'File', action: 'reads' }),
    ).not.toThrow();
    expect(() =>
      assertWithinDownloadCap('1024', { subject: 'File', action: 'reads' }),
    ).not.toThrow();
    expect(() => assertWithinDownloadCap(null, { subject: 'File', action: 'reads' })).not.toThrow();
  });

  it('refuses oversize transfers, deriving the MiB label and citing the deferral', () => {
    expect(() =>
      assertWithinDownloadCap(MAX_DOWNLOAD_BYTES + 1, {
        subject: 'File content',
        action: 'content reads',
        deferral: 'https://github.com/simiancraft/google-mcp-suite/issues/38',
      }),
    ).toThrow(
      /File content is 26214401 bytes; this server caps content reads at 26214400 bytes \(25 MiB\)\. Larger transfers are deferred to https:\/\/github\.com/,
    );
  });

  it('omits the deferral sentence when none applies', () => {
    expect(() =>
      assertWithinDownloadCap('99999999', { subject: 'Attachment', action: 'base64 transfers' }),
    ).toThrow(/\(25 MiB\)\.$/);
  });

  it('lets a non-finite metadata size pass to the post-fetch re-check', () => {
    expect(() =>
      assertWithinDownloadCap('not-a-size', { subject: 'File', action: 'reads' }),
    ).not.toThrow();
  });
});
