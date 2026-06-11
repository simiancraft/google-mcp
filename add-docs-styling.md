# Plan: the Docs styling expansion

Self-destructs on ship. First slice of issue #35.

## Goal

Four styling operations join the Docs wing (5 → 9), each wrapping
`documents.batchUpdate` with one request through the existing
`lib/batch.ts`: `update_text_style` (curated TextStyle: bold, italic,
underline, strikethrough, smallCaps, baselineOffset, fontSize in points,
link url; the FieldMask is derived from the keys the caller provides),
`update_paragraph_style` (namedStyleType, alignment, lineSpacing),
`create_paragraph_bullets` (the full 15-preset enum), and
`delete_paragraph_bullets`. Counts, COVERAGE, README, instructions, and
issue #35's body update; live pairwise verification appends to matrix #41;
the review panel loops until satisfied; PR merges. Colors, font families,
indents, borders, and shading stay in #35.

## Decisions

1. **FieldMask from keys.** Both update requests require `fields` ("At
   least one field must be specified"); the handler derives it from the
   style object's provided keys (camelCase JSON names), so the caller
   cannot desync mask and values. The schemas require at least one style
   key (zod refine; stated in the describe since refinements do not emit).
2. **Setting false ≠ omitting.** `bold: false` is in the mask and turns
   bold off; omitting `bold` leaves it untouched. Stated in the entity
   describes.
3. **fontSize flattens Dimension to points**: the API's only unit is PT
   (the enum has one value), so `fontSize: 12` replaces
   `{ magnitude: 12, unit: 'PT' }`; documented at the field.
4. **Link curates to `{ url }`** (tab/bookmark/heading links ride with
   #36's tab work).
5. **Annotations**: both updates and `create_paragraph_bullets` are
   non-destructive and idempotent (re-applying the same style or preset is
   a no-op); `delete_paragraph_bullets` is a removal → destructive true,
   idempotent true (bullets occupy no body indices; a repeat is a no-op).
6. **Entities**: `TextStyle` and `ParagraphStyle` (curated, named REST
   objects); the bullet preset enum stays inline (single use). `Range` and
   `BatchUpdateReceipt` are reused.

## Commits

1. `docs(docs): add the docs styling plan` (+ draft PR)
2. `feat(docs): add the text styling operation`
3. `feat(docs): add the paragraph styling operation`
4. `feat(docs): add the bullet operations`
5. `docs(docs): document the styling expansion` (counts 9 everywhere,
   COVERAGE row + "the other 33", instructions sentence, #35 body)
6. live pass on all three accounts → matrix #41 updated;
   `docs(docs): delete the shipped plan`

Gate: `bun run check` green and branch pushed at every commit.
