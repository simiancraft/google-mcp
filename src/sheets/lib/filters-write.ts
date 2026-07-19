import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import { narrow } from '../../lib/utils/narrow.js';
import type { BasicFilter } from '../entities/BasicFilter.js';
import { BooleanCondition } from '../entities/BooleanCondition.js';
import { ColorStyle } from '../entities/ColorStyle.js';
import { ConditionValue } from '../entities/ConditionValue.js';
import type { FilterCriteria } from '../entities/FilterCriteria.js';
import type { FilterSpec } from '../entities/FilterSpec.js';
import type { FilterView } from '../entities/FilterView.js';
import type { SortSpec } from '../entities/SortSpec.js';
import { toColorStyle } from './formats.js';
import { projectGridRange, toBooleanCondition } from './rules.js';

/** Carry an ordinary-grid SortSpec across the Google boundary. */
export function toSortSpec(spec: SortSpec): sheets_v4.Schema$SortSpec {
  return forGoogle({ dimensionIndex: spec.dimensionIndex, sortOrder: spec.sortOrder });
}

/**
 * Carry FilterCriteria across the Google boundary. The REST color fields are
 * mutually exclusive and accept only concrete RGB styles, not theme colors.
 */
export function toFilterCriteria(criteria: FilterCriteria): sheets_v4.Schema$FilterCriteria {
  if (
    criteria.visibleBackgroundColorStyle !== undefined &&
    criteria.visibleForegroundColorStyle !== undefined
  ) {
    throw new Error(
      'Provide at most one of visibleBackgroundColorStyle or visibleForegroundColorStyle in filter criteria.',
    );
  }
  for (const style of [
    criteria.visibleBackgroundColorStyle,
    criteria.visibleForegroundColorStyle,
  ]) {
    if (style?.themeColor !== undefined) {
      throw new Error('Provide an rgbColor, not a themeColor, for filter color criteria.');
    }
  }
  return forGoogle({
    hiddenValues: criteria.hiddenValues,
    condition: criteria.condition ? toBooleanCondition(criteria.condition) : undefined,
    visibleBackgroundColorStyle: criteria.visibleBackgroundColorStyle
      ? toColorStyle(criteria.visibleBackgroundColorStyle)
      : undefined,
    visibleForegroundColorStyle: criteria.visibleForegroundColorStyle
      ? toColorStyle(criteria.visibleForegroundColorStyle)
      : undefined,
  });
}

/** Carry an ordinary-grid FilterSpec across the Google boundary. */
export function toFilterSpec(spec: FilterSpec): sheets_v4.Schema$FilterSpec {
  return {
    filterCriteria: toFilterCriteria(spec.filterCriteria),
    columnIndex: spec.columnIndex,
  };
}

/** Carry a range- or named-range-backed FilterView across the boundary. */
export function toFilterView(filter: FilterView): sheets_v4.Schema$FilterView {
  if (filter.range !== undefined && filter.namedRangeId !== undefined) {
    throw new Error('Provide at most one of range or namedRangeId in a filter view.');
  }
  return forGoogle({
    filterViewId: filter.filterViewId,
    title: filter.title,
    range: filter.range ? forGoogle(filter.range) : undefined,
    namedRangeId: filter.namedRangeId,
    sortSpecs: filter.sortSpecs ? filter.sortSpecs.map(toSortSpec) : undefined,
    filterSpecs: filter.filterSpecs ? filter.filterSpecs.map(toFilterSpec) : undefined,
  });
}

/** Carry a range-backed BasicFilter across the Google boundary. */
export function toBasicFilter(filter: BasicFilter): sheets_v4.Schema$BasicFilter {
  return forGoogle({
    range: filter.range ? forGoogle(filter.range) : undefined,
    sortSpecs: filter.sortSpecs ? filter.sortSpecs.map(toSortSpec) : undefined,
    filterSpecs: filter.filterSpecs ? filter.filterSpecs.map(toFilterSpec) : undefined,
  });
}

function projectColorStyle(data: sheets_v4.Schema$ColorStyle): ColorStyle {
  return {
    rgbColor: data.rgbColor
      ? {
          red: data.rgbColor.red ?? undefined,
          green: data.rgbColor.green ?? undefined,
          blue: data.rgbColor.blue ?? undefined,
        }
      : undefined,
    themeColor: narrow(data.themeColor, ColorStyle.shape.themeColor.unwrap().options),
  };
}

