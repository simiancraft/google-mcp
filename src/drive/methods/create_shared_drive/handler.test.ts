import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Drives$Create };

function fakeDrive(captured: Captured, data: drive_v3.Schema$Drive): drive_v3.Drive {
  return {
    drives: {
      create: async (params: drive_v3.Params$Resource$Drives$Create) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('create_shared_drive', () => {
  it('creates the shared drive with an explicit requestId', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, { id: 'D1', name: 'Marketing' }), {
      name: 'Marketing',
      requestId: 'REQ-1',
    });
    expect(captured.params).toMatchObject({
      requestId: 'REQ-1',
      requestBody: { name: 'Marketing' },
    });
    expect(result).toEqual({ id: 'D1', name: 'Marketing' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('defaults the requestId to a random UUID', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'D2' }), { name: 'Ops' });
    expect(captured.params?.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
