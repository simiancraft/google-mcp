import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { isGoogleNative, isTextLike, textExportMime } from '../../lib/content.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data: meta } = await drive.files.get({
    fileId: args.fileId,
    fields: 'id,mimeType',
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
  const res = await drive.files.get(
    { fileId: args.fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' },
  );
  return { fileContent: Buffer.from(res.data as ArrayBuffer).toString('utf8') };
}
