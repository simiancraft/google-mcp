import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Revisions$Update };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Revision): drive_v3.Drive {
  return {
    revisions: {
      update: async (params: drive_v3.Params$Resource$Revisions$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('update_revision', () => {
  it('patches exactly the populated flags and projects the revision', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'V1', keepForever: true }), {
      fileId: 'F1',
      revisionId: 'V1',
      keepForever: true,
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      revisionId: 'V1',
      requestBody: { keepForever: true },
    });
    expect(result).toEqual({ id: 'V1', keepForever: true });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
