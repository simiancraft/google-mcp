import { Readable } from 'node:stream';
import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { ownLookup } from '../../../lib/utils/lookup.js';
import { projectFile, TOOL_FILE_FIELDS } from '../../lib/file.js';
import type { schema } from './schema.js';

/** The documented auto-conversions from uploaded content types to Google editor types. */
const CONVERSIONS: Record<string, string> = {
  'text/plain': 'application/vnd.google-apps.document',
  'text/csv': 'application/vnd.google-apps.spreadsheet',
};

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  // The cross-field rules (textContent XOR base64Content; contentMimeType
  // required with content) are schema refines, rejected before dispatch.
  const hasContent = args.textContent !== undefined || args.base64Content !== undefined;

  // Converting an upload means creating the file as the Google editor type
  // while the media carries the uploaded content type.
  const converted =
    hasContent && !args.disableConversionToGoogleType && args.contentMimeType
      ? ownLookup(CONVERSIONS, args.contentMimeType)
      : undefined;

  const requestBody = forGoogle({
    name: args.title,
    parents: args.parentId ? [args.parentId] : undefined,
    mimeType: converted ?? (hasContent ? undefined : args.contentMimeType),
  });

  const { data } = await drive.files.create(
    forGoogle({
      requestBody,
      media:
        hasContent && args.contentMimeType
          ? {
              mimeType: args.contentMimeType,
              body:
                args.textContent !== undefined
                  ? args.textContent
                  : Readable.from(Buffer.from(args.base64Content ?? '', 'base64')),
            }
          : undefined,
      fields: TOOL_FILE_FIELDS,
      supportsAllDrives: true,
    }),
  );
  return projectFile(data);
}
