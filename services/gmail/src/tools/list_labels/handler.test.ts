import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import { list_labels } from './handler.js';
import { output } from './schema.js';

function fakeGmail(labels: gmail_v1.Schema$Label[]): gmail_v1.Gmail {
  return {
    users: { labels: { list: async () => ({ data: { labels } }) } },
  } as unknown as gmail_v1.Gmail;
}

describe('list_labels', () => {
  it('projects REST labels onto the documented shape (id -> labelId)', async () => {
    const gmail = fakeGmail([
      { id: 'INBOX', name: 'INBOX', type: 'system' },
      { id: 'Label_1', name: 'Work', color: { textColor: '#000000', backgroundColor: '#ffffff' } },
    ]);

    const result = await list_labels.handler(gmail, {});

    expect(result.labels).toHaveLength(2);
    expect(result.labels[0]).toMatchObject({ labelId: 'INBOX', name: 'INBOX' });
    expect(result.labels[1]?.color).toEqual({ textColor: '#000000', backgroundColor: '#ffffff' });
    expect(() => output.parse(result)).not.toThrow();
  });
});
