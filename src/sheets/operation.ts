import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { type Operation, operation } from '../lib/operation.js';

/**
 * `operation()` bound to the Sheets client. Every sheets op's `index.ts` uses
 * this instead of the raw `operation()` so the handler's client is always
 * `sheets_v4.Sheets`: a handler that drops or mistypes its client annotation
 * fails here (the client can no longer silently infer `unknown` and slip into
 * the registry) rather than surfacing as a confusing `unknown` deep in the body.
 */
export const sheetsOperation = <In extends z.ZodType, Out extends z.ZodType>(
  def: Operation<sheets_v4.Sheets, In, Out>,
): Operation<sheets_v4.Sheets, In, Out> => operation(def);
