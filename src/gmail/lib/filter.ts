import type { gmail_v1 } from '@googleapis/gmail';
import { narrow } from '../../lib/utils/narrow.js';
import type { Filter } from '../entities/Filter.js';
import { FilterCriteria } from '../entities/FilterCriteria.js';

/** Project a raw Gmail filter onto the Filter shape, dropping nulls. */
export function projectFilter(filter: gmail_v1.Schema$Filter): Filter {
  return {
    id: filter.id ?? '',
    criteria: {
      from: filter.criteria?.from ?? undefined,
      to: filter.criteria?.to ?? undefined,
      subject: filter.criteria?.subject ?? undefined,
      query: filter.criteria?.query ?? undefined,
      negatedQuery: filter.criteria?.negatedQuery ?? undefined,
      hasAttachment: filter.criteria?.hasAttachment ?? undefined,
      excludeChats: filter.criteria?.excludeChats ?? undefined,
      size: filter.criteria?.size ?? undefined,
      sizeComparison: narrow(
        filter.criteria?.sizeComparison,
        FilterCriteria.shape.sizeComparison.unwrap().options,
      ),
    },
    action: {
      addLabelIds: filter.action?.addLabelIds ?? undefined,
      removeLabelIds: filter.action?.removeLabelIds ?? undefined,
      forward: filter.action?.forward ?? undefined,
    },
  };
}
