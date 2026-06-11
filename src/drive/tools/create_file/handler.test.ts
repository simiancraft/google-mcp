import { describe, expect, it } from 'bun:test';
import type { Readable } from 'node:stream';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type CreateParams = drive_v3.Params$Resource$Files$Create & {
  media?: { mimeType?: string; body?: string | Readable };
};

type Captured = { params?: CreateParams };

function fakeDrive(captured: Captured, data: drive_v3.Schema$File): drive_v3.Drive {
  return {
    files: {
      create: async (params: CreateParams) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

async function drain(body: string | Readable | undefined): Promise<string> {
  if (typeof body === 'string' || body === undefined) {
    return body ?? '';
  }
  const chunks: Buffer[] = [];
  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

describe('create_file', () => {
  it('uploads text content, converting text/plain to a Google Doc', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'F1', name: 'notes' }), {
      title: 'notes',
      contentMimeType: 'text/plain',
      textContent: 'hello',
      parentId: 'P1',
    });
    expect(captured.params?.requestBody).toEqual({
      name: 'notes',
      parents: ['P1'],
      mimeType: 'application/vnd.google-apps.document',
    });
    expect(captured.params?.media).toEqual({ mimeType: 'text/plain', body: 'hello' });
    expect(captured.params?.supportsAllDrives).toBe(true);
    expect(result).toEqual({ id: 'F1', title: 'notes' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('retains the content type when conversion is disabled', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'F2' }), {
      title: 'raw.txt',
      contentMimeType: 'text/plain',
      textContent: 'hello',
      disableConversionToGoogleType: true,
    });
    expect(captured.params?.requestBody).toEqual({ name: 'raw.txt' });
    expect(captured.params?.media).toEqual({ mimeType: 'text/plain', body: 'hello' });
  });

  it('decodes base64 content into the upload stream', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'F3' }), {
      title: 'photo.png',
      contentMimeType: 'image/png',
      base64Content: Buffer.from('PNG!').toString('base64'),
    });
    expect(captured.params?.media?.mimeType).toBe('image/png');
    expect(await drain(captured.params?.media?.body)).toBe('PNG!');
    expect(captured.params?.requestBody).toEqual({ name: 'photo.png' });
  });

  it('creates Google-native and metadata-only files without media', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'F4' }), {
      title: 'Untitled spreadsheet',
      contentMimeType: 'application/vnd.google-apps.spreadsheet',
    });
    expect(captured.params?.requestBody).toEqual({
      name: 'Untitled spreadsheet',
      mimeType: 'application/vnd.google-apps.spreadsheet',
    });
    expect(captured.params?.media).toBeUndefined();
  });

  it('does not resolve inherited keys as conversions', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'F9' }), {
      title: 'x',
      contentMimeType: '__proto__',
      textContent: 'a',
    });
    // No conversion: the create carries no mimeType override in its body.
    expect(captured.params?.requestBody?.mimeType).toBeUndefined();
  });

  it('rejects ambiguous and underspecified content at the schema', () => {
    const both = schema.input.safeParse({
      title: 'x',
      contentMimeType: 'text/plain',
      textContent: 'a',
      base64Content: 'YQ==',
    });
    expect(both.success).toBe(false);
    expect(JSON.stringify(both.error?.issues)).toContain('cannot both be set');
    const noMime = schema.input.safeParse({ title: 'x', textContent: 'a' });
    expect(noMime.success).toBe(false);
    expect(JSON.stringify(noMime.error?.issues)).toContain('contentMimeType is required');
  });
});
