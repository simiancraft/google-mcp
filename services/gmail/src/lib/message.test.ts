import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { buildRawMessage, projectDraft, projectMessage } from './message.js';

const decode = (raw: string) => Buffer.from(raw, 'base64url').toString('utf8');
const b64 = (s: string) => Buffer.from(s).toString('base64url');

describe('buildRawMessage', () => {
  it('plain-text only', () => {
    const out = decode(buildRawMessage({ to: ['a@b.com'], subject: 'S', body: 'plain' }));
    expect(out).toContain('Content-Type: text/plain');
    expect(out).toContain('plain');
  });

  it('HTML only', () => {
    const out = decode(buildRawMessage({ to: ['a@b.com'], htmlBody: '<b>hi</b>' }));
    expect(out).toContain('Content-Type: text/html');
    expect(out).toContain('<b>hi</b>');
  });

  it('multipart/alternative when both bodies given, with cc/bcc and reply headers', () => {
    const out = decode(
      buildRawMessage({
        to: ['a@b.com'],
        cc: ['c@b.com'],
        bcc: ['d@b.com'],
        body: 'plain',
        htmlBody: '<b>hi</b>',
        inReplyTo: '<x@y>',
      }),
    );
    expect(out).toContain('Content-Type: multipart/alternative');
    expect(out).toContain('Cc: c@b.com');
    expect(out).toContain('Bcc: d@b.com');
    expect(out).toContain('In-Reply-To: <x@y>');
    expect(out).toContain('References: <x@y>');
    expect(out).toContain('plain');
    expect(out).toContain('<b>hi</b>');
  });
});

describe('projectMessage', () => {
  it('walks nested parts for both bodies and collects attachment ids', () => {
    const message: gmail_v1.Schema$Message = {
      id: 'M1',
      payload: {
        mimeType: 'multipart/mixed',
        headers: [{ name: 'From', value: 'a@b.com' }],
        parts: [
          {
            mimeType: 'multipart/alternative',
            parts: [
              { mimeType: 'text/plain', body: { data: b64('plain') } },
              { mimeType: 'text/html', body: { data: b64('<p>html</p>') } },
            ],
          },
          { mimeType: 'application/pdf', body: { attachmentId: 'ATT1' } },
        ],
      },
    };
    const result = projectMessage(message);
    expect(result).toMatchObject({
      id: 'M1',
      sender: 'a@b.com',
      plaintextBody: 'plain',
      htmlBody: '<p>html</p>',
      attachmentIds: ['ATT1'],
    });
  });
});

describe('projectDraft', () => {
  it('handles a missing message gracefully', () => {
    expect(projectDraft({ id: 'D1' })).toMatchObject({
      id: 'D1',
      toRecipients: [],
      ccRecipients: [],
      bccRecipients: [],
    });
  });
});
