# Component Status

Living tracker of every design-system component's status across **both** Figma design and
RestaurantUI dev/doc work, in one place. Four buckets: **Complete**, **In Progress — Dev**,
**In Progress — Designer**, **Not Started**.

**Keep this current as part of the work itself** — when a PR ships the thing that moves a
component from one bucket to the next (a Figma component gets built, or a `style-guide-v2` doc
page merges), move that item in this file in the *same* PR. Don't let this drift into another
stale list; that's exactly the problem this file replaced.

**Not the same thing as** `RestaurantUI/src/app/pages/style-guide-v2/MIGRATION.md`'s own
"Completed migrations" table, which tracks a third, different axis: whether a wrapper's
*internals* have been swapped from Shoelace to WebAwesome. A component can be Complete here
(designed + documented) and still be running old Shoelace internals underneath, or vice versa.
Check that file separately for that question.

Full historical build detail for the Figma side (node/page IDs, per-component decisions, drift
notes) stays in [BOSS-Design-System-Project-Brief.md](./BOSS-Design-System-Project-Brief.md) —
this file is just the status.

---

## Complete — designed in Figma AND has a real RestaurantUI style-guide-v2 doc page

Verified 2026-09-23 against both `BOSS-Design-System-Project-Brief.md`'s Figma build order and
`style-guide-v2.nav.ts` on `master` directly — not against Jira ticket wording, which has stale
entries (see the "In Progress — Dev" section).

- Badge
- Button (Orderly)
- Checkbox
- Divider
- Dropdown
- Input
- Radio
- Select
- Split Button
- Tag
- Alert Banner → shipped as **Callout** (OR-13111, On Prod) — flagging a caveat, not a full
  parity claim: the legacy Alert this replaces was a stateful, toast-like manager (imperative
  `showAlert()`, stacking), while the new Callout doc page reads as a static banner. Worth
  confirming the doc page actually exercises the old stateful/dismiss/stacking behavior before
  treating this as 100% equivalent.

**Also dev-complete, but this file's Figma section doesn't track them by name** (likely already
designed — just not itemized in the brief's specific "atomic components" list — not a confirmed
Figma gap):
- Breadcrumb
- Combobox
- Details
- Textarea
- Popup *(utility)*

---

## In Progress — Dev

Real, active development happening right now — a real PR/ticket in motion, not just "design is
done so it's eligible." If nobody's actually writing code for it today, it belongs in Not Started
below instead, even if the design side is finished.

- **Switch** — OR-13001, Code Review, not yet merged
- **Tooltip** — OR-13002, Code Review, not yet merged
- **Dialog** — OR-13003, Code Review, not yet merged
- **Button Group** (section on the Button page) — OR-13514, Code Review, not yet merged

**Quick win found along the way:** `components/boss-drawer/boss-drawer-doc.component.ts` is
fully built on disk (ts/html/scss all present) but has **no entry in `style-guide-v2.nav.ts`** —
one line away from being live, not a from-scratch build. `AGENTS.md` even treats it as the
reference example for future doc-page authors, but it's currently unreachable in the actual UI.
(Not listed as its own bucket item since "Drawers" itself has no Figma-brief tracking either —
see the Not Started list below.)

---

## In Progress — Designer

1. **Popover** — WA: `wa-popover`. The only item where the Figma design itself isn't done yet.
   Added 2026-09-08 per a Figma-vs-WebAwesome component gap review, alongside Tabs and Toast
   (both now designed — see Not Started below, since dev hasn't started on either yet).

---

## Not Started

Real components exist and are used in production RestaurantUI code for every item below — none
of these are "doesn't exist," only "no dev work actively happening on a style-guide-v2 doc page."

**Design already done in Figma, dev just hasn't started yet (no active ticket found):**
- **Tabs** — design done 2026-09-08 (Tab / Tab Panel / Tab Group). No RestaurantUI nav entry, no
  active Jira ticket — likely needs one opened.
- **Toast** — design done 2026-09-17 (Toast Item). No RestaurantUI nav entry. OR-13530/OR-13531
  ("Add Trailing Icon…"/"Add Close icon…") read as Figma-side component edits, not RestaurantUI
  doc-page tickets — don't mistake those for dev progress on this item.
- **Accordion** — design done 2026-07-30. **Discrepancy, needs a status check:** OR-13005 shows
  `Ready For Prod` in Jira (which usually means dev is finished, just not deployed), but Accordion
  is not actually in `style-guide-v2.nav.ts` on `master`. Don't trust that ticket's status at face
  value until someone confirms which is right.

**No Figma-brief tracking visibility either way — don't assume Figma status without checking the
file directly, this part of the list is dev-side only:**
- Action Select
- "Buttons (Standard)" — the plain native-`<button>` pattern (distinct from the Orderly Button
  wrapper, which is Complete above)
- "Button Group" as its own concept (distinct from the Button Group *section on the Button page*,
  which is In Progress — Dev above) — the plain `boss-button-group` wrapper itself has no
  dedicated coverage
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
- Toast Notifications *(service-level toast triggering — distinct from the Toast Item component
  above)*
- Progress Ring
- Progress Bar
- Toggle Buttons *(the legacy hand-rolled `button-select` component — distinct from the new
  `boss-toggle-button-group` being built under OR-13514; still needs its own clarification on
  whether it's superseded or coexists)*
- 3 Button More Menu *(closest V2 concept is Dropdown, but it's a newer general-purpose
  component, not a renamed/ported version of the old `MoreOptionsMenu` — don't assume parity)*

**DatePicker** was flagged in an earlier hand-typed list as "In Progress — Designer" — not
verified here either way. It's absent from the Figma brief's tracked build-order list by name,
so its actual design status is unknown without checking the Figma file directly. Don't assume.
