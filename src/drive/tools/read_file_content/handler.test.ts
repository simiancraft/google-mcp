import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = {
  getParams: drive_v3.Params$Resource$Files$Get[];
  exportParams?: drive_v3.Params$Resource$Files$Export;
  options: unknown[];
};

function fakeDrive(captured: Captured, meta: drive_v3.Schema$File, body: string): drive_v3.Drive {
  return {
    files: {
      get: async (params: drive_v3.Params$Resource$Files$Get, options?: unknown) => {
        captured.getParams.push(params);
        if (options) {
          captured.options.push(options);
        }
        if (params.alt === 'media') {
          return { data: new TextEncoder().encode(body).buffer };
        }
        return { data: meta };
      },
      export: async (params: drive_v3.Params$Resource$Files$Export, options?: unknown) => {
        captured.exportParams = params;
        captured.options.push(options);
        return { data: new TextEncoder().encode(body).buffer };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('read_file_content', () => {
  it('exports Google-native files to their text representation', async () => {
    const captured: Captured = { getParams: [], options: [] };
    const result = await handler(
      fakeDrive(
        captured,
        { id: 'F1', mimeType: 'application/vnd.google-apps.spreadsheet' },
        'a,b\n1,2',
      ),
      { fileId: 'F1' },
    );
    expect(captured.getParams[0]).toEqual({
      fileId: 'F1',
      fields: 'id,mimeType,size',
      supportsAllDrives: true,
    });
    expect(captured.exportParams).toEqual({ fileId: 'F1', mimeType: 'text/csv' });
    expect(captured.options).toEqual([{ responseType: 'arraybuffer' }]);
    expect(result).toEqual({ fileContent: 'a,b\n1,2' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('downloads text-like blobs as UTF-8', async () => {
    const captured: Captured = { getParams: [], options: [] };
    const result = await handler(
      fakeDrive(captured, { id: 'F2', mimeType: 'text/markdown' }, '# notes'),
      { fileId: 'F2' },
    );
    expect(captured.getParams[1]).toEqual({ fileId: 'F2', alt: 'media', supportsAllDrives: true });
    expect(result).toEqual({ fileContent: '# notes' });
  });

  it('refuses native types with no text representation', async () => {
    const captured: Captured = { getParams: [], options: [] };
    expect(
      handler(fakeDrive(captured, { mimeType: 'application/vnd.google-apps.folder' }, ''), {
        fileId: 'F3',
      }),
    ).rejects.toThrow('no text representation');
  });

  it('refuses binary blobs with guidance toward download_file_content', async () => {
    const captured: Captured = { getParams: [], options: [] };
    expect(
      handler(fakeDrive(captured, { mimeType: 'application/pdf' }, ''), { fileId: 'F4' }),
    ).rejects.toThrow('download_file_content');
    expect(handler(fakeDrive(captured, {}, ''), { fileId: 'F5' })).rejects.toThrow(
      'unknown mime type',
    );
  });

  it('refuses a text blob over the 25 MiB ceiling', async () => {
    const captured: Captured = { getParams: [], options: [] };
    const oversized = String(26 * 1024 * 1024);
    await expect(
      handler(
        fakeDrive(captured, { id: 'F1', mimeType: 'text/csv', size: oversized }, 'never read'),
        { fileId: 'F1' },
      ),
    ).rejects.toThrow(/caps content reads/);
  });
});
