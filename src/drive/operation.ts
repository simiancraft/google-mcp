import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { type Operation, operation } from '../lib/operation.js';

/**
 * `operation()` bound to the Drive client. Every drive op's `index.ts` uses
 * this instead of the raw `operation()` so the handler's client is always
 * `drive_v3.Drive`: a handler that drops or mistypes its client annotation
 * fails here (the client can no longer silently infer `unknown` and slip into
 * the registry) rather than surfacing as a confusing `unknown` deep in the body.
 */
export const driveOperation = <In extends z.ZodObject, Out extends z.ZodObject>(
  def: Operation<drive_v3.Drive, In, Out>,
): Operation<drive_v3.Drive, In, Out> => operation(def);
