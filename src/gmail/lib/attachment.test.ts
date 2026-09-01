import { describe, expect, it } from 'bun:test';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MAX_DOWNLOAD_BYTES } from '../../lib/limits.js';
import {
  ATTACHMENTS_PARAM_DESCRIPTION,
  foldBase64,
  headerParamSafe,
  loadAttachments,
  sniffMimeType,
} from './attachment.js';

async function tempDir(): Promise<string> {
  const dir = join(tmpdir(), `attach-${process.pid}-${Math.random().toString(36).slice(2)}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

describe('sniffMimeType', () => {
  it('maps known extensions, case-insensitively', () => {
    expect(sniffMimeType('packet.pdf')).toBe('application/pdf');
    expect(sniffMimeType('PHOTO.JPG')).toBe('image/jpeg');
    expect(sniffMimeType('notes.md')).toBe('text/markdown');
  });

  it('falls back to octet-stream for unknown or missing extensions', () => {
    expect(sniffMimeType('blob.xyz123')).toBe('application/octet-stream');
    expect(sniffMimeType('no-extension')).toBe('application/octet-stream');
  });

  it('misses soft on prototype-shaped extensions', () => {
    expect(sniffMimeType('file.constructor')).toBe('application/octet-stream');
    expect(sniffMimeType('file.__proto__')).toBe('application/octet-stream');
  });
});

describe('headerParamSafe', () => {
  it('strips control characters, quotes, and backslashes', () => {
    expect(headerParamSafe('re\r\nport".pdf\\')).toBe('report.pdf');
    expect(headerParamSafe('plain.txt')).toBe('plain.txt');
  });
});

describe('foldBase64', () => {
  it('folds to 76-character CRLF-separated lines', () => {
    const folded = foldBase64('A'.repeat(200));
    const lines = folded.split('\r\n');
    expect(lines.map((line) => line.length)).toEqual([76, 76, 48]);
  });

  it('returns an empty string for empty input', () => {
    expect(foldBase64('')).toBe('');
  });
});

describe('loadAttachments', () => {
  it('returns undefined when there is nothing to attach', async () => {
    expect(await loadAttachments(undefined)).toBeUndefined();
    expect(await loadAttachments([])).toBeUndefined();
  });

  it('reads the file, defaults filename and mime type, and encodes folded base64', async () => {
    const dir = await tempDir();
    const path = join(dir, 'packet.pdf');
    const bytes = Buffer.from('pdf bytes here');
    await writeFile(path, bytes);

    const loaded = await loadAttachments([{ path }]);
    expect(loaded).toHaveLength(1);
    expect(loaded?.[0]).toMatchObject({
      filename: 'packet.pdf',
      contentType: 'application/pdf',
      data: bytes.toString('base64'),
    });
  });

  it('honors explicit filename and mimeType, sanitized for header placement', async () => {
    const dir = await tempDir();
    const path = join(dir, 'raw.bin');
    await writeFile(path, Buffer.from([1, 2, 3]));

    const loaded = await loadAttachments([
      { path, filename: 'work "list".csv', mimeType: 'text/csv' },
    ]);
    expect(loaded?.[0]).toMatchObject({ filename: 'work list.csv', contentType: 'text/csv' });
  });

  it('falls back to a stub filename when the name sanitizes to nothing', async () => {
    const dir = await tempDir();
    const path = join(dir, 'x');
    await writeFile(path, Buffer.from([0]));

    const loaded = await loadAttachments([{ path, filename: '"""' }]);
    expect(loaded?.[0]?.filename).toBe('attachment');
  });

  it('refuses a combined payload over the suite ceiling before reading further files', async () => {
    const dir = await tempDir();
    const big = join(dir, 'big.bin');
    const small = join(dir, 'small.bin');
    await writeFile(big, Buffer.alloc(MAX_DOWNLOAD_BYTES));
    await writeFile(small, Buffer.alloc(1));

    // Each file fits alone; together they cross the ceiling.
    await expect(loadAttachments([{ path: big }, { path: small }])).rejects.toThrow(/caps/);
  });

  it('surfaces a missing file as a loud error', async () => {
    const dir = await tempDir();
    await expect(loadAttachments([{ path: join(dir, 'absent.pdf') }])).rejects.toThrow();
  });
});

describe('ATTACHMENTS_PARAM_DESCRIPTION', () => {
  it('states the cap in MiB, derived from the constant', () => {
    expect(ATTACHMENTS_PARAM_DESCRIPTION).toContain(`${MAX_DOWNLOAD_BYTES / (1024 * 1024)} MiB`);
  });
});
