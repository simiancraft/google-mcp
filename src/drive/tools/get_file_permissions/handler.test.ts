import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params: drive_v3.Params$Resource$Permissions$List[] };

function fakeDrive(captured: Captured, pages: drive_v3.Schema$PermissionList[]): drive_v3.Drive {
  let call = 0;
  return {
    permissions: {
      list: async (params: drive_v3.Params$Resource$Permissions$List) => {
        captured.params.push(params);
        const data = pages[call];
        call += 1;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('get_file_permissions', () => {
  it('walks every page and projects the permissions', async () => {
    const captured: Captured = { params: [] };
    const result = await handler(
      fakeDrive(captured, [
        {
          permissions: [{ role: 'owner', type: 'user', emailAddress: 'a@b.example' }],
          nextPageToken: 'P2',
        },
        { permissions: [{ role: 'reader', type: 'anyone' }] },
      ]),
      { fileId: 'F1' },
    );
    expect(captured.params).toHaveLength(2);
    expect(captured.params[0]).toEqual({
      fileId: 'F1',
      fields: 'nextPageToken,permissions(role,displayName,type,emailAddress,view)',
      supportsAllDrives: true,
    });
    expect(captured.params[1]).toMatchObject({ pageToken: 'P2' });
    expect(result.permissions).toEqual([
      { role: 'owner', type: 'user', emailAddress: 'a@b.example' },
      { role: 'reader', type: 'anyone' },
    ]);
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('serves an empty grant list as an empty array', async () => {
    const captured: Captured = { params: [] };
    const result = await handler(fakeDrive(captured, [{}]), { fileId: 'F1' });
    expect(result).toEqual({ permissions: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
