import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Revisions$Get };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Revision): drive_v3.Drive {
  return {
    revisions: {
      get: async (params: drive_v3.Params$Resource$Revisions$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('get_revision', () => {
  it('gets and projects the revision', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'V1', size: '2048' }), {
      fileId: 'F1',
      revisionId: 'V1',
    });
    expect(captured.params).toMatchObject({ fileId: 'F1', revisionId: 'V1' });
    expect(result).toEqual({ id: 'V1', size: '2048' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
