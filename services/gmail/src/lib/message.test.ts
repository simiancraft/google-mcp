import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { buildRawMessage, projectDraft, projectMessage } from './message.js';

const decode = (raw: string) => Buffer.from(raw, 'base64url').toString('utf8');
const b64 = (s: string) => Buffer.from(s).toString('base64url');

describe('buildRawMessage', () => {
  const from = 'me@example.com';

  it('plain-text only, with From and To', () => {
    const out = decode(buildRawMessage({ from, to: ['a@b.com'], subject: 'S', body: 'plain' }));
    expect(out).toContain('From: <me@example.com>');
    expect(out).toContain('a@b.com');
    expect(out).toContain('Content-Type: text/plain');
    expect(out).toContain('plain');
  });

  it('HTML only', () => {
    const out = decode(buildRawMessage({ from, to: ['a@b.com'], htmlBody: '<b>hi</b>' }));
    expect(out).toContain('Content-Type: text/html');
    expect(out).toContain('<b>hi</b>');
  });

  it('multipart/alternative when both bodies given, with cc/bcc and reply headers', () => {
    const out = decode(
      buildRawMessage({
        from,
        to: ['a@b.com'],
        cc: ['c@b.com'],
        bcc: ['d@b.com'],
        body: 'plain',
        htmlBody: '<b>hi</b>',
        inReplyTo: '<x@y>',
      }),
    );
    expect(out).toContain('Content-Type: multipart/alternative');
    expect(out).toContain('c@b.com');
    expect(out).toContain('d@b.com');
    expect(out).toContain('In-Reply-To: <x@y>');
    expect(out).toContain('References: <x@y>');
    expect(out).toContain('plain');
    expect(out).toContain('<b>hi</b>');
  });

  it('RFC 2047-encodes a non-ASCII subject (the hand-rolled builder could not)', () => {
    const out = decode(buildRawMessage({ from, to: ['a@b.com'], subject: '🚀 Launch', body: 'x' }));
    expect(out).toMatch(/Subject: =\?utf-8\?B\?/i);
    expect(out).not.toContain('Subject: 🚀 Launch');
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

describe('projectMessage address parsing', () => {
  const withHeaders = (headers: { name: string; value: string }[]): gmail_v1.Schema$Message => ({
    id: 'M1',
    payload: { headers },
  });

  it('keeps a comma in a quoted display name as one address', () => {
    const result = projectMessage(
      withHeaders([{ name: 'To', value: '"Doe, John" <john@x.com>, jane@y.com' }]),
    );
    expect(result.toRecipients).toEqual(['john@x.com', 'jane@y.com']);
  });

  it('projects the sender to a bare address, dropping the display name', () => {
    const result = projectMessage(withHeaders([{ name: 'From', value: 'Jane Roe <jane@y.com>' }]));
    expect(result.sender).toBe('jane@y.com');
  });

  it('flattens an RFC 5322 group into its member addresses', () => {
    const result = projectMessage(withHeaders([{ name: 'Cc', value: 'Team: a@x.com, b@y.com;' }]));
    expect(result.ccRecipients).toEqual(['a@x.com', 'b@y.com']);
  });

  it('yields empty recipient lists for absent headers', () => {
    const result = projectMessage(withHeaders([]));
    expect(result.toRecipients).toEqual([]);
    expect(result.ccRecipients).toEqual([]);
    expect(result.sender).toBeUndefined();
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
