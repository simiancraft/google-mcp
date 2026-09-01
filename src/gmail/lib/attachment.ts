import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { assertWithinDownloadCap, MAX_DOWNLOAD_BYTES } from '../../lib/limits.js';
import { ownLookup } from '../../lib/utils/lookup.js';
import type { AttachmentFile } from '../entities/AttachmentFile.js';
import { stripBreaks } from './headers.js';

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
  `Combined size is capped at ${MAX_DOWNLOAD_BYTES / (1024 * 1024)} MiB.`;

/** MIME type for a filename, by extension; octet-stream when unrecognized. */
export function sniffMimeType(filename: string): string {
  const extension = extname(filename).slice(1).toLowerCase();
  return ownLookup(MIME_TYPES, extension) ?? FALLBACK_MIME_TYPE;
}

/**
 * Make a value safe for a MIME header parameter: strip control characters
 * (header injection) plus double quotes and backslashes, which the MIME
 * builder interpolates unescaped into `name="..."` / `filename="..."`.
 */
export function headerParamSafe(value: string): string {
  return stripBreaks(value).replaceAll('"', '').replaceAll('\\', '');
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

/**
 * Read attachment specs from disk into MIME-ready parts. The combined decoded
 * size is capped at the suite ceiling (25 MiB, which is also Gmail's own
 * message maximum for the non-resumable send path); the cap is checked as a
 * running total so an oversize batch fails before every file is buffered.
 * Returns undefined when there is nothing to attach.
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
    const bytes = await readFile(spec.path);
    total += bytes.byteLength;
    assertWithinDownloadCap(total, {
      subject: 'The combined attachment payload',
      action: 'compose attachments',
    });
    // A name that sanitizes to nothing still needs a header value; 'attachment'
    // keeps the part well-formed and the recipient's client offers a download.
    const filename = headerParamSafe(spec.filename ?? basename(spec.path)) || 'attachment';
    out.push({
      filename,
      contentType: headerParamSafe(spec.mimeType ?? sniffMimeType(filename)),
      data: foldBase64(bytes.toString('base64')),
    });
  }
  return out;
}
