import { describe, expect, it } from 'bun:test';
import {
  projectProtectedRange,
  toConditionalFormatRule,
  toConditionValue,
  toDataValidationRule,
  toEditors,
} from './rules.js';

describe('toConditionValue', () => {
  it('carries a literal value', () => {
    expect(toConditionValue({ userEnteredValue: '=B1' })).toEqual({ userEnteredValue: '=B1' });
  });

  it('carries a relative date', () => {
    expect(toConditionValue({ relativeDate: 'PAST_WEEK' })).toEqual({ relativeDate: 'PAST_WEEK' });
  });

  it('refuses both set and neither set', () => {
    expect(() => toConditionValue({})).toThrow('exactly one of userEnteredValue or relativeDate');
    expect(() => toConditionValue({ userEnteredValue: '1', relativeDate: 'TODAY' })).toThrow(
      'exactly one of userEnteredValue or relativeDate',
    );
  });
});

describe('toConditionalFormatRule', () => {
  it('carries a boolean rule with condition values', () => {
    expect(
      toConditionalFormatRule({
        ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 10 }],
        booleanRule: {
          condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '100' }] },
          format: { textFormat: { bold: true } },
        },
      }),
    ).toEqual({
      ranges: [{ sheetId: 3, startRowIndex: 1, endRowIndex: 10 }],
      booleanRule: {
        condition: { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '100' }] },
        format: { textFormat: { bold: true } },
      },
    });
  });

  it('carries a gradient rule, dropping the absent midpoint', () => {
    expect(
      toConditionalFormatRule({
        ranges: [{ sheetId: 0 }],
        gradientRule: {
          minpoint: { colorStyle: { rgbColor: { red: 1 } }, type: 'MIN' },
          maxpoint: { colorStyle: { rgbColor: { green: 1 } }, type: 'PERCENTILE', value: '90' },
        },
      }),
    ).toEqual({
      ranges: [{ sheetId: 0 }],
      gradientRule: {
        minpoint: { colorStyle: { rgbColor: { red: 1 } }, type: 'MIN' },
        maxpoint: { colorStyle: { rgbColor: { green: 1 } }, type: 'PERCENTILE', value: '90' },
      },
    });
  });

  it('refuses a rule with both or neither of booleanRule and gradientRule', () => {
    expect(() => toConditionalFormatRule({ ranges: [{ sheetId: 0 }] })).toThrow(
      'exactly one of booleanRule or gradientRule',
    );
    expect(() =>
      toConditionalFormatRule({
        ranges: [{ sheetId: 0 }],
        booleanRule: {
          condition: { type: 'NOT_BLANK' },
          format: {},
        },
        gradientRule: {
          minpoint: { colorStyle: { rgbColor: {} }, type: 'MIN' },
          maxpoint: { colorStyle: { rgbColor: {} }, type: 'MAX' },
        },
      }),
    ).toThrow('exactly one of booleanRule or gradientRule');
  });
});

describe('toDataValidationRule', () => {
  it('carries the condition and the optional flags provided', () => {
    expect(
      toDataValidationRule({
        condition: {
          type: 'ONE_OF_LIST',
          values: [{ userEnteredValue: 'never' }, { userEnteredValue: '5.50@18' }],
        },
        strict: true,
        showCustomUi: true,
      }),
    ).toEqual({
      condition: {
        type: 'ONE_OF_LIST',
        values: [{ userEnteredValue: 'never' }, { userEnteredValue: '5.50@18' }],
      },
      strict: true,
      showCustomUi: true,
    });
  });
});

describe('toEditors', () => {
  it('drops absent fields', () => {
    expect(toEditors({ users: ['a@example.com'] })).toEqual({ users: ['a@example.com'] });
  });
});

describe('projectProtectedRange', () => {
  it('cleans nulls to undefined at every level', () => {
    expect(
      projectProtectedRange({
        protectedRangeId: 12,
        range: { sheetId: 0, startRowIndex: null, endRowIndex: 5 },
        namedRangeId: null,
        description: 'inputs only',
        warningOnly: null,
        requestingUserCanEdit: true,
        unprotectedRanges: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }],
        editors: { users: ['a@example.com'], groups: null, domainUsersCanEdit: null },
      }),
    ).toEqual({
      protectedRangeId: 12,
      range: {
        sheetId: 0,
        startRowIndex: undefined,
        endRowIndex: 5,
        startColumnIndex: undefined,
        endColumnIndex: undefined,
      },
      namedRangeId: undefined,
      description: 'inputs only',
      warningOnly: undefined,
      requestingUserCanEdit: true,
      unprotectedRanges: [
        {
          sheetId: 0,
          startRowIndex: undefined,
          endRowIndex: undefined,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
      ],
      editors: { users: ['a@example.com'], groups: undefined, domainUsersCanEdit: undefined },
    });
  });
});
