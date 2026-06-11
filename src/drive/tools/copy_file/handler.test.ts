import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Files$Copy };

function fakeDrive(captured: Captured, data: drive_v3.Schema$File): drive_v3.Drive {
  return {
    files: {
      copy: async (params: drive_v3.Params$Resource$Files$Copy) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('copy_file', () => {
  it('copies with a new title and parent', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, { id: 'F2', name: 'Plan (fork)', parents: ['P9'] }),
      { fileId: 'F1', title: 'Plan (fork)', parentId: 'P9' },
    );
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      requestBody: { name: 'Plan (fork)', parents: ['P9'] },
      supportsAllDrives: true,
    });
    expect(result).toEqual({ id: 'F2', title: 'Plan (fork)', parentId: 'P9' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it("defaults title and parent to Google's behavior by omitting them", async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'F3' }), { fileId: 'F1' });
    expect(captured.params?.requestBody).toEqual({});
  });
});