/** Project a REST SortSpec without dropping an unknown upstream sort order. */
export function projectSortSpec(data: sheets_v4.Schema$SortSpec): SortSpec | undefined {
  if (data.dataSourceColumnReference) return undefined;
  const sortOrder = narrow(data.sortOrder, ['ASCENDING', 'DESCENDING'] as const);
  if (!sortOrder) return undefined;
  return {
    // proto3 may omit the zero-valued first-column index.
    dimensionIndex: data.dimensionIndex ?? 0,
    sortOrder,
  };
}

/** Project REST filter criteria, cleaning nulls and deprecated color fields. */
export function projectFilterCriteria(data: sheets_v4.Schema$FilterCriteria): FilterCriteria {
  const conditionType = narrow(data.condition?.type, BooleanCondition.shape.type.options);
  return {
    hiddenValues: data.hiddenValues ?? undefined,
    condition:
      data.condition && conditionType
        ? {
            type: conditionType,
            values: data.condition.values
              ? data.condition.values.map((value) => ({
                  relativeDate: narrow(
                    value.relativeDate,
                    ConditionValue.shape.relativeDate.unwrap().options,
                  ),
                  userEnteredValue: value.userEnteredValue ?? undefined,
                }))
              : undefined,
          }
        : undefined,
    visibleBackgroundColorStyle: data.visibleBackgroundColorStyle
      ? projectColorStyle(data.visibleBackgroundColorStyle)
      : data.visibleBackgroundColor
        ? projectColorStyle({ rgbColor: data.visibleBackgroundColor })
        : undefined,
    visibleForegroundColorStyle: data.visibleForegroundColorStyle
      ? projectColorStyle(data.visibleForegroundColorStyle)
      : data.visibleForegroundColor
        ? projectColorStyle({ rgbColor: data.visibleForegroundColor })
        : undefined,
  };
}

/** Project an ordinary-grid REST FilterSpec. */
export function projectFilterSpec(data: sheets_v4.Schema$FilterSpec): FilterSpec | undefined {
  if (data.dataSourceColumnReference) return undefined;
  return {
    // proto3 may omit the zero-valued first-column index.
    columnIndex: data.columnIndex ?? 0,
    filterCriteria: projectFilterCriteria(data.filterCriteria ?? {}),
  };
}

function projectFilterSpecs(
  specs: sheets_v4.Schema$FilterSpec[] | undefined,
  criteria: { [key: string]: sheets_v4.Schema$FilterCriteria } | null | undefined,
): FilterSpec[] | undefined {
  if (specs)
    return specs.flatMap((spec) => {
      const projected = projectFilterSpec(spec);
      return projected ? [projected] : [];
    });
  if (!criteria) return undefined;
  return Object.entries(criteria).map(([columnIndex, filterCriteria]) => ({
    columnIndex: Number(columnIndex),
    filterCriteria: projectFilterCriteria(filterCriteria),
  }));
}

/**
 * Project a REST FilterView. Every view is retained because filterViewId is
 * the identity consumed by update, duplicate, and delete operations.
 */
export function projectFilterView(data: sheets_v4.Schema$FilterView): FilterView {
  return {
    filterViewId: data.filterViewId ?? 0,
    title: data.title ?? undefined,
    range: data.range ? projectGridRange(data.range) : undefined,
    namedRangeId: data.namedRangeId ?? undefined,
    sortSpecs: data.sortSpecs
      ? data.sortSpecs.flatMap((spec) => {
          const projected = projectSortSpec(spec);
          return projected ? [projected] : [];
        })
      : undefined,
    filterSpecs: projectFilterSpecs(data.filterSpecs, data.criteria),
  };
}

/** Project a REST BasicFilter from a plain spreadsheets.get Sheet resource. */
export function projectBasicFilter(data: sheets_v4.Schema$BasicFilter): BasicFilter {
  return {
    range: data.range ? projectGridRange(data.range) : undefined,
    sortSpecs: data.sortSpecs
      ? data.sortSpecs.flatMap((spec) => {
          const projected = projectSortSpec(spec);
          return projected ? [projected] : [];
        })
      : undefined,
    filterSpecs: projectFilterSpecs(data.filterSpecs, data.criteria),
  };
}
