import type { gmail_v1 } from '@googleapis/gmail';
import type { Label } from '../entities/Label.js';

/** Project a raw Gmail label onto the documented Label shape (id -> labelId). */
export function projectLabel(label: gmail_v1.Schema$Label): Label {
  return {
    labelId: label.id ?? '',
    name: label.name ?? '',
    color: label.color
      ? {
          textColor: label.color.textColor ?? '',
          backgroundColor: label.color.backgroundColor ?? '',
        }
      : undefined,
    threadsTotal: label.threadsTotal ?? undefined,
    threadsUnread: label.threadsUnread ?? undefined,
  };
}
