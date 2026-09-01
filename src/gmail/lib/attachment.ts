import { open } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { assertWithinDownloadCap, MIB_LABEL } from '../../lib/limits.js';
import { ownLookup } from '../../lib/utils/lookup.js';
import type { AttachmentFile } from '../entities/AttachmentFile.js';
import { headerParamSafe } from './headers.js';

/**
 * Extension -> MIME type for the attachment types agents actually send.
 * Deliberately small: an unlisted extension degrades to
 * application/octet-stream, which every mail client treats as "download me",
 * never a wrong rendering. Keyed lowercase, without the dot.
 */
const MIME_TYPES: Record<string, string> = {
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  html: 'text/html',
  ics: 'text/calendar',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  json: 'application/json',
  md: 'text/markdown',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  png: 'image/png',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  wav: 'audio/wav',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml',
  zip: 'application/zip',
};

const FALLBACK_MIME_TYPE = 'application/octet-stream';

/**
 * The `attachments` parameter description, shared by the three compose
 * schemas (create_draft, update_draft, send_message) so the wording and the
 * interpolated cap cannot drift between them or from the constant.
 */
export const ATTACHMENTS_PARAM_DESCRIPTION =
  'Local files to attach; the server reads each path and assembles the MIME message. ' +
  'Attachments are delivered as downloads, not inline images (no cid: references). ' +
  `Combined size is capped at ${MIB_LABEL}.`;

/** MIME type for a filename, by extension; octet-stream when unrecognized. */
export function mimeTypeForExtension(filename: string): string {
  const extension = extname(filename).slice(1).toLowerCase();
  return ownLookup(MIME_TYPES, extension) ?? FALLBACK_MIME_TYPE;
}

/**
 * An attachment loaded and encoded for MIME assembly: `data` is standard
 * base64 (the RFC 2045 content-transfer-encoding, not the base64url the API's
 * outer `raw` field uses), folded to 76-character lines because the builder
 * emits the string verbatim and an unfolded multi-megabyte line breaks the
 * RFC 5322 line-length limit.
 */
export type MimeAttachment = { filename: string; contentType: string; data: string };

/** Fold a base64 string to 76-character CRLF-separated lines (RFC 2045 §6.8). */
export function foldBase64(base64: string): string {
  return base64.match(/.{1,76}/g)?.join('\r\n') ?? '';
}

const CAP_OPTIONS = {
  subject: 'The combined attachment payload',
  action: 'compose attachments',
  deferral: 'https://github.com/simiancraft/google-mcp-suite/issues/103',
} as const;

/**
 * Read attachment specs from disk into MIME-ready parts. The combined decoded
 * size is capped at the suite's shared JSON-transfer ceiling; that bounds
 * what this process buffers, not what Gmail accepts (base64 inflates the
 * encoded message ~4/3, so sends near the cap can still be refused by
 * Google; the band past the cap is deferred to issue #103). Each path is
 * stat-checked first: only regular files are read (a FIFO or device file
 * would block or grow unbounded), and an oversize total refuses before the
 * offending file is buffered. Returns undefined when there is nothing to
 * attach.
 */
export async function loadAttachments(
  specs: AttachmentFile[] | undefined,
): Promise<MimeAttachment[] | undefined> {
  if (!specs?.length) {
    return undefined;
  }
  let total = 0;
  const out: MimeAttachment[] = [];
  for (const spec of specs) {
    const file = await open(spec.path, 'r');
    let bytes: Buffer;
    try {
      const stats = await file.stat();
      if (!stats.isFile()) {
        throw new Error(`Attachment path ${spec.path} is not a regular file.`);
      }
      total += stats.size;
      assertWithinDownloadCap(total, CAP_OPTIONS);
      bytes = await file.readFile();
      // Re-check what actually arrived: a file that grew between stat and
      // read must not slip past the ceiling the stat check enforced.
      total += bytes.byteLength - stats.size;
      assertWithinDownloadCap(total, CAP_OPTIONS);
    } finally {
      await file.close();
    }
    // A name that sanitizes to nothing still needs a header value; 'attachment'
    // keeps the part well-formed and the recipient's client offers a download.
    const filename = headerParamSafe(spec.filename ?? basename(spec.path)) || 'attachment';
    out.push({
      filename,
      // The type is inferred from the path's extension (the recipient-facing
      // filename may legitimately carry none), falling back after sanitization
      // so the builder never sees an empty content type.
      contentType:
        headerParamSafe(spec.mimeType ?? mimeTypeForExtension(basename(spec.path))) ||
        FALLBACK_MIME_TYPE,
      data: foldBase64(bytes.toString('base64')),
    });
  }
  return out;
}
