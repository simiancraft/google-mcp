import type { gmail_v1 } from 'googleapis';
import type { Draft } from '../entities/Draft.js';
import type { Message } from '../entities/Message.js';

/** Lowercased header name -> value, from a message payload. */
function headerMap(payload?: gmail_v1.Schema$MessagePart): Record<string, string> {
  const map: Record<string, string> = {};
  for (const header of payload?.headers ?? []) {
    if (header.name && header.value) {
      map[header.name.toLowerCase()] = header.value;
    }
  }
  return map;
}

/** Split a comma-separated address header into trimmed addresses. */
function addresses(value?: string): string[] {
  return value
    ? value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean)
    : [];
}

function decodeBody(data?: string | null): string {
  return data ? Buffer.from(data, 'base64url').toString('utf8') : '';
}

type Bodies = { plain?: string; html?: string };

/**
 * Walk the MIME tree collecting the first text/plain and first text/html parts.
 * Both are surfaced (an intentional extension beyond Google's plaintext-only
 * projection): callers need plain and HTML bodies extracted reliably.
 */
function collectBodies(part: gmail_v1.Schema$MessagePart | undefined, acc: Bodies): void {
  if (!part) {
    return;
  }
  if (part.body?.data) {
    if (part.mimeType === 'text/plain' && acc.plain === undefined) {
      acc.plain = decodeBody(part.body.data);
    } else if (part.mimeType === 'text/html' && acc.html === undefined) {
      acc.html = decodeBody(part.body.data);
    }
  }
  for (const child of part.parts ?? []) {
    collectBodies(child, acc);
  }
}

/** Walk the MIME tree collecting attachment ids. */
function collectAttachmentIds(part: gmail_v1.Schema$MessagePart | undefined, ids: string[]): void {
  if (!part) {
    return;
  }
  if (part.body?.attachmentId) {
    ids.push(part.body.attachmentId);
  }
  for (const child of part.parts ?? []) {
    collectAttachmentIds(child, ids);
  }
}

/** Project a raw Gmail message onto the documented Message shape. */
export function projectMessage(message: gmail_v1.Schema$Message): Message {
  const headers = headerMap(message.payload);
  const attachmentIds: string[] = [];
  collectAttachmentIds(message.payload, attachmentIds);
  const bodies: Bodies = {};
  collectBodies(message.payload, bodies);
  return {
    id: message.id ?? '',
    snippet: message.snippet ?? undefined,
    subject: headers.subject,
    sender: headers.from,
    toRecipients: addresses(headers.to),
    ccRecipients: addresses(headers.cc),
    date: headers.date,
    plaintextBody: bodies.plain || undefined,
    htmlBody: bodies.html || undefined,
    attachmentIds: attachmentIds.length ? attachmentIds : undefined,
  };
}

/** Project a raw Gmail draft onto the documented Draft shape. */
export function projectDraft(draft: gmail_v1.Schema$Draft): Draft {
  const message = draft.message;
  const headers = headerMap(message?.payload);
  const bodies: Bodies = {};
  collectBodies(message?.payload, bodies);
  return {
    id: draft.id ?? '',
    threadId: message?.threadId ?? undefined,
    subject: headers.subject,
    toRecipients: addresses(headers.to),
    ccRecipients: addresses(headers.cc),
    bccRecipients: addresses(headers.bcc),
    plaintextBody: bodies.plain || undefined,
    htmlBody: bodies.html || undefined,
    date: headers.date,
  };
}

/** Build an RFC 822 message and base64url-encode it for the Gmail API. */
export function buildRawMessage(args: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  htmlBody?: string;
  inReplyTo?: string;
}): string {
  const headers: string[] = [`To: ${args.to.join(', ')}`];
  if (args.cc?.length) {
    headers.push(`Cc: ${args.cc.join(', ')}`);
  }
  if (args.bcc?.length) {
    headers.push(`Bcc: ${args.bcc.join(', ')}`);
  }
  if (args.subject) {
    headers.push(`Subject: ${args.subject}`);
  }
  if (args.inReplyTo) {
    headers.push(`In-Reply-To: ${args.inReplyTo}`);
    headers.push(`References: ${args.inReplyTo}`);
  }
  headers.push('MIME-Version: 1.0');

  let body: string;
  if (args.htmlBody && args.body) {
    const boundary = `bnd_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    body = [
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      args.body,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      '',
      args.htmlBody,
      '',
      `--${boundary}--`,
      '',
    ].join('\r\n');
  } else if (args.htmlBody) {
    headers.push('Content-Type: text/html; charset="UTF-8"');
    body = args.htmlBody;
  } else {
    headers.push('Content-Type: text/plain; charset="UTF-8"');
    body = args.body ?? '';
  }

  return Buffer.from(`${headers.join('\r\n')}\r\n\r\n${body}`).toString('base64url');
}
