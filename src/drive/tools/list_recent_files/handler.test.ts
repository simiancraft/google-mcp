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

describe('list_recent_files', () => {
  it('defaults to recency ordering with a page of 10', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, { files: [{ id: 'F1', name: 'latest' }] }),
      {},
    );
    expect(captured.params).toMatchObject({ orderBy: 'recency desc', pageSize: 10 });
    expect(result.files).toEqual([{ id: 'F1', title: 'latest' }]);
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it.each([
    ['lastModified', 'modifiedTime desc'],
    ['lastModifiedByMe', 'modifiedByMeTime desc'],
  ] as const)('maps the %s sort order onto REST orderBy', async (orderBy, restOrderBy) => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured, {}), {
      orderBy,
      pageSize: 3,
      pageToken: 'P2',
    });
    expect(captured.params).toMatchObject({
      orderBy: restOrderBy,
      pageSize: 3,
      pageToken: 'P2',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
