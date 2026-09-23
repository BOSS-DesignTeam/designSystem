# Component Checklist

Two related but distinct tracking axes live here — don't conflate them:

1. **Figma design build order** — has a component been designed in the Figma file at all?
2. **RestaurantUI style-guide-v2 doc coverage** — does the *legacy* style guide's component
   have a real doc page in the *new* `style-guide-v2` yet?

Neither of these is the same as `RestaurantUI/src/app/pages/style-guide-v2/MIGRATION.md`'s own
"Completed migrations" table, which tracks a third thing — whether a wrapper's *internals* have
actually been swapped from Shoelace to WebAwesome. A component can have a V2 doc page and still
be running on old Shoelace internals underneath, or vice versa. Check that file separately for
that question; don't assume doc coverage implies internals migration or the reverse.

Full historical build detail for the Figma side (node/page IDs, per-component decisions, drift
notes) stays in [BOSS-Design-System-Project-Brief.md](./BOSS-Design-System-Project-Brief.md) —
this file is just the checklists.

---

## 1. Figma design build order

### Done

- Button, Split Button, Input, Select, Badge/Tag, Checkbox, Divider
- Radio, Switch, Tooltip (2026-07-20, via the Atomic Design pass)
- Dropdown Trigger + Dropdown Item (page `468:2`, Dropdown Item added 2026-09-08)
- Accordion (2026-07-30)
- Alert Banner (2026-08-14) — no native `wa-alert` tag exists in the real WA kit; closest
  primitive is `wa-callout`, unconfirmed for dev handoff
- Dialog (page `934:6`, ComponentSet `934:427`) — renamed from Modal 2026-09-08 to match
  WebAwesome's own naming (`wa-dialog`)
- Tabs (2026-09-08) — Tab / Tab Panel / Tab Group, page `3900:2`
- Toast (2026-09-17) — Toast Item, page `4381:162`

All 6 "(Steve)" components are published with Code Connect mappings applied — see the brief's
Publish & Code Connect audit section for which ones and the details.

### Remaining

1. **Popover** — WA: `wa-popover`

Added 2026-09-08 per a Figma-vs-WebAwesome component gap review, alongside Tabs and Toast (both
now done above) — all three flagged as high-value gaps since they show up constantly in a
back-office app.

---

## 2. RestaurantUI style-guide-v2 doc coverage

**Verified 2026-09-23** directly against code — the legacy style guide's real component list
(`RestaurantUI/src/app/pages/styleGuide/`) cross-checked against the actual current
`style-guide-v2.nav.ts` on `master`, not against Jira ticket wording. Several "Add X to style
guide" Jira tickets under OR-11839 say `To Do` for components that are already live in the nav
(Button, Split Button, Dropdown, Badge) — those tickets are stale, not a reliable signal on their
own. Treat this section, not Jira ticket status, as the source of truth for "does it have a V2
doc page," and re-verify against `style-guide-v2.nav.ts` directly if this drifts.

### Complete — has a real V2 doc page today

- Badge
- Breadcrumb
- Button *(Orderly button only — see "Not started" for the plain native-`<button>` pattern, which
  is a separate, undocumented thing)*
- Checkbox
- Combobox
- Details
- Divider
- Dropdown
- Input
- **Radio** (merged since the last check — was missing on an older branch snapshot, confirmed
  live on `master` 2026-09-23)
- Select
- Split Button
- Tag
- Textarea
- Popup *(utility, not components group)*

**Uncertain — flagging rather than asserting:**
- "Alert Notifications" (legacy) → **Callout** (V2): same underlying WA primitive
  (`sl-alert → wa-callout` per `MIGRATION.md`), but the legacy Alert is a stateful, toast-like
  manager (imperative `showAlert()`, stacking) while the V2 Callout doc reads as a static banner.
  Don't count this as full parity without confirming the doc page actually exercises the
  stateful/dismiss/stacking behavior the old one had.
- "OrderlySelect" (legacy) → **Select** and/or **Combobox** (V2): V2 appears to have split what
  OrderlySelect did as one component into single-select (Select) and searchable (Combobox).
  Worth confirming both doc pages together cover everything OrderlySelect's consumers relied on.

### In progress

- **Switch** — OR-13001, Code Review, not yet merged
- **Tooltip** — OR-13002, Code Review, not yet merged
- **Dialog** — OR-13003, Code Review, not yet merged
- **Button Group** (as a section on the Button page) — OR-13514, Code Review, not yet merged

**Discrepancy found:** OR-13005 (Accordion) shows `Ready For Prod` in Jira, but Accordion is
**not** actually in `style-guide-v2.nav.ts` on `master` yet. Worth a status check before trusting
that ticket.

**Quick win found:** `components/boss-drawer/boss-drawer-doc.component.ts` is fully built on disk
(ts/html/scss all present) but has **no entry in `style-guide-v2.nav.ts`** — it's a one-line nav
registration away from being live, not a from-scratch build. `AGENTS.md` even treats it as the
reference example for future doc-page authors, but it's currently unreachable in the actual UI.

### Not started

Real component exists and is used in production RestaurantUI code for every item below — none of
these are "doesn't exist," only "no V2 style-guide doc page yet":

- Action Select
- "Buttons (Standard)" — the plain native-`<button>` pattern (distinct from the Orderly Button
  wrapper, which does have a doc page)
- "Button Group" as its own concept (distinct from the Button Group *section on the Button page*,
  which is in progress above) — the plain `boss-button-group` wrapper itself has no dedicated
  coverage
- Action Toast
- Address
- Card
- Drawers *(see "quick win" above — page exists, just needs a nav entry)*
- Empty State
- File Upload
- Filter Drawer
- Financial Calendar Range
- Icons
- Layout
- Links
- Lists
- Loading Spinner
- Multi Unit Division Selector
- Multi Unit Rooftop Selector
- Organizational Tree Display
- Input Masking (Maskito) — currently folded into Input/Select/Combobox doc pages as a feature,
  not a dedicated entry
- Quantity Selector
- Reusable Animations
- Reusable Colors
- Search Bar
- Sizing
- Selectable Split View
- Toast Notifications
- Progress Ring
- Progress Bar
- Toggle Buttons *(the legacy hand-rolled `button-select` component — distinct from the new
  `boss-toggle-button-group` being built under OR-13514; still needs its own clarification on
  whether it's superseded or coexists)*
- 3 Button More Menu *(closest V2 concept is Dropdown, but it's a newer general-purpose
  component, not a renamed/ported version of the old `MoreOptionsMenu` — don't assume parity)*

### Not verified — needs a separate check

- **DatePicker** (blocked on Toggle/Button Group per earlier note) and **Tab Bar → Tabs**: these
  were flagged as "In Progress — Designer" against the Figma side, not the RestaurantUI code side
  covered by this section. Section 1 above's Figma build order doesn't list either by name in its
  "remaining" item (only Popover is left there) — meaning they may already be done in Figma, or
  may just not be tracked at that granularity. Don't assume either way without checking the Figma
  file directly.
