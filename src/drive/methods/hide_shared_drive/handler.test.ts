import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Drives$Hide };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Drive): drive_v3.Drive {
  return {
    drives: {
      hide: async (params: drive_v3.Params$Resource$Drives$Hide) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('hide_shared_drive', () => {
  it('hides the shared drive and projects it', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'D1', hidden: true }), {
      driveId: 'D1',
    });
    expect(captured.params).toMatchObject({ driveId: 'D1' });
    expect(result).toEqual({ id: 'D1', hidden: true });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
