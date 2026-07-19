import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { BooleanCondition } from '../entities/BooleanCondition.js';
import type { BooleanRule } from '../entities/BooleanRule.js';
import type { ConditionalFormatRule } from '../entities/ConditionalFormatRule.js';
import type { ConditionValue } from '../entities/ConditionValue.js';
import type { DataValidationRule } from '../entities/DataValidationRule.js';
import type { Editors } from '../entities/Editors.js';
import type { GradientRule } from '../entities/GradientRule.js';
import type { GridRange } from '../entities/GridRange.js';
import type { InterpolationPoint } from '../entities/InterpolationPoint.js';
import type { ProtectedRange } from '../entities/ProtectedRange.js';
import { toCellFormat, toColorStyle } from './formats.js';

/**
 * Rule-noun carriers and projections: the reactive layer's entities
 * (conditions, conditional format rules, data validation, protected ranges)
 * crossing the Google boundary, with `forGoogle` at each level (see
 * optionality.ts) and the documented oneofs enforced here, once, like
 * formats.ts's `toColorStyle`.
 */

/**
 * Carry a ConditionValue across the Google boundary. Enforces the documented
 * oneof: a value is either a literal or a relative date, never both, never
 * neither.
 */
export function toConditionValue(value: ConditionValue): sheets_v4.Schema$ConditionValue {
  if ((value.relativeDate === undefined) === (value.userEnteredValue === undefined)) {
    throw new Error(
      'Provide exactly one of userEnteredValue or relativeDate in a condition value.',
    );
  }
  return forGoogle({
    relativeDate: value.relativeDate,
    userEnteredValue: value.userEnteredValue,
  });
}

/** Carry a BooleanCondition across the Google boundary. */
export function toBooleanCondition(condition: BooleanCondition): sheets_v4.Schema$BooleanCondition {
  return forGoogle({
    type: condition.type,
    values: condition.values ? condition.values.map(toConditionValue) : undefined,
  });
}

/** Carry a BooleanRule across the Google boundary. */
function toBooleanRule(rule: BooleanRule): sheets_v4.Schema$BooleanRule {
  return {
    condition: toBooleanCondition(rule.condition),
    format: toCellFormat(rule.format),
  };
}

/** Carry an InterpolationPoint across the Google boundary. */
function toInterpolationPoint(point: InterpolationPoint): sheets_v4.Schema$InterpolationPoint {
  return forGoogle({
    colorStyle: toColorStyle(point.colorStyle),
    type: point.type,
    value: point.value,
  });
}

/** Carry a GradientRule across the Google boundary. */
function toGradientRule(rule: GradientRule): sheets_v4.Schema$GradientRule {
  return forGoogle({
    minpoint: toInterpolationPoint(rule.minpoint),
    midpoint: rule.midpoint ? toInterpolationPoint(rule.midpoint) : undefined,
    maxpoint: toInterpolationPoint(rule.maxpoint),
  });
}

/**
 * Carry a ConditionalFormatRule across the Google boundary. Enforces the
 * documented oneof: a rule is either a boolean rule or a gradient rule.
 */
export function toConditionalFormatRule(
  rule: ConditionalFormatRule,
): sheets_v4.Schema$ConditionalFormatRule {
  if ((rule.booleanRule === undefined) === (rule.gradientRule === undefined)) {
    throw new Error(
      'Provide exactly one of booleanRule or gradientRule in a conditional format rule.',
    );
  }
  return forGoogle({
    ranges: rule.ranges.map((range) => forGoogle(range)),
    booleanRule: rule.booleanRule ? toBooleanRule(rule.booleanRule) : undefined,
    gradientRule: rule.gradientRule ? toGradientRule(rule.gradientRule) : undefined,
  });
}

/** Carry a DataValidationRule across the Google boundary. */
export function toDataValidationRule(
  rule: DataValidationRule,
): sheets_v4.Schema$DataValidationRule {
  return forGoogle({
    condition: toBooleanCondition(rule.condition),
    inputMessage: rule.inputMessage,
    strict: rule.strict,
    showCustomUi: rule.showCustomUi,
  });
}

/** Carry an Editors across the Google boundary. */
export function toEditors(editors: Editors): sheets_v4.Schema$Editors {
  return forGoogle({
    users: editors.users,
    groups: editors.groups,
    domainUsersCanEdit: editors.domainUsersCanEdit,
  });
}

/** Project a REST grid range, cleaning nulls to undefined. */
export function projectGridRange(data: sheets_v4.Schema$GridRange): GridRange {
  return {
    sheetId: data.sheetId ?? undefined,
    startRowIndex: data.startRowIndex ?? undefined,
    endRowIndex: data.endRowIndex ?? undefined,
    startColumnIndex: data.startColumnIndex ?? undefined,
    endColumnIndex: data.endColumnIndex ?? undefined,
  };
}

/** Project a REST protected range, cleaning nulls to undefined. */
export function projectProtectedRange(data: sheets_v4.Schema$ProtectedRange): ProtectedRange {
  return {
    protectedRangeId: data.protectedRangeId ?? undefined,
    range: data.range ? projectGridRange(data.range) : undefined,
    namedRangeId: data.namedRangeId ?? undefined,
    description: data.description ?? undefined,
    warningOnly: data.warningOnly ?? undefined,
    requestingUserCanEdit: data.requestingUserCanEdit ?? undefined,
    unprotectedRanges: data.unprotectedRanges
      ? data.unprotectedRanges.map(projectGridRange)
      : undefined,
    editors: data.editors
      ? {
          users: data.editors.users ?? undefined,
          groups: data.editors.groups ?? undefined,
          domainUsersCanEdit: data.editors.domainUsersCanEdit ?? undefined,
        }
      : undefined,
  };
}
