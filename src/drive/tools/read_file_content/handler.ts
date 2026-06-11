import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import {
  isGoogleNative,
  isTextLike,
  MAX_DOWNLOAD_BYTES,
  textExportMime,
} from '../../lib/content.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data: meta } = await drive.files.get({
    fileId: args.fileId,
    fields: 'id,mimeType,size',
    supportsAllDrives: true,
  });
  const mimeType = meta.mimeType ?? '';

  if (isGoogleNative(mimeType)) {
    const exportMime = textExportMime(mimeType);
    if (!exportMime) {
      throw new Error(
        `${mimeType} has no text representation; use download_file_content with an exportMimeType.`,
      );
    }
    const res = await drive.files.export(
      { fileId: args.fileId, mimeType: exportMime },
      { responseType: 'arraybuffer' },
    );
    return { fileContent: Buffer.from(res.data as ArrayBuffer).toString('utf8') };
  }

  if (!isTextLike(mimeType)) {
    throw new Error(
      `${mimeType || 'unknown mime type'} is not a text type this server can render; ` +
        'use download_file_content for base64 bytes.',
    );
  }
  // The same ceiling download_file_content enforces: blobs buffer whole into a
  // JSON string, so an uncapped read is a self-inflicted OOM on a large CSV.
  const size = Number(meta.size ?? 0);
  if (size > MAX_DOWNLOAD_BYTES) {
    throw new Error(
      `File is ${size} bytes; this server caps content reads at ${MAX_DOWNLOAD_BYTES} bytes ` +
        '(25 MiB). Larger transfers are deferred to ' +
        'https://github.com/simiancraft/google-mcp-suite/issues/38.',
    );
  }
  const res = await drive.files.get(
    { fileId: args.fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' },
  );
  return { fileContent: Buffer.from(res.data as ArrayBuffer).toString('utf8') };
}
