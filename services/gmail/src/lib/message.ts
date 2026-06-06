import addressparser from 'addressparser';
import type { gmail_v1 } from 'googleapis';
import { createMimeMessage } from 'mail-mime-builder';
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

type ParsedAddress = ReturnType<typeof addressparser>[number];

/**
 * Parse an address-list header into bare email addresses. RFC 5322 tokenization
 * (quoted display names, escaped commas, group syntax) is deferred to
 * addressparser; a naive `.split(',')` mis-parses `"Doe, John" <j@x.com>` into
 * two broken tokens. Display names are dropped: the field is documented as
 * addresses, and bare addresses are the unambiguous, deterministic projection.
 */
function addresses(value?: string): string[] {
  if (!value) {
    return [];
  }
  const out: string[] = [];
  const collect = (entries: ParsedAddress[]): void => {
    for (const entry of entries) {
      if (entry.group) {
        collect(entry.group);
      } else if (entry.address) {
        out.push(entry.address);
      }
    }
  };
  collect(addressparser(value));
  return out;
}

/** The single sender's bare email address (display name dropped), or undefined. */
function senderAddress(value?: string): string | undefined {
  return addresses(value)[0];
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
    sender: senderAddress(headers.from),
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

/**
 * Build an RFC 822 message and base64url-encode it for the Gmail API, via
 * mail-mime-builder (RFC 2822/2045/2049 compliant: encoded-word headers,
 * multipart, transfer encoding). `from` is required by the builder; pass the
 * authenticated account's address.
 */
export function buildRawMessage(args: {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  htmlBody?: string;
  inReplyTo?: string;
}): string {
  const msg = createMimeMessage();
  msg.setSender(args.from);
  msg.setTo(args.to);
  if (args.cc?.length) {
    msg.setCc(args.cc);
  }
  if (args.bcc?.length) {
    msg.setBcc(args.bcc);
  }
  // Subject is a required header for the builder; default to empty when omitted.
  msg.setSubject(args.subject ?? '');
  if (args.inReplyTo) {
    msg.setHeader('In-Reply-To', args.inReplyTo);
    msg.setHeader('References', args.inReplyTo);
  }
  if (args.body !== undefined) {
    msg.addMessage({ contentType: 'text/plain', data: args.body });
  }
  if (args.htmlBody !== undefined) {
    msg.addMessage({ contentType: 'text/html', data: args.htmlBody });
  }
  if (args.body === undefined && args.htmlBody === undefined) {
    msg.addMessage({ contentType: 'text/plain', data: '' });
  }
  // Base64url the RFC 822 text ourselves (the format the Gmail API expects),
  // rather than the library's asEncoded(), whose output is not URL-safe base64.
  return Buffer.from(msg.asRaw()).toString('base64url');
}
