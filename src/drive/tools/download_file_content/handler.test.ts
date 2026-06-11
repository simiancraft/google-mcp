import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = {
  getParams: drive_v3.Params$Resource$Files$Get[];
  exportParams?: drive_v3.Params$Resource$Files$Export;
};

function fakeDrive(captured: Captured, meta: drive_v3.Schema$File, body: string): drive_v3.Drive {
  return {
    files: {
      get: async (params: drive_v3.Params$Resource$Files$Get) => {
        captured.getParams.push(params);
        if (params.alt === 'media') {
          return { data: new TextEncoder().encode(body).buffer };
        }
        return { data: meta };
      },
      export: async (params: drive_v3.Params$Resource$Files$Export) => {
        captured.exportParams = params;
        return { data: new TextEncoder().encode(body).buffer };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('download_file_content', () => {
  it('refuses an oversized body even when the metadata carries no size', async () => {
    const captured: Captured = { getParams: [] };
    const oversized = 'x'.repeat(26 * 1024 * 1024);
    await expect(
      handler(fakeDrive(captured, { id: 'F1', mimeType: 'application/pdf' }, oversized), {
        fileId: 'F1',
      }),
    ).rejects.toThrow(/caps base64 downloads/);
  });

  it('downloads a blob as base64', async () => {
    const captured: Captured = { getParams: [] };
    const result = await handler(
      fakeDrive(
        captured,
        { id: 'F1', name: 'photo.png', mimeType: 'image/png', size: '4' },
        'PNG!',
      ),
      { fileId: 'F1' },
    );
    expect(captured.getParams[1]).toEqual({ fileId: 'F1', alt: 'media', supportsAllDrives: true });
    expect(result).toEqual({
      id: 'F1',
      title: 'photo.png',
      mimeType: 'image/png',
      content: Buffer.from('PNG!').toString('base64'),
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('exports a native file to the requested format, defaulting to text', async () => {
    const captured: Captured = { getParams: [] };
    const meta = { id: 'F2', name: 'doc', mimeType: 'application/vnd.google-apps.document' };
    const result = await handler(fakeDrive(captured, meta, 'hello'), {
      fileId: 'F2',
      exportMimeType: 'application/pdf',
    });
    expect(captured.exportParams).toEqual({ fileId: 'F2', mimeType: 'application/pdf' });
    expect(result.mimeType).toBe('application/pdf');
    expect(result.content).toBe(Buffer.from('hello').toString('base64'));

    const defaulted = await handler(fakeDrive({ getParams: [] }, meta, 'hello'), { fileId: 'F2' });
    expect(defaulted.mimeType).toBe('text/plain');
  });

  it('refuses blobs over the 25 MiB base64 boundary, citing the media issue', async () => {
    const captured: Captured = { getParams: [] };
    expect(
      handler(fakeDrive(captured, { id: 'F3', mimeType: 'video/mp4', size: '999999999' }, ''), {
        fileId: 'F3',
      }),
    ).rejects.toThrow('issues/38');
  });
});
