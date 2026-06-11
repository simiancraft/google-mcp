import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Drives$Delete };

function fakeDrive(captured: Captured): drive_v3.Drive {
  return {
    drives: {
      delete: async (params: drive_v3.Params$Resource$Drives$Delete) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('delete_shared_drive', () => {
  it('deletes the shared drive and confirms the id', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured), { driveId: 'D1' });
    expect(captured.params).toEqual({ driveId: 'D1' });
    expect(result).toEqual({ driveId: 'D1' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
