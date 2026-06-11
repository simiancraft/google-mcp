import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Revisions$Delete };

function fakeDrive(captured: Captured): drive_v3.Drive {
  return {
    revisions: {
      delete: async (params: drive_v3.Params$Resource$Revisions$Delete) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('delete_revision', () => {
  it('deletes the revision and confirms the ids', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured), { fileId: 'F1', revisionId: 'V1' });
    expect(captured.params).toEqual({ fileId: 'F1', revisionId: 'V1' });
    expect(result).toEqual({ fileId: 'F1', revisionId: 'V1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
