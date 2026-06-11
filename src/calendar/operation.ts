import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { type Operation, operation } from '../lib/operation.js';

/**
 * `operation()` bound to the Calendar client. Every calendar op's `index.ts` uses
 * this instead of the raw `operation()` so the handler's client is always
 * `calendar_v3.Calendar`: a handler that drops or mistypes its client annotation
 * fails here (the client can no longer silently infer `unknown` and slip into the
 * registry) rather than surfacing as a confusing `unknown` deep in the body.
 */
export const calendarOperation = <In extends z.ZodObject, Out extends z.ZodObject>(
  def: Operation<calendar_v3.Calendar, In, Out>,
): Operation<calendar_v3.Calendar, In, Out> => operation(def);
