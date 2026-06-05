import type { gmail_v1 } from 'googleapis';
import { makeDefineTool } from '@google-mcp/harness';

/** The Gmail tool factory: binds the shared factory to the Gmail client type. */
export const defineTool = makeDefineTool<gmail_v1.Gmail>();
