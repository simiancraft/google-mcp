import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Files$Update };

function fakeDrive(captured: Captured, data: drive_v3.Schema$File): drive_v3.Drive {
  return {
    files: {
      update: async (params: drive_v3.Params$Resource$Files$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('untrash_file', () => {
  it('clears exactly the trashed flag and projects the restored file', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'F1', trashed: false }), {
      fileId: 'F1',
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      requestBody: { trashed: false },
      supportsAllDrives: true,
    });
    expect(result).toEqual({ id: 'F1', trashed: false });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
