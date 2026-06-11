import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Files$Update };

function fakeDrive(captured: Captured, data: drive_v3.Schema$File): drive_v3.Drive {
  return {
    files: {
      update: async (params: drive_v3.Params$Resource$Files$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('update_file', () => {
  it('patches exactly the populated fields and projects the result', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDrive(captured, { id: 'F1', name: 'renamed', starred: true }),
      { fileId: 'F1', name: 'renamed', starred: true },
    );
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      requestBody: { name: 'renamed', starred: true },
      supportsAllDrives: true,
    });
    expect(captured.params?.addParents).toBeUndefined();
    expect(captured.params?.fields).toContain('starred');
    expect(result).toEqual({ id: 'F1', title: 'renamed', starred: true });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('moves between folders with addParents/removeParents', async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured, { id: 'F1' }), {
      fileId: 'F1',
      addParents: 'P2',
      removeParents: 'P1',
    });
    expect(captured.params).toMatchObject({
      fileId: 'F1',
      addParents: 'P2',
      removeParents: 'P1',
      requestBody: {},
    });
  });
});
