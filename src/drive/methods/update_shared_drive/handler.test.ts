import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Drives$Update };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Drive): drive_v3.Drive {
  return {
    drives: {
      update: async (params: drive_v3.Params$Resource$Drives$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('update_shared_drive', () => {
  it('patches exactly the populated fields and projects the result', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        id: 'D1',
        name: 'Marketing 2.0',
        restrictions: { domainUsersOnly: true },
      }),
      { driveId: 'D1', name: 'Marketing 2.0', restrictions: { domainUsersOnly: true } },
    );
    expect(captured.params).toMatchObject({
      driveId: 'D1',
      requestBody: { name: 'Marketing 2.0', restrictions: { domainUsersOnly: true } },
    });
    expect(result).toEqual({
      id: 'D1',
      name: 'Marketing 2.0',
      restrictions: { domainUsersOnly: true },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
