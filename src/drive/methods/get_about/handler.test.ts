import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$About$Get };

function fakeDrive(captured: Captured, data: drive_v3.Schema$About): drive_v3.Drive {
  return {
    about: {
      get: async (params: drive_v3.Params$Resource$About$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('get_about', () => {
  it('requests the explicit fields selection and projects the response', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        user: { displayName: 'Ada', emailAddress: 'ada@b.example', me: true },
        storageQuota: { limit: '107374182400', usage: '1024', usageInDrive: '512' },
        maxUploadSize: '5242880000000',
        canCreateDrives: true,
      }),
      {},
    );
    expect(captured.params?.fields).toBe(
      'user(displayName,emailAddress,me,photoLink),' +
        'storageQuota(limit,usage,usageInDrive,usageInDriveTrash),' +
        'maxUploadSize,canCreateDrives',
    );
    expect(result).toEqual({
      user: { displayName: 'Ada', emailAddress: 'ada@b.example', me: true },
      storageQuota: { limit: '107374182400', usage: '1024', usageInDrive: '512' },
      maxUploadSize: '5242880000000',
      canCreateDrives: true,
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('serves a sparse response with absent fields', async () => {
    const result = await handler(fakeDrive({}, {}), {});
    expect(result).toEqual({});
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
