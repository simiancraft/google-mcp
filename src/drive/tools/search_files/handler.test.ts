import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Files$List };

function fakeDrive(captured: Captured, data: drive_v3.Schema$FileList): drive_v3.Drive {
  return {
    files: {
      list: async (params: drive_v3.Params$Resource$Files$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('search_files', () => {
  it('translates the documented query vocabulary into v3 q and projects the files', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, {
        files: [{ id: 'F1', name: 'Taxes 2026', webViewLink: 'https://drive.example/F1' }],
        nextPageToken: 'NEXT',
      }),
      { query: "title contains 'Taxes' and parentId = 'root'" },
    );
    expect(captured.params).toEqual({
      q: "name contains 'Taxes' and 'root' in parents",
      fields:
        'nextPageToken,files(id,name,parents,mimeType,size,description,fileExtension,webViewLink,' +
        'sharedWithMeTime,createdTime,modifiedTime,viewedByMeTime,owners(emailAddress),' +
        'capabilities(canAddChildren))',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    expect(result.files).toEqual([
      { id: 'F1', title: 'Taxes 2026', viewUrl: 'https://drive.example/F1' },
    ]);
    expect(result.nextPageToken).toBe('NEXT');
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes pagination through and serves an empty page as an empty list', async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, {}), {
      query: "owner = 'me'",
      pageSize: 5,
      pageToken: 'P2',
      excludeContentSnippets: true,
    });
    expect(captured.params).toMatchObject({ q: "'me' in owners", pageSize: 5, pageToken: 'P2' });
    expect(result).toEqual({ files: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
