import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Files$Get };

function fakeDrive(captured: Captured, data: drive_v3.Schema$File): drive_v3.Drive {
  return {
    files: {
      get: async (params: drive_v3.Params$Resource$Files$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('get_file_metadata', () => {
  it('requests the toolset projection fields and projects the file', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        id: 'F1',
        name: 'Q2 plan',
        mimeType: 'application/pdf',
        size: '2048',
        owners: [{ emailAddress: 'a@b.example' }],
      }),
      { fileId: 'F1' },
    );
    expect(captured.params).toEqual({
      fileId: 'F1',
      fields:
        'id,name,parents,mimeType,size,description,fileExtension,webViewLink,' +
        'sharedWithMeTime,createdTime,modifiedTime,viewedByMeTime,owners(emailAddress),' +
        'capabilities(canAddChildren)',
      supportsAllDrives: true,
    });
    expect(result).toEqual({
      id: 'F1',
      title: 'Q2 plan',
      mimeType: 'application/pdf',
      fileSize: '2048',
      owner: 'a@b.example',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
