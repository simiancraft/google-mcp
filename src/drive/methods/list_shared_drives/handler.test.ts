import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Drives$List };

function fakeDrive(captured: Captured, data: drive_v3.Schema$DriveList): drive_v3.Drive {
  return {
    drives: {
      list: async (params: drive_v3.Params$Resource$Drives$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('list_shared_drives', () => {
  it('lists and projects the shared drives', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        drives: [{ id: 'D1', name: 'Marketing' }],
        nextPageToken: 'NEXT',
      }),
      { pageSize: 5, q: "name contains 'Mark'" },
    );
    expect(captured.params).toMatchObject({ pageSize: 5, q: "name contains 'Mark'" });
    expect(captured.params?.fields).toContain('nextPageToken,drives(');
    expect(result.drives).toEqual([{ id: 'D1', name: 'Marketing' }]);
    expect(result.nextPageToken).toBe('NEXT');
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('serves no shared drives as an empty list', async () => {
    const result = await handler(fakeDrive({}, {}), {});
    expect(result).toEqual({ drives: [] });
  });
});
