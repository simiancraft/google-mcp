import { describe, expect, it } from 'bun:test';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { gmail_v1 } from '@googleapis/gmail';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeGmail(captured: {
  id?: string | undefined;
  raw?: string | undefined;
}): gmail_v1.Gmail {
  return {
    users: {
      getProfile: async () => ({ data: { emailAddress: 'me@example.com' } }),
      drafts: {
        update: async (params: gmail_v1.Params$Resource$Users$Drafts$Update) => {
          captured.id = params.id ?? undefined;
          captured.raw = params.requestBody?.message?.raw ?? undefined;
          return { data: { id: 'D1' } };
        },
        get: async () => ({
          data: {
            id: 'D1',
            message: { payload: { headers: [{ name: 'Subject', value: 'New' }] } },
          },
        }),
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('update_draft', () => {
  it('replaces the draft content and projects it', async () => {
    const captured: { id?: string | undefined; raw?: string | undefined } = {};
    const result = await handler(fakeGmail(captured), {
      draftId: 'D1',
      to: ['x@example.com'],
      subject: 'New',
    });
    expect(captured.id).toBe('D1');
    expect(Buffer.from(captured.raw ?? '', 'base64url').toString('utf8')).toContain(
      'x@example.com',
    );
    expect(result).toMatchObject({ id: 'D1', subject: 'New' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('reads attachments from disk into the raw message', async () => {
    const dir = join(
      tmpdir(),
      `update-attach-${process.pid}-${Math.random().toString(36).slice(2)}`,
    );
    await mkdir(dir, { recursive: true });
    const path = join(dir, 'photo.png');
    const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    await writeFile(path, bytes);

    const captured: { id?: string | undefined; raw?: string | undefined } = {};
    await handler(fakeGmail(captured), {
      draftId: 'D1',
      to: ['x@example.com'],
      body: 'see attached',
      attachments: [{ path }],
    });

    const decoded = Buffer.from(captured.raw ?? '', 'base64url').toString('utf8');
    expect(decoded).toContain('Content-Type: multipart/mixed');
    expect(decoded).toContain('Content-Disposition: attachment; filename="photo.png"');
    expect(decoded).toContain('Content-Type: image/png; name="photo.png"');
    expect(decoded).toContain(bytes.toString('base64'));
  });
});
