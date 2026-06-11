import { describe, expect, it } from 'bun:test';
import type { drive_v3 } from '@googleapis/drive';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: drive_v3.Params$Resource$Files$Emptytrash };

function fakeDrive(captured: Captured): drive_v3.Drive {
  return {
    files: {
      emptyTrash: async (params: drive_v3.Params$Resource$Files$Emptytrash) => {
        captured.params = params;
        return { data: undefined };
      },
    },
  } as unknown as drive_v3.Drive;
}

describe('empty_trash', () => {
  it("empties the user's trash and confirms", async () => {
    const captured: Captured = {};
    const result = await handler(fakeDrive(captured), {});
    expect(captured.params).toEqual({});
    expect(result).toEqual({ emptied: true });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it("targets a shared drive's trash when driveId is set", async () => {
    const captured: Captured = {};
    await handler(fakeDrive(captured), { driveId: 'D1' });
    expect(captured.params).toEqual({ driveId: 'D1' });
  });
});
