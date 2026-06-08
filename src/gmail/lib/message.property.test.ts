import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from '@googleapis/gmail';
import fc from 'fast-check';
import { Message } from '../entities/Message.js';
import { projectMessage } from './message.js';

const b64 = (s: string) => Buffer.from(s).toString('base64url');

/** Strings that survive a utf8 base64url round-trip (excludes lone surrogates). */
const roundTrippable = fc.string().filter((s) => Buffer.from(s, 'utf8').toString('utf8') === s);

/** An arbitrary Gmail payload tree: leaf content/attachment parts under multipart containers. */
const { part } = fc.letrec<{ part: gmail_v1.Schema$MessagePart }>((tie) => ({
  part: fc.oneof(
    { maxDepth: 4, depthSize: 'small' },
    fc.record(
      {
        mimeType: fc.constantFrom('text/plain', 'text/html', 'application/pdf', 'image/png'),
        body: fc.oneof(
          fc.record({ data: roundTrippable.map(b64) }),
          fc.record({ attachmentId: fc.string({ minLength: 1 }) }),
        ),
      },
      // mimeType may be absent (rather than present-and-undefined) so the
      // arbitrary matches Schema$MessagePart under exactOptionalPropertyTypes.
      { requiredKeys: ['body'] },
    ),
    fc.record({
      mimeType: fc.constantFrom('multipart/mixed', 'multipart/alternative', 'multipart/related'),
      parts: fc.array(tie('part'), { maxLength: 4 }),
    }),
  ),
}));

/** Count attachment ids in a tree (a plain traversal, independent of the projection). */
function countAttachments(p: gmail_v1.Schema$MessagePart): number {
  const here = p.body?.attachmentId ? 1 : 0;
  return here + (p.parts ?? []).reduce((sum, child) => sum + countAttachments(child), 0);
}

describe('projectMessage (property)', () => {
  it('never throws and always yields a schema-valid Message', () => {
    fc.assert(
      fc.property(part, (payload) => {
        const result = projectMessage({ id: 'M1', payload });
        Message.parse(result);
      }),
      { numRuns: 500 },
    );
  });

  it('recovers a top-level text/plain body verbatim, including non-ASCII', () => {
    fc.assert(
      fc.property(
        roundTrippable.filter((s) => s.length > 0),
        (text) => {
          const result = projectMessage({
            id: 'M1',
            payload: { mimeType: 'text/plain', body: { data: b64(text) } },
          });
          expect(result.plaintextBody).toBe(text);
        },
      ),
    );
  });

  it('surfaces every attachment id in the tree', () => {
    fc.assert(
      fc.property(part, (payload) => {
        const result = projectMessage({ id: 'M1', payload });
        expect(result.attachmentIds?.length ?? 0).toBe(countAttachments(payload));
      }),
    );
  });
});

describe('projectMessage address projection (property)', () => {
  /** A display name safe to drop into a header without breaking address syntax. */
  const safeName = fc.string().map((s) => s.replace(/[",<>@:;()\\]/g, '').trim());

  it('every recipient has a non-empty address and never an empty name', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(safeName, fc.emailAddress()), { maxLength: 20 }), (entries) => {
        const value = entries
          .map(([name, email]) => (name ? `${name} <${email}>` : email))
          .join(', ');
        const result = projectMessage({ id: 'M1', payload: { headers: [{ name: 'To', value }] } });
        for (const recipient of result.toRecipients ?? []) {
          expect(recipient.address.length).toBeGreaterThan(0);
          expect(recipient.name).not.toBe('');
        }
      }),
    );
  });
});
