# Back Office colour roles: designer decisions

Filled-in version of `designer-role-review.md`. Section A is unchanged. Every row in B–F has a decision.

**How decisions were made**
- Purpose was checked against `RestaurantUI/src/app` (local checkout `8337760cd68`): which CSS property and selector each palette colour is used on.
- Where the "nearest role" in the source table was a **component** token used for the wrong purpose (e.g. `border-select-disabled` for a generic border, `text-on-disabled` for non-disabled text, button tokens for non-buttons), the FOLD goes to the general role instead.
- A colour drawn with `background` but acting as a rule line (1px divs) folds to a **border** role.
- Status colour stays status (danger/warning/success); decorative hues fold to grayscale or brand.
- New roles are created only where a real purpose has no role: a tertiary text step, strong/mid/inverse borders, expanded table rows, overlays, on-fill tints, focus rings, shadows.
- **Engineering:** for rows marked "(verify)", confirm the selector's purpose while wiring; if it's a disabled state, use the `*-disabled` role instead.

---

## Designer decisions (all resolved 2026-10-08, revised 2026-10-09, hover added 2026-10)

Revised after the colour review (`steve-colour-review.html`), which checked every decision against the real screens. Changes are marked *rev. 2026-10-09* and listed in section H.

1. **Contrast: A, darken the role values.** `text-danger` #fa1616 (4.05) → **#9a261c** (red/30, 7.87). `text-warning` #fa9016 (2.32) → **#a85800** (5.17). `text/tertiary` → **#737380** (4.67). Only the text roles change. The bg, border and icon roles for danger and warning keep #fa1616 / #fa9016. No `*-strong` text roles are created. See "Role value changes" below. **Rev. 2026-10-09:** icons coloured with `color:` were grouped as text, so they use the icon roles and stay bright (H2), and the orange highlight icons move to brand (H1). Only real text darkens.
2. **Warning yellow: A, fold into orange warning.** #ffc061 header/footer → bg-warning-subtle, borders → border-warning, text → text-warning (#a85800). No caution roles. The compact Alert in the BOSS Figma file needs the same update. **Rev. 2026-10-09:** the 21 caution icons use `icon-warning` (orange #fa9016), not the darkened text colour (H2).
3. **Info blue: A, fold by purpose.** No info status family and no Info Callout variant. Links → `text-link`, active tabs/selected rows → brand, outlines → `border-focus`. **Rev. 2026-10-09:** blue tooltip grounds → `bg-tooltip` (dark grey, as in the Figma Tooltip), not brand navy (H8).
4. **Payroll status: SKIP** *(rev. 2026-10-09)*. The colour is set in `payrollDashboard.component.ts`, but no screen ever shows it, so the 2026-10-08 mapping would change nothing visible. Log the status colour code (and the dead #81c784 CSS) for removal (H7). *Original decision: A, colour only where action is needed.*
5. **Divider variants: 5a-A and 5b-A.** *Applied as a new `Color` variant property on the Figma Divider; see "Applied in Figma" §4.* Retire the Divider `brand-subtle` variant: instances are swapped to default first, and the variant is removed only after a separate explicit confirmation. **Removal confirmed 2026-10-09** (H9). `border/secondary` = #9a9aa3, so the Divider secondary variant gets lighter (was #5f6272).
6. **Marketing palette: B, keep everywhere.** The eight `$marketing-*` colours (#999999, #d77138, #555555, #b44e15, #336699, #8a322b, #b33431, #ebebeb) stay raw in every file, product screens included. They are a separate palette outside the role system, so Figma role changes won't reach them.
7. **Report total rules: A.** `border/strong` = #18191d, aliased to the same primitive as `text/primary`.

---

## A. Already decided (wiring only, no design input needed)

| Colour | Used as | Uses | Becomes |
|---|---|---:|---|
| #d3d8e0 | border | 544 | --boss-color-border-neutral |
| #5f6272 | text | 192 | --boss-color-text-secondary |
| #f8f8fa | background | 42 | --boss-color-bg-brand-subtle |
| #8d8d90 | text | 22 | --boss-color-text-disabled |

## B. Colours in our palette with no role

| Colour | Used as | Uses | Proposed Figma path | Decision | Reason |
|---|---|---:|---|---|---|
| #000000 | text | 146 | color/text/strong | FOLD --boss-color-text-primary | Modal headers, form text, selected toggle text: primary text. Pure black isn't intentional. |
| #000000 | border | 27 | color/border/strong | NEW color/border/strong (#18191d) | Report total/header rules need a high-contrast border. No role exists. Q7: #18191d. |
| #000000 | background | 6 | color/bg/strong | MERGE #000000 border | Used as rule lines drawn with background. |
| #9a9aa3 | text | 84 | color/text/tertiary | NEW color/text/tertiary (#737380, per Q1) | Lowest-emphasis readable text (day names, out-of-month dates, meta). Distinct from secondary. Disabled selectors (`.disabled-*`, `.boss-table-disabled-action`) → text-disabled. |
| #9a9aa3 | border | 34 | color/border/tertiary | NEW color/border/secondary (#9a9aa3) | Mid-weight border (tab underlines, cards). Named to match the Divider `secondary` variant. Absorbs other mid-grey borders. |
| #9a9aa3 | background | 7 | color/bg/tertiary | FOLD --boss-color-bg-disabled (4) / --boss-color-bg-brand-default (3) | `.disabled-btn` grounds → bg-disabled. The 3 active tabs with white text (Restaurant Stats, Take Inventory x2) → brand, per Q3; on bg-disabled they read as disabled. *(rev. 2026-10-09)* |
| #0071ce | text | 45 | color/text/info | FOLD --boss-color-text-link | Callout links, "add new" options, info icons. Link purpose; one link blue. Info icons → icon-brand. |
| #0071ce | background | 25 | color/bg/info/default | FOLD --boss-color-bg-brand-default; tooltips → --boss-color-bg-tooltip | Active tabs, selected nav rows, headers: brand selection, not info. Tooltip grounds → bg-tooltip. *(rev. 2026-10-09)* |
| #0071ce | border | 23 | color/border/info | FOLD --boss-color-border-brand | Active-tab underlines. The 9 `outline` uses → border-focus. |
| #ffc061 | text | 26 | color/text/caution | FOLD --boss-color-text-warning; icons → --boss-color-icon-warning | Same purpose as warning. #ffc061 on white is 1.62:1, unreadable. The 21 caution icons → icon-warning (orange). *(rev. 2026-10-09)* |
| #ffc061 | border | 9 | color/border/caution | FOLD --boss-color-border-warning | Warning modal and alert-card borders. |
| #ffc061 | background | 1 | color/bg/caution | FOLD --boss-color-bg-warning-subtle | Warning modal header/footer ground. |
| #5e5e5e | text | 22 | color/text/muted | FOLD --boss-color-text-secondary | Minor info, column headers, tooltip text. Near-identical to #5f6272. |
| #5e5e5e | border | 2 | color/border/muted | MERGE #9a9aa3 border | Not-selected tab underline: mid-weight border. |
| #5e5e5e | background | 2 | color/bg/muted | MERGE #9a9aa3 border | `.vl` / `.line` rules drawn with background. |
| #698ff8 | text | 15 | color/text/link-accent | FOLD --boss-color-text-link | "More" links, show-more notes, link `a`. Two link blues is a defect. |
| #698ff8 | border | 8 | color/border/link-accent | FOLD --boss-color-border-focus | Datepicker `:focus-within` border/ring. |
| #d3d8e0 | background | 21 | color/bg/separator | FOLD --boss-color-border-neutral | Rule lines drawn with background. Use the border role. |
| #d3d8e0 | text | 4 | color/text/faint | FOLD --boss-color-text-disabled (verify) | Very light text. If it's a "\|" separator glyph, use border-neutral. |
| #f2f5fd | background | 16 | color/bg/brand/faint | FOLD --boss-color-bg-brand-subtle | Hover/active tint on list rows and nav. Within ~10 of #f8f8fa. |
| #f2f5fd | border | 1 | color/border/brand-faint | FOLD --boss-color-border-neutral | Single toast border. |
| #f8faff | background | 13 | color/surface/table | NEW color/surface/table-expanded (#f8faff) | BOSS Table subheaders, expanded-row rim and detail panels. Matches the Figma detail panel gap noted in the brief. |
| #8d8d90 | border | 6 | color/border/inactive | MERGE #9a9aa3 border | Mid-grey border. No separate "inactive" purpose. |
| #8d8d90 | background | 1 | color/bg/inactive | FOLD color/bg/overlay/default (NEW, F) | Only use is `bankingModal .overlay`. |
| #060d21 | text | 7 | color/text/spec | FOLD --boss-color-text-primary | Drawer headings and labels: primary text. |
| #060d21 | background | 1 | color/bg/spec | FOLD --boss-color-bg-neutral-default | Style-guide code sample / spec-row divider. |
| #9a261c | text | 5 | color/text/danger-strong | FOLD --boss-color-text-danger | Same purpose as danger. text-danger now takes this value (Q1). |
| #fef1e3 | background | 4 | color/surface/table-row-highlight | FOLD --boss-color-surface-table-hover | Row `:hover` in ingredient/recipe lists. Orange hover carries no meaning. |
| #5f6272 | border | 2 | color/border/secondary | MERGE #9a9aa3 border | One mid-weight border role. |
| #ffffb3 | background | 1 | color/bg/highlight | FOLD --boss-color-surface-row-active | `.selected-supplier`: selection, not a yellow highlight. |
| #e8178a | text | 1 | color/text/markup | FOLD --boss-color-text-secondary | Single `.report-label` in the financial statement title. Decorative. |

## C. Divider variants (needed first)

| Variant | Colour | Proposed Figma path | Decision | Reason |
|---|---|---|---|---|
| strong | #000000 | color/border/strong | NEW color/border/strong (#18191d) | Same as B. |
| secondary | #5f6272 | color/border/secondary | NEW color/border/secondary (#9a9aa3) | One mid-weight border. Value shifts lighter (Q5b). |
| brand-subtle | #dee2ee | color/border/brand-subtle | FOLD --boss-color-border-neutral; retire the variant | Within ~10 of #d3d8e0. No distinct purpose (Q5a). |
| inverse | #ffffff | color/border/inverse | NEW color/border/inverse (#ffffff) | Dividers on filled/dark grounds. Pairs with text-on-filled. |

## D. Palette colours not in Figma at all

| Colour | Where | Used as: uses | Proposed | Decision | Reason |
|---|---|---|---|---|---|
| #868995 | table headers | text 7, bg 1 | color/text/table-header-subtle | FOLD --boss-color-text-table-header | Same purpose as an existing role. The bg use → border-neutral (verify). |
| #e1e1e1 | backgrounds | bg 5 | color/bg/neutral/grey | FOLD --boss-color-bg-neutral-subtle | Neutral grey ground. "grey" is an appearance name. |
| #878995 | disabled input text | text 1 | FOLD --boss-color-text-disabled | FOLD --boss-color-text-disabled | Agreed. |
| #3f3f46 | tree view text | text 3 | color/text/tree | FOLD --boss-color-text-primary | WebAwesome tree default (zinc). Tree cells now live in BOSS Table, so they use table roles. |
| #52525b | tree expand icon | text 3 | color/icon/tree-expand | FOLD --boss-color-icon-default | Same as other row icons. |
| #f4f4f5 | tree selected row | bg 2 | color/surface/tree-selected | FOLD --boss-color-surface-row-active | Same as selected table row. |
| #efeff1 | tree header hover | bg 1 | color/surface/tree-header-hover | FOLD --boss-color-surface-table-hover | Same as table hover. |
| #999999 | marketing / report pages | border 15, text 3 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #d77138 | marketing / report pages | border 6, text 4, bg 3 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #555555 | marketing / report pages | border 9, text 3 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #b44e15 | marketing / report pages | text 9 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #336699 | marketing / report pages | text 3, border 2, bg 2 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #8a322b | marketing / report pages | text 6 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #b33431 | marketing / report pages | border 2 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |
| #ebebeb | marketing / report pages | bg 3, border 1 | KEEP or FOLD | KEEP | Q6: the marketing palette stays raw everywhere. |

## E. One-off hex colours typed straight into screens

| Colour | Used as: uses | Example file | Nearest role (hex, distance) | Decision | Reason |
|---|---|---|---|---|---|
| #7a8699 | text 16 | `pages/commissary/commissary.scss` +3 | --boss-color-text-on-disabled (#8d8d90, 22) | FOLD --boss-color-text-secondary | Muted labels, not disabled. on-disabled is a component token. |
| #333333 | text 13 | `upload-employees.component.scss` +7 | --boss-color-text-primary (#18191d, 43) | FOLD --boss-color-text-primary | Body text. |
| #27407f | text 6, bg 2, border 1, shadow 1 | `pages/commissary/commissary.scss` | --boss-color-text-brand (#23408f, 16) | FOLD brand family: text-brand / bg-brand-default / border-brand; shadow → color/shadow/sm | Hand-typed brand navy. |
| #e0e0e0 | border 8, bg 1 | `payrollRegisterReportView.component.scss` +7 | --boss-color-border-select-disabled (#dfe0e3, 3) | FOLD --boss-color-border-neutral | Generic border. Select tokens are for selects. |
| #cccccc | border 8, bg 1 | `payrollUpload.scss` +5 | --boss-color-border-disabled (#cfd1d9, 14) | FOLD --boss-color-border-neutral | Generic border (disabled selectors → border-disabled). |
| #dddddd | border 9 | `employeeInformationRegisters.scss` +7 | --boss-color-border-select-disabled (#dfe0e3, 7) | FOLD --boss-color-border-neutral | Generic border. |
| #d9d9d9 | text 5, other 1, bg 1, border 1 | `takeInventoryItem.scss` +6 | --boss-color-text-combobox-disabled (#b4b8c4, 54) | FOLD: "\|" separators → --boss-color-border-neutral; quantity-selector disabled +/- → --boss-color-icon-disabled; other → --boss-color-text-disabled (verify) | The Take Inventory "\|" separators are divider marks; text-disabled would make them much darker. Border/bg → border-neutral. *(rev. 2026-10-09)* |
| #6c7a93 | text 8 | `commissaryItemSettings.scss` +2 | --boss-color-text-on-disabled (#8d8d90, 38) | FOLD --boss-color-text-secondary | Secondary text. |
| #f44336 | border 5, text 2 | `payrollDashboard.component.scss` +5 | --boss-color-border-danger (#fa1616, 56) | FOLD --boss-color-border-danger / text-danger | Material red, error state. |
| #ecedf1 | border 7 | `payrollDetails.component.scss` +3 | --boss-color-border-select-disabled (#dfe0e3, 23) | FOLD --boss-color-border-neutral | Generic border. |
| #eef1f5 | border 7 | `commissaryItems.scss` +2 | --boss-color-border-select-disabled (#dfe0e3, 29) | FOLD --boss-color-border-neutral | Generic border. |
| #c0392b | text 7 | `commissaryItems.scss` +3 | --boss-color-text-danger (#fa1616, 71) | FOLD --boss-color-text-danger | Error text. |
| #22304a | text 7 | `commissary.scss` +1 | --boss-color-text-primary (#18191d, 52) | FOLD --boss-color-text-primary | Heading ink. |
| #f4f4f4 | bg 6 | `employeeInformationRegisters.scss` +5 | --boss-color-surface-table-header (#f7f7f8, 6) | FOLD --boss-color-surface-table-header | Payroll register report tables. |
| #eef1f6 | border 6 | `commissary.scss` | --boss-color-border-select-disabled (#dfe0e3, 30) | FOLD --boss-color-border-neutral | Generic border. |
| #3399ff | border 5, text 1 | `_businessAnalytics.scss` | --boss-color-border-focus (#49a4da, 44) | FOLD --boss-color-border-focus; text → text-link | Highlight/focus blue. |
| #606271 | text 5 | `deductions.component.scss` +4 | --boss-color-text-secondary (#5f6272, 1) | FOLD --boss-color-text-secondary | Typo of #5f6272. |
| #f2f2f3 | bg 5 | `payrollDetails.component.scss` +4 | --boss-color-surface-row-active (#f0f0f0, 4) | FOLD --boss-color-surface-row-active (verify) | If not a selected row → bg-brand-subtle. |
| #e3e7ee | border 4, bg 1 | `commissary.scss` +1 | --boss-color-border-select-disabled (#dfe0e3, 14) | FOLD --boss-color-border-neutral | Generic border. |
| #f5f5f5 | bg 4 | `duplicateTransactionMatch.scss` +3 | --boss-color-surface-table-header (#f7f7f8, 4) | FOLD --boss-color-bg-brand-subtle | Panel ground, not a table header. |
| #757575 | text 4 | `bankTransferMatch.scss` +2 | --boss-color-text-secondary (#5f6272, 29) | FOLD --boss-color-text-secondary | Secondary text. |
| #f9f9f9 | bg 4 | `adjustingTransactionMatch.scss` +3 | --boss-color-bg-brand-subtle (#f8f8fa, 2) | FOLD --boss-color-bg-brand-subtle | Subtle ground. |
| #f2f2f2 | bg 4 | `pages/invoices/_invoices.scss` +3 | --boss-color-surface-row-active (#f0f0f0, 3) | FOLD --boss-color-surface-row-active (verify) | As #f2f2f3. |
| #393939 | border 4 | `pages/invoices/_invoices.scss` +2 | --boss-color-border-brand (#23408f, 89) | FOLD color/border/strong (NEW) | Dark neutral rule, not brand. |
| #3f51b5 | text 2, border 2 | `payrollRetirementReport.scss` +3 | --boss-color-text-brand (#23408f, 50) | FOLD --boss-color-text-brand / border-brand | Material indigo standing in for brand. |
| #666666 | text 3 | `adjustingTransactionMatch.scss` +2 | --boss-color-text-secondary (#5f6272, 14) | FOLD --boss-color-text-secondary | Secondary text. |
| #f3f3f3 | bg 3 | `pages/invoices/_invoices.scss` +2 | --boss-color-surface-row-active (#f0f0f0, 5) | FOLD --boss-color-surface-row-active (verify) | As #f2f2f3. |
| #111111 | text 3 | `upload-employees.component.scss` +1 | --boss-color-text-primary (#18191d, 16) | FOLD --boss-color-text-primary | Primary text. |
| #e00000 | text 2, border 1 | `upload-employees.component.scss` | --boss-color-text-danger (#fa1616, 41) | FOLD --boss-color-text-danger / border-danger | Error state. |
| #d6dce5 | border 3 | `upload-employees.component.scss` | --boss-color-border-neutral (#d3d8e0, 7) | FOLD --boss-color-border-neutral | Same. |
| #fafafb | bg 3 | `newMeasurementFlyout.scss` +2 | --boss-color-bg-brand-subtle (#f8f8fa, 3) | FOLD --boss-color-bg-brand-subtle | Same. |
| #b6bfd4 | bg 1, text 1, border 1 | `commissary.scss` | --boss-color-bg-button-brand-subtle-hover (#c8cfe3, 28) | FOLD bg → bg-brand-subtle-hover, text → text-disabled, border → border-neutral | Not a button. Brand tint family. |
| #445069 | text 3 | `commissary.scss` | --boss-color-text-secondary (#5f6272, 34) | FOLD --boss-color-text-secondary | Secondary text. |
| #444444 | text 2, border 1 | `_rfiIngredient.scss` +1 | --boss-color-text-secondary (#5f6272, 61) | FOLD --boss-color-text-primary; border → color/border/secondary | Dark body text. |
| #333a4d | border 2, bg 1 | `components/loadingSpinner/loadingSpinner.scss` | --boss-color-border-brand (#23408f, 68) | FOLD --boss-color-bg-neutral-default (all 3 uses) | Spinner ink is neutral, not brand. |
| #e3f2fd | bg 2 | `duplicateTransactionMatch.scss` +1 | --boss-color-surface-table-hover (#edf6fb, 11) | FOLD --boss-color-surface-table-hover | Highlighted match row. |
| #2196f3 | border 2 | `duplicateTransactionMatch.scss` +1 | --boss-color-border-focus (#49a4da, 49) | FOLD --boss-color-border-brand | Selected match card. Selection, not focus. |
| #e8e8e8 | border 2 | `pages/invoices/_invoices.scss` +1 | --boss-color-border-select-disabled (#dfe0e3, 13) | FOLD --boss-color-border-neutral | Generic border. |
| #2d73c9 | text 2 | `employeeWagesDeductions.component.scss` +1 | --boss-color-text-link (#237db1, 28) | FOLD --boss-color-text-link | Link. |
| #bbbbbb | border 2 | `historySummaryRange.scss` +1 | --boss-color-border-disabled (#cfd1d9, 42) | FOLD color/border/secondary (NEW) | Mid-weight border. |
| #49a4d6 | text 2 | `shippingTrackingDetailsDrawer.component.scss` +1 | --boss-color-text-button-brand-accent-disabled (#71b9e3, 47) | FOLD --boss-color-text-link | Tracking link, not a disabled button. |
| #b8cbda | bg 2 | `commissaryItemSettings.scss` +1 | --boss-color-bg-button-brand-subtle-hover (#c8cfe3, 19) | FOLD --boss-color-bg-brand-subtle-hover | Brand tint, not a button. |
| #e8f0fd | bg 2 | `commissary.scss` | --boss-color-surface-table-hover (#edf6fb, 8) | FOLD --boss-color-bg-brand-subtle | Tinted panel. |
| #fbe9e7 | bg 2 | `commissary.scss` | --boss-color-bg-warning-subtle (#fff2df, 13) | FOLD --boss-color-bg-danger-subtle | Red-hued tint paired with #c0392b error text. |
| #eef3ff | bg 2 | `commissary.scss` | --boss-color-surface-table-hover (#edf6fb, 5) | FOLD --boss-color-bg-brand-subtle | Tinted panel. |
| #d3dae5 | border 2 | `commissary.scss` | --boss-color-border-neutral (#d3d8e0, 5) | FOLD --boss-color-border-neutral | Same. |
| #f6f8fb | bg 2 | `commissaryItems.scss` | --boss-color-bg-brand-subtle (#f8f8fa, 2) | FOLD --boss-color-bg-brand-subtle | Same. |
| #dde2eb | other 2 | `pages/dailySales/dailySales.scss` +1 | --boss-color-bg-brand-subtle-hover (#dee2ee, 3) | FOLD --boss-color-bg-brand-subtle-hover | Same. |
| #fbfbff | bg 2 | `glDetailReportTable.scss` | --boss-color-surface-drawer (#fcfdff, 2) | FOLD --boss-color-bg-brand-subtle | Report table ground, not a drawer. |
| #989898 | text 2 | `_restaurantStats.scss` | --boss-color-text-on-disabled (#8d8d90, 17) | FOLD color/text/tertiary (NEW) | Low-emphasis stat label. |
| #424242 | text 1 | `bankTransferMatch.scss` | --boss-color-text-secondary (#5f6272, 65) | FOLD --boss-color-text-primary | Dark body text. |
| #fbc1c1 | bg 1 | `pages/invoices/_invoices.scss` | --boss-color-bg-danger-subtle (#fed0d0, 21) | FOLD --boss-color-bg-danger-subtle | Error tint. |
| #313131 | text 1 | `pages/invoices/_invoices.scss` | --boss-color-text-primary (#18191d, 40) | FOLD --boss-color-text-primary | Primary text. |
| #2c2c2c | text 1 | `pages/invoices/_invoices.scss` | --boss-color-text-primary (#18191d, 31) | FOLD --boss-color-text-primary | Primary text. |
| #d1d2d4 | bg 1 | `pages/invoices/_invoices.scss` | --boss-color-bg-disabled (#cfd1d9, 5) | FOLD --boss-color-bg-disabled (verify) | If not disabled → surface-secondary. |
| #cacbcd | border 1 | `pages/invoices/_invoices.scss` | --boss-color-border-disabled (#cfd1d9, 14) | FOLD --boss-color-border-neutral | Generic border. |
| #f1f1f2 | bg 1 | `pages/invoices/_invoices.scss` | --boss-color-surface-row-active (#f0f0f0, 2) | FOLD --boss-color-surface-row-active (verify) | As #f2f2f3. |
| #d7d7d7 | border 1 | `upload-employees.component.scss` | --boss-color-border-select (#d7d8dc, 5) | FOLD --boss-color-border-neutral | Not a select. |
| #f4f7fc | bg 1 | `upload-employees.component.scss` | --boss-color-bg-brand-subtle (#f8f8fa, 5) | FOLD --boss-color-bg-brand-subtle | Same. |
| #677eb8 | border 1 | `upload-employees.component.scss` | --boss-color-border-button-brand-disabled (#919fc7, 55) | FOLD --boss-color-border-brand | Brand border, not a disabled button. |
| #777777 | text 1 | `upload-employees.component.scss` | --boss-color-text-secondary (#5f6272, 32) | FOLD --boss-color-text-secondary | Secondary text. |
| #909090 | text 1 | `upload-employees.component.scss` | --boss-color-text-on-disabled (#8d8d90, 4) | FOLD color/text/tertiary (NEW) | Low-emphasis text (disabled selector → text-disabled). |
| #d4d4d4 | border 1 | `upload-employees.component.scss` | --boss-color-border-disabled (#cfd1d9, 8) | FOLD --boss-color-border-neutral | Generic border. |
| #f01818 | bg 1 | `upload-employees.component.scss` | --boss-color-bg-danger-default (#fa1616, 10) | FOLD --boss-color-bg-danger-default | Same. |
| #d60000 | text 1 | `upload-employees.component.scss` | --boss-color-text-danger (#fa1616, 48) | FOLD --boss-color-text-danger | Error text. |
| #f00000 | text 1 | `upload-employees.component.scss` | --boss-color-text-danger (#fa1616, 33) | FOLD --boss-color-text-danger | Error text. |
| #f6f7f9 | bg 1 | `upload-employees.component.scss` | --boss-color-surface-table-header (#f7f7f8, 1) | FOLD --boss-color-bg-brand-subtle (verify) | Table header → keep surface-table-header. |
| #f7f9fc | bg 1 | `upload-employees.component.scss` | --boss-color-bg-brand-subtle (#f8f8fa, 2) | FOLD --boss-color-bg-brand-subtle | Same. |
| #aaaaaa | bg 1 | `employeeWagesDeductions.component.scss` | --boss-color-bg-button-brand-disabled (#919fc7, 40) | FOLD --boss-color-bg-disabled | Grey disabled fill, not brand. |
| #f9f8fa | bg 1 | `payrollRegisterReportView.component.scss` | --boss-color-bg-brand-subtle (#f8f8fa, 1) | FOLD --boss-color-bg-brand-subtle | Typo of #f8f8fa. |
| #6e6e6e | text 1 | `payrollDashboard.component.scss` | --boss-color-text-secondary (#5f6272, 20) | FOLD --boss-color-text-secondary | Secondary text. |
| #888888 | border 1 | `payrollUpload.scss` | --boss-color-border-button-brand-disabled (#919fc7, 68) | FOLD color/border/secondary (NEW) | Mid-grey border. |
| #5c3e8f | text 1 | `payrollHistoryListItem.component.scss` | --boss-color-text-secondary (#5f6272, 46) | SKIP | Payroll status colour is never rendered (Q4 revised). Log as dead code. *(rev. 2026-10-09)* |
| #ff9800 | text 1 | `payrollHistoryListItem.component.scss` | --boss-color-text-warning (#fa9016, 24) | SKIP | Payroll status colour is never rendered (Q4 revised). Log as dead code. *(rev. 2026-10-09)* |
| #81c784 | text 1 | `payrollHistoryListItem.component.scss` | --boss-color-text-on-disabled (#8d8d90, 60) | Delete (dead CSS) | `.green-text.text-lighten-2` is never applied; the code uses `grey-text text-lighten-2`. |
| #4caf50 | text 1 | `payrollHistoryListItem.component.scss` | --boss-color-text-success (#00a95d, 77) | SKIP | Payroll status colour is never rendered (Q4 revised). Log as dead code. *(rev. 2026-10-09)* |
| #9e9e9e | text 1 | `payrollHistoryListItem.component.scss` | --boss-color-text-on-disabled (#8d8d90, 28) | SKIP | Payroll status colour is never rendered (Q4 revised). Log as dead code. *(rev. 2026-10-09)* |
| #e9ecf4 | bg 1 | `budgetEditDrawer.scss` | --boss-color-surface-secondary (#e8e8ee, 7) | FOLD --boss-color-bg-brand-subtle-hover | Brand-tinted ground. |
| #cdddf8 | border 1 | `commissary.scss` | --boss-color-border-neutral (#d3d8e0, 25) | FOLD --boss-color-border-neutral | Same purpose. Blue tint isn't meaningful. |
| #fdeeda | bg 1 | `commissary.scss` | --boss-color-bg-warning-subtle (#fff2df, 7) | FOLD --boss-color-bg-warning-subtle | Same. |
| #f3d9ae | border 1 | `commissary.scss` | --boss-color-border-select (#d7d8dc, 54) | FOLD --boss-color-border-neutral | Commissary banner (OR-13685): a saturated status border is too loud on a pale banner; the tint carries the status. *(rev. 2026-10-09)* |
| #b06a12 | text 1 | `commissary.scss` | --boss-color-text-warning (#fa9016, 83) | FOLD --boss-color-text-warning | Warning text. text-warning is now #a85800 (Q1). |
| #f2c8c2 | border 1 | `commissary.scss` | --boss-color-border-select (#d7d8dc, 54) | FOLD --boss-color-border-neutral | Same banner, closed state. *(rev. 2026-10-09)* |
| #f4f6fa | bg 1 | `commissary.scss` | --boss-color-surface-table-header (#f7f7f8, 4) | FOLD --boss-color-bg-brand-subtle | Panel ground. |
| #f6f9ff | bg 1 | `commissary.scss` | --boss-color-bg-brand-subtle (#f8f8fa, 5) | FOLD --boss-color-bg-brand-subtle | Same. |
| #e2f5e9 | bg 1 | `commissary.scss` | --boss-color-surface-secondary (#e8e8ee, 15) | FOLD --boss-color-bg-success-subtle | Green tint (success). |
| #21764a | text 1 | `commissary.scss` | --boss-color-text-button-brand-accent-hover (#19597e, 60) | FOLD --boss-color-text-success | Green success text. |
| #eef2f7 | bg 1 | `commissaryItems.scss` | --boss-color-surface-table-hover (#edf6fb, 6) | FOLD --boss-color-bg-brand-subtle (verify) | Hover state → surface-table-hover. |
| #fafbfd | bg 1 | `commissaryItems.scss` | --boss-color-surface-drawer (#fcfdff, 3) | FOLD --boss-color-bg-brand-subtle | Not a drawer. |
| #e4eaf5 | bg 1 | `addManualInvoice.scss` | --boss-color-surface-secondary (#e8e8ee, 8) | FOLD --boss-color-bg-brand-subtle-hover | Brand-tinted ground. |
| #fcfcfc | bg 1 | `dailySales.scss` | --boss-color-surface-drawer (#fcfdff, 3) | FOLD --boss-color-bg-brand-subtle | Not a drawer. |
| #9747ff | border 1 | `pages/styleGuide/styleGuide.scss` | --boss-color-border-button-brand-disabled (#919fc7, 104) | KEEP | Figma's component-set purple, style-guide documentation only. |
| #c4c4c4 | text 1 | `globalReportingDashboard.scss` | --boss-color-text-combobox-disabled (#b4b8c4, 20) | FOLD --boss-color-text-disabled | Not a combobox. |
| #ae0909 | bg 1 | `pages/enterSales/_enterSales.scss` | --boss-color-bg-danger-hover (#e60c0c, 56) | FOLD --boss-color-bg-danger-hover (verify) | If not a hover → bg-danger-default. |
| #49484d | text 1 | `loginHelpModal.scss` | --boss-color-text-secondary (#5f6272, 50) | FOLD --boss-color-text-primary | Dark body text. |
| #dc3545 | text 1 | `units.component.scss` | --boss-color-text-danger (#fa1616, 64) | FOLD --boss-color-text-danger | Bootstrap red, error. |
| #ff0000 | text 1 | `unitsActivation.component.scss` | --boss-color-text-danger (#fa1616, 32) | FOLD --boss-color-text-danger | Error. |
| #f8f8f8 | bg 1 | `pdf-viewer-dialog.component.scss` | --boss-color-surface-table-header (#f7f7f8, 1) | FOLD --boss-color-bg-brand-subtle | Dialog ground, not a table. |
| #fa4d56 | text 1 | `quantitySelector.scss` | --boss-color-text-danger (#fa1616, 84) | FOLD --boss-color-text-danger | Error. |
| #02040b | text 1 | `orderlyInput/OrderlyInput.scss` | --boss-color-text-primary (#18191d, 35) | FOLD --boss-color-text-primary | Primary text. |
| #fdfdfd | bg 1 | `filterDrawer.scss` | --boss-color-surface-drawer (#fcfdff, 2) | FOLD --boss-color-surface-drawer | It is a drawer. |

## F. Shadows and transparent colours (rgba)

Shadow scale by alpha: **sm** ≤ 0.12, **md** 0.14–0.25 (the dominant 0.25 is md), **lg** ≥ 0.3.

| Value | Used as: uses | Example file | Decision | Reason |
|---|---|---|---|---|
| `rgba(0,0,0,0.25)` | shadow 97, border 1 | `purchasingAnalytics.scss` +76 | NEW color/shadow/md (rgba(0,0,0,0.25)); border → border-neutral | Defines the default shadow. |
| `rgba(0,0,0,0.2)` | shadow 6, other 1, bg 1 | `_recentPrices.scss` +6 | FOLD color/shadow/md; bg → color/bg/overlay/default | |
| `rgba(73,164,218,0.2)` | bg 7 | `employee.component.scss` +3 | FOLD --boss-color-surface-table-hover | 20% focus-blue on white ≈ #edf6fb. |
| `rgba(0,0,0,0.5)` | bg 3, shadow 2, other 1 | `payrollCheckPdfViewerModal.component.scss` +5 | NEW color/bg/overlay/default (rgba(0,0,0,0.5)); shadow → color/shadow/lg | Modal scrim. |
| `rgba(0,0,0,0.14)` | other 6 | `_recentPrices.scss` +4 | FOLD color/shadow/sm | Material elevation layer. |
| `rgba(0,0,0,0.12)` | other 6 | `_recentPrices.scss` +4 | FOLD color/shadow/sm | Material elevation layer. |
| `rgba(250,22,22,0.30)` | shadow 4 | `supplierOverview1099Form.scss` +3 | NEW color/shadow/focus-danger (rgba(250,22,22,0.3)) | Error focus ring: a state. |
| `rgba(0,0,0,0.3)` | shadow 4 | `categoryOverviewContent.scss` +3 | NEW color/shadow/lg (rgba(0,0,0,0.3)) | |
| `rgba(0,0,0,0.02)` | shadow 3 | `newMeasurementFlyout.scss` +2 | FOLD color/shadow/sm | |
| `rgba(255,255,255,0.6)` | bg 3 | `financialReportLoadingContainer.scss` +2 | NEW color/bg/overlay/loading (rgba(255,255,255,0.6)) | Loading veil over content. |
| `rgba(192,192,192,0.5)` | bg 2 | `pages/subscriptions/_subscriptions.scss` +1 | FOLD color/bg/overlay/loading | Light veil. |
| `rgba(63,81,181,0.5)` | shadow 2 | `historySummaryRange.scss` +1 | MERGE `rgba(colors.$brand-active-blue,0.4)` | Focus ring. |
| `rgba(0,0,0,0.19)` | shadow 2 | `ingredientManagement.scss` +1 | FOLD color/shadow/md | |
| `rgb(000/15%)` | shadow 2 | `customReportTemplateDrawer.scss` | FOLD color/shadow/md | |
| `rgba(colors.$brand-active-blue,0.4)` | shadow 2 | `components/boss-input/boss-input.component.scss` +1 | NEW color/shadow/focus (rgba(73,164,218,0.4)) | Input focus ring. |
| `rgba(0,0,0,0.1)` | shadow 1 | `employeeInformationRegisters.scss` | NEW color/shadow/sm (rgba(0,0,0,0.1)) | |
| `rgb(224,224,224)` | other 1 | `payrollDetails.component.scss` | MERGE #e0e0e0 (→ border-neutral) | Same colour as E row. |
| `rgba(200,200,200,0.3)` | bg 1 | `payrollUpload.scss` | FOLD --boss-color-bg-brand-subtle | Light grey wash ≈ subtle ground. |
| `rgba(0,0,0,0.04)` | shadow 1 | `commissaryItemSettings.scss` | FOLD color/shadow/sm | |
| `rgba(30,48,90,0.08)` | shadow 1 | `commissary.scss` | FOLD color/shadow/sm | |
| `rgba(255,255,255,0.35)` | bg 1 | `commissary.scss` | NEW color/bg/on-filled-subtle (rgba(255,255,255,0.2)) | Translucent chips/panels on brand-filled grounds. Pairs with text-on-filled. |
| `rgba(255,255,255,0.7)` | text 1 | `commissary.scss` | FOLD --boss-color-text-on-filled | One text-on-fill role. |
| `rgba(255,255,255,0.5)` | border 1 | `commissary.scss` | FOLD color/border/inverse (NEW) | |
| `rgba(30,40,60,0.05)` | shadow 1 | `commissary.scss` | FOLD color/shadow/sm | |
| `rgba(255,255,255,0.15)` | bg 1 | `commissaryItems.scss` | MERGE `rgba(255,255,255,0.35)` | |
| `rgba(255,255,255,0.4)` | border 1 | `commissaryItems.scss` | FOLD color/border/inverse (NEW) | |
| `rgba(255,255,255,0.25)` | bg 1 | `commissaryItems.scss` | MERGE `rgba(255,255,255,0.35)` | |
| `rgba(192,57,43,0.1)` | bg 1 | `commissaryItems.scss` | FOLD --boss-color-bg-danger-subtle | |
| `rgba(233,48,44,0.75)` | bg 1 | `pages/foodUsage/_foodUsage.scss` | FOLD --boss-color-bg-danger-default | |
| `rgb(000/25%)` | shadow 1 | `exportedInvoices.scss` | FOLD color/shadow/md | |
| `rgba(colors.$brand-active-blue,0.08)` | bg 1 | `customReportTemplateDrawer.scss` | FOLD --boss-color-surface-table-hover | 8% focus-blue ≈ hover tint. |
| `rgba(0,0,0,0.7)` | bg 1 | `_businessAnalytics.scss` | FOLD color/bg/overlay/default | |
| `rgba(51,153,255,0.4)` | bg 1 | `_ingredientPurchaseHistory.scss` | FOLD --boss-color-surface-table-hover | Highlight tint. |
| `rgba(255,255,255,0.8)` | bg 1 | `unitsActivation.component.scss` | FOLD color/bg/overlay/loading | |
| `rgba(255,255,255,0.3)` | border 1 | `unitsActivation.component.scss` | FOLD color/border/inverse (NEW) | |
| `rgba(0,0,0,0.87)` | text 1 | `financialStatements.scss` | FOLD --boss-color-text-primary | Material default text. |
| `rgba(0,0,0,0.6)` | bg 1 | `myProfile.scss` | FOLD color/bg/overlay/default | |
| `rgba(colors.$brand-warn,0.3)` | shadow 1 | `components/bossForm/bossForm.scss` | MERGE `rgba(250,22,22,0.30)` | Same value (brand-warn = #fa1616). |
| `rgba(0,0,0,0.2509803922)` | shadow 1 | `containerAndRestaurantSelectorsParent.scss` | FOLD color/shadow/md | Compiled 0.25. |

## H. Revisions 2026-10-09 (from the colour review)

`steve-colour-review.html` checked every decision against the real app. None of the decisions were wrong in intent, but several would have broken or dulled something on screen. The main cause: colours were grouped by the CSS property they're set on, so icons coloured with `color:` were counted as text and would darken with Q1. All proposed fixes were accepted, with two changes: H1 uses brand, not a new orange role, and H8 was added.

| # | Review finding | Revised decision |
|---|---|---|
| H1 | Orange highlight (sidebar current-page icon, favourite star, ~10 edit-icon hovers, breadcrumb hover, active Settings icon) reads `text-warning` and would turn brown | Highlight icons → `--boss-color-icon-brand`, breadcrumb hover text → `--boss-color-text-brand`. No `icon/accent` role: an "active / you are here" highlight is brand (Q3), and orange stays reserved for warnings. |
| H2 | ~45 error, delete and warning icons, plus the 21 yellow caution icons, are coloured with the text role and would darken | Icons → `--boss-color-icon-danger` (#fa1616) / `--boss-color-icon-warning` (#fa9016). Former yellow caution icons become orange. Only real text darkens. |
| H3 | #9a9aa3 → bg-disabled includes 3 active tabs with white text (~1.5:1, looks disabled) | Active tabs → `--boss-color-bg-brand-default`. `.disabled-btn` keeps bg-disabled. |
| H4 | Commissary banner borders #f3d9ae / #f2c8c2 would become saturated `border-warning` / `border-danger` | Both → `--boss-color-border-neutral`. Banner backgrounds as decided (#fbe9e7 → bg-danger-subtle). No subtle-status border roles. |
| H5 | Web Awesome danger/warning text and `.warn-text` read the raw palette and would stay #fa1616 / #fa9016 | Point them at `--boss-color-text-danger` / `text-warning`. Accepted side effect: WA's own danger/warning icons use the same setting and darken; override per component if one looks wrong. |
| H6 | Take Inventory "\|" separators (#d9d9d9) would fold to text-disabled and get much darker | Separators → `--boss-color-border-neutral`. Quantity-selector disabled +/- icon → `--boss-color-icon-disabled`. |
| H7 | Payroll status colours are never shown on any screen | Q4 → SKIP. Log the status-colour code and #81c784 as dead code for removal. |
| H8 | (Added) The review accepts tooltips turning navy via the info → brand fold, but Q3 never covered tooltips and the Figma Tooltip is dark grey (`color/bg/tooltip`) | Blue tooltip grounds → `--boss-color-bg-tooltip`, not brand. Verify which of the 25 #0071ce background uses are tooltips while wiring. |
| H9 | Divider brand-subtle removal | Confirmed. Swap the 6 Overview dividers to default, then remove the option. |

Also from the review: it used the code as of 1 Oct. Colours added since then have no decision yet, and the review team will send them separately.

**Figma follow-ups (next step, not yet applied):**
- ~~Move the 33 Badge and Dropdown Item (Danger) icons to `color/icon/danger|warning` (H2).~~ **Done 2026-10-09** (Badge 24, Dropdown Item 9). Code note: if those icons inherit `currentColor` from the label, wiring needs an explicit icon colour.
- ~~Check the rest of the file for any icon still bound to a text status role (H2).~~ **Done 2026-10-09:** a full scan (all pages, including instances and vector icons) found no icons left on `text/danger|warning`. The only remaining case was the 12 Badge Success icons on `text/success`, moved to `color/icon/success` for consistency (same value, green/50 / green/90, so no visual change).
- ~~Organizational Tree page: fix To-Do 3 and the Tree Item description (they called the tree colours drift).~~ **Done 2026-10-09:** To-Do 3 is now marked resolved and lists the section D folds; To-Do 2 and the description note `surface/row-active` for the selected row. The BOPD-816 comment was corrected the same day.
- No change needed: Divider (no brand-subtle variant in Figma), Alert (already on icon roles), Tooltip (already `color/bg/tooltip`).

## I. Hover and trend colours (round 3, resolved 2026-10)

The orange highlight (#fa9016) is also the app's general **hover** colour on links, breadcrumbs, sortable headers, tabs and clickable icons: 79 hover rules. Under Q1 each would turn dark brown (#a85800). Decision: hover is an interaction state, not a warning, so it leaves the warning role (H1: orange = warnings only). Answers: **I1 = BRAND with exceptions**, **I2 = ICON-WARNING**, **I3 = ICON-WARNING**. No new Figma variables are needed.

| Group (79 rules) | Rules | Hover treatment |
|---|---:|---|
| Text, colour inherited or other (includes 8 link-accent rows, which fold to `text-link` #237db1 under decision B, and 9 breadcrumb rows covered by H1) | 28 | `--boss-color-text-brand` (#23408f) |
| Icons, colour inherited or other | 21 | `--boss-color-icon-brand` |
| Text already brand before hover | 12 | Stay brand, add an underline on hover (designer choice) |
| Icons already brand before hover | 2 | No colour change, cursor only (an underline does not apply to an icon) |
| Sortable headers and sort controls | 8 | `--boss-color-text-primary`, so table headers stay gray-only (designer choice, BOSS Table 2026-10-07) |
| Tab labels | 5 | Grey ground `--boss-color-bg-neutral-subtle-hover`, label unchanged (matches the Figma Tab Hover) |
| White text on a navy banner or dark header | 3 | Ground `--boss-color-bg-on-filled-subtle` (rgba white 20%), text stays white (designer choice) |

**Verify on screen:** `submittedOrderRow.scss:223` (a status icon that may not need a hover), `addToRestaurantsFlyout.scss:133` (icon in a warning popover), `viewAllW2.component.scss:38` (parent colour is `$brand-darker-blue`, so brand hover may show no change), and the grounds of `_recipeMaintenanceView.scss:116` and `ordering.scss:102` (assumed dark). The other inherited-colour rows get brand hover without a per-row screen check, so spot-check them.

| Value | Used as | Decision | Target | Reason |
|---|---|---|---|---|
| #fa9016 | I1 hover: white text on navy banner / dark header (3 rules) | FOLD | --boss-color-bg-on-filled-subtle (hover ground, rgba(255,255,255,0.2)); text stays --boss-color-text-on-filled | Brand navy hover would vanish on navy, so these 3 are an exception to the brand rule. viewAllW2.component.scss:17 is confirmed a navy banner; _recipeMaintenanceView.scss:116 and ordering.scss:102 have white text and look like dark headers (verify the ground). No new variable. |
| #fa9016 | I1 hover: tab labels (5 rules) | FOLD | --boss-color-bg-neutral-subtle-hover (hover ground); label colour unchanged | Match the Figma Tab Hover (grey ground, label stays text-secondary). Active tabs already use brand (Q3). Rows: _tabBar.scss:38, _recipeMaintenanceView.scss:153, recipeDetailFlyout.scss:68, categoryIngredientOverview.scss:55, restaurantCategoryOverview.scss:258. |
| #fa9016 | I1 hover: sortable headers and sort controls (8 rules) | FOLD | --boss-color-text-primary | Table headers stay gray-only (BOSS Table decision 2026-10-07), so hover darkens to ink instead of turning brand. Rows: categoryOverviewContent.scss:46, categoryIngredientOverview.scss:205, categoryIngredientOverview.scss:310, allIngredientsOverview.scss:173, allIngredientsOverview.scss:268, restaurantCategoryOverview.scss:170, allCategoriesOverview.scss:245, manageUsers.scss:177. |
| #fa9016 | I1 hover: text already brand before hover (12 rules) | FOLD | --boss-color-text-brand (unchanged) + underline on hover | A brand hover would show no change, so add an underline (no new role). Designer choice 2026-10. |
| #fa9016 | I1 hover: icons already brand before hover (2 rules) | KEEP | --boss-color-icon-brand (unchanged); no hover colour change | Underline does not apply to an icon, so these keep their colour and only change the cursor. Rows: recipeCostingContent.scss:269, openOrders.scss:126. |
| #fa9016 | I1 hover: all other text (inherited, link-accent, secondary, strong, #49a4da) (28 rules) | FOLD | --boss-color-text-brand | Orange hover is an interaction state, not a warning, so it leaves the warning role (H1: orange = warnings only). Brand matches active and breadcrumb (H1, Q3). The 8 link-accent rows fold to text-link (#237db1) under decision B, so brand navy is a visible darkening. Includes the breadcrumb text rows covered by H1. |
| #fa9016 | I1 hover: all other icons (21 rules) | FOLD | --boss-color-icon-brand | Same reason as the text rows. Includes the shared breadcrumb icon (components/breadcrumb/breadcrumb.scss:14). |
| #fa9016 | I1 verify on screen (4 spots) | FOLD | as the group above, confirm visually | submittedOrderRow.scss:223 (status icon, may not need any hover) ; addToRestaurantsFlyout.scss:133 (icon in a warning popover) ; viewAllW2.component.scss:38 (parent colour is $brand-darker-blue, so brand hover may show no change) ; _recipeMaintenanceView.scss:116 and ordering.scss:102 (confirm the header ground is dark). Brand hover is applied to the other inherited-colour rows without a per-row screen check. |
| #fa9016 | I2 loading spinner steam (5 rules, loadingSpinner.scss:127,142,156,178,185) | FOLD | --boss-color-icon-warning | Decorative illustration. icon-warning keeps today's orange (#fa9016) with no visible change and avoids the dark brown text role (Q1). The bowl loader is being replaced (BOPD-1166): remove this then. |
| #ffc061 | I3 trend up-arrow (budgetHistoryCard.scss:27 .arrow-up) | FOLD | --boss-color-icon-warning | A glyph, so under H2 it is an icon: bright orange, not dark brown. Trend direction is a real status signal. |
| #ffc061 | I3 margin caret (globalReportingDashboard.scss:149 .marginCaretDown) | FOLD | --boss-color-icon-warning | Same as the trend arrow: a glyph, bright orange under H2. |

**Figma follow-up:** Breadcrumb Item `State=Hover` is bound to `color/text/link`, the same as Linked. H1 makes breadcrumb hover brand, so Hover should become `color/text/brand`. The Tab Hover already matches.

## G. Not colours, for later

Unchanged: `radius/panel` code role, `control/checked` wiring (orange/50 is intentional), spacing review.

---

## Name flags

Proposed names that describe appearance or a screen instead of a purpose. All were replaced above:
`text/strong`, `text/faint`, `text/muted`, `text/link-accent`, `text/spec`, `text/markup`, `bg/neutral/grey`, `bg/highlight`, `text/tree`, `surface/tree-*`, `border/brand-faint`, `bg/info` (no info status, Q3).

**Existing duplicates (out of scope, worth a follow-up):** `border-default` = `border-neutral` (#d3d8e0); `text-disabled` = `text-on-disabled` (#8d8d90). Also `bg-brand-subtle` (#f8f8fa) is effectively neutral and absorbs ~25 near-white greys above. Consider renaming it to `color/bg/subtle`.

## Applied in Figma: Back Office Design System 0.1 (2026-10-08)

File `B5j3nfocmShiBwqwy9dNXg`. Variable counts after: Primitives 50 → 60, Color 78 → 91.

1. **New primitives (10, `scopes=[]`).** `orange/30` #a85800 and `gray/55` #737380, with proposed SCSS names `$brand-warning-text-orange` / `$brand-tertiary-grey` in code syntax; engineering needs to add them to `_colors.scss`. Eight alpha primitives: `alpha/black-10|25|30|50`, `alpha/white-20|60`, `alpha/focus-40` (#49a4da), `alpha/danger-30` (#fa1616).
2. **Value changes (Light only).** `color/text/danger` red/50 → red/30. `color/text/warning` orange/50 → orange/30. Dark is unchanged (still red/90 / orange/90).
3. **New Color variables (13).** Each has Light/Dark aliases, scopes and `var(--boss-…)` code syntax:

| Variable | Light | Dark | Scope |
|---|---|---|---|
| `color/text/tertiary` | gray/55 | gray/60 | text |
| `color/border/strong` | gray/10 | gray/70 | stroke |
| `color/border/secondary` | gray/70 | gray/50 | stroke |
| `color/border/inverse` | white | gray/10 | stroke |
| `color/surface/table-expanded` | surface/table | gray/10 | fill |
| `color/bg/overlay/default` | alpha/black-50 | alpha/black-50 | fill |
| `color/bg/overlay/loading` | alpha/white-60 | alpha/black-50 | fill |
| `color/bg/on-filled-subtle` | alpha/white-20 | alpha/white-20 | fill |
| `color/shadow/sm` · `md` · `lg` | alpha/black-10 · 25 · 30 | same | effect |
| `color/shadow/focus` | alpha/focus-40 | same | effect |
| `color/shadow/focus-danger` | alpha/danger-30 | same | effect |

   The Dark values are a best guess (the app has no dark theme). No effect styles were created; offsets and blur for `shadow/sm|md|lg` still need defining.
4. **Divider (`601:9`): Color variant property added.** The Figma Divider had only `Orientation`; strong/secondary/brand-subtle/inverse were `colorInput` values on the code `<divider>`. It now has `Color` = Default (`color/border/neutral` #d3d8e0, the code default `DarkGreyBorderGrey`; previously bound to `color/border/select` #d7d8dc), Strong (`border/strong`), Secondary (`border/secondary`) and Inverse (`border/inverse`), giving 8 variants. brand-subtle was never a Figma variant, so nothing was deleted. The 9 existing instances map to Default. A locked dark backdrop sits behind the Inverse row in the Divider section, for documentation only. The component description is updated.
5. **Alert (`925:16`).** Type=Warning top stroke and icon were bound to the old library's `Color/Alert/warning` (#ffc061). They now use `color/bg/warning/default` and `color/icon/warning`. The Type=Error icon was bound to `color/text/danger` and turned dark red after step 2, so it now uses `color/icon/danger`. (The old `910:77` set no longer exists.)

6. **Icon scan (52 pages).** 39 icons were bound to `color/text/danger|warning`, all in main components. The 6 Select/Combobox Error-state warning icons were moved to `color/icon/danger` (#fa1616), matching the code's raw `$brand-warn`. The code components render no icon there, so the 6 icon layers were then deleted (user-confirmed) and the Error states now show the message only. The 33 Badge and Dropdown Item (Danger) icons stay on the text roles so they match their inline labels. **Superseded 2026-10-09:** all 33 glyphs moved to `color/icon/danger|warning` (H2). Done in Figma 2026-10-09: Badge 24, Dropdown Item Danger 9. Labels stay on the text roles.

## Role value changes (Q1)

Existing Figma variables whose Light value changes. The code roles follow automatically.

| Variable | Code role | Old | New | Contrast on white |
|---|---|---|---|---|
| `color/text/danger` | `--boss-color-text-danger` | #fa1616 | #9a261c (alias red/30) | 4.05 → 7.87 |
| `color/text/warning` | `--boss-color-text-warning` | #fa9016 | #a85800 (new orange primitive) | 2.32 → 5.17 |

Unchanged: `color/bg/danger/*`, `color/border/danger`, `color/icon/danger`, and the warning bg/border/icon roles.

## NEW Figma variables to add

**text**
- `color/text/tertiary`: #737380 (Q1; needs a new gray primitive)

**border**
- `color/border/strong`: #18191d (alias the primitive behind `text/primary`)
- `color/border/secondary`: #9a9aa3 (gray/70)
- `color/border/inverse`: #ffffff

**surface**
- `color/surface/table-expanded`: #f8faff

**bg**
- `color/bg/overlay/default`: rgba(0,0,0,0.5)
- `color/bg/overlay/loading`: rgba(255,255,255,0.6)
- `color/bg/on-filled-subtle`: rgba(255,255,255,0.2)

**shadow** (colour variables; bind into effect styles `shadow/sm|md|lg`, `shadow/focus`, `shadow/focus-danger`)
- `color/shadow/sm`: rgba(0,0,0,0.1)
- `color/shadow/md`: rgba(0,0,0,0.25)
- `color/shadow/lg`: rgba(0,0,0,0.3)
- `color/shadow/focus`: rgba(73,164,218,0.4)
- `color/shadow/focus-danger`: rgba(250,22,22,0.3)

13 new variables in total. Everything else folds into existing roles.
