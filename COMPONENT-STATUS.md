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

*(Nothing currently.)* Popover moved to Not Started 2026-09-25 — Figma design is done (page
`4692:164`, Base Components section), dev hasn't started.

---

## Not Started

Real components exist and are used in production RestaurantUI code for every item below — none
of these are "doesn't exist," only "no dev work actively happening on a style-guide-v2 doc page."

**Design already done in Figma, dev just hasn't started yet (no active ticket found):**
- **Popover** — design done 2026-09-25 (Popover, 4 placements + With Arrow + Content slot; page
  `4692:164`, first page in the new "--- Base Components ---" section). WA: `wa-popover`. Figma
  story: OR-13617. No RestaurantUI nav entry, no dev ticket.
- **Tabs** — design done 2026-09-08 (Tab / Tab Panel / Tab Group). No RestaurantUI nav entry, no
  active Jira ticket — likely needs one opened.
- **Toast** — design done 2026-09-17 (Toast Item). No RestaurantUI nav entry. OR-13530/OR-13531
  ("Add Trailing Icon…"/"Add Close icon…") read as Figma-side component edits, not RestaurantUI
  doc-page tickets — don't mistake those for dev progress on this item.
- **Accordion** — design done 2026-07-30. **Discrepancy, needs a status check:** OR-13005 shows
  `Ready For Prod` in Jira (which usually means dev is finished, just not deployed), but Accordion
  is not actually in `style-guide-v2.nav.ts` on `master`. Don't trust that ticket's status at face
  value until someone confirms which is right.

**Figma design not started — WebAwesome has a matching component, Figma story filed (To Do).**
Build these from the WA kit, not from scratch. Merged from `boss-design-system-docs/Todo.md`
2026-09-25; WA matches checked against webawesome.com/docs/components the same day.
- **Card** — `wa-card` · Figma: [OR-13618](https://diningalliance.atlassian.net/browse/OR-13618) · Dev: OR-11849
- **Drawers** — `wa-drawer` · Figma: [OR-13619](https://diningalliance.atlassian.net/browse/OR-13619) · Dev: OR-11865. See the "quick win" above
  (doc page exists, just needs a nav entry), and reconcile with the existing "Drawer" page in the
  Figma file's To do section
- **File Upload** — `wa-file-input` (Pro) · Figma: [OR-13620](https://diningalliance.atlassian.net/browse/OR-13620). Confirm the WA Pro license
- **Icons** — `wa-icon` · Figma: [OR-13621](https://diningalliance.atlassian.net/browse/OR-13621) · Dev: OR-12017
- **Layout** — `wa-page` · Figma: [OR-13622](https://diningalliance.atlassian.net/browse/OR-13622)
- **Loading Spinner** — `wa-spinner` · Figma: [OR-13623](https://diningalliance.atlassian.net/browse/OR-13623) · Dev: OR-12020
- **Organizational Tree Display** — `wa-tree` + `wa-tree-item` · Figma: [OR-13624](https://diningalliance.atlassian.net/browse/OR-13624) · Dev: OR-11848
- **Quantity Selector** — `wa-number-input` · Figma: [OR-13625](https://diningalliance.atlassian.net/browse/OR-13625)
- **Selectable Split View** — `wa-split-panel` · Figma: [OR-13626](https://diningalliance.atlassian.net/browse/OR-13626)
- **Progress Ring** — `wa-progress-ring` · Figma: [OR-13627](https://diningalliance.atlassian.net/browse/OR-13627) · Dev: OR-12019
- **Progress Bar** — `wa-progress-bar` · Figma: [OR-13628](https://diningalliance.atlassian.net/browse/OR-13628) · Dev: OR-12018
- **BOSS Table** — `wa-data-grid` (Pro) · Figma: [OR-13629](https://diningalliance.atlassian.net/browse/OR-13629). Check the existing Reporting Table
  and Data Grid Figma pages first; the GL/P&L financial reporting table is separate (OR-13482).
  Confirm the WA Pro license
- **Action Toast** — `wa-toast-item` · Figma: [OR-13630](https://diningalliance.atlassian.net/browse/OR-13630). An action-button option on the
  existing Toast Item, not a new component
- **Toast Notifications** — `wa-toast` · Figma: [OR-13631](https://diningalliance.atlassian.net/browse/OR-13631) · Dev: OR-11863. Service-level
  toast triggering (stacking/placement container), distinct from the Toast Item component above.
  Runtime-only, so the story covers documentation, not a new component
- **3 Button More Menu** — `wa-dropdown` · Figma: [OR-13632](https://diningalliance.atlassian.net/browse/OR-13632) · Dev: OR-11862. A pattern on the
  existing Dropdown with an icon-button trigger. Its closest V2 concept is Dropdown, but that's a
  newer general-purpose component, not a renamed/ported version of the old `MoreOptionsMenu` —
  don't assume parity
- **Reusable Animations** — `wa-animation` · Figma: [OR-13633](https://diningalliance.atlassian.net/browse/OR-13633). Runtime-only, so the story
  covers documentation, not a new component

**No WebAwesome component — custom build or pattern, no Figma story yet:**
- Address
- Empty State
- Filter Drawer — a pattern on top of Drawer (OR-13619)
- Financial Calendar Range — closest is `wa-date-picker` (Pro); see the DatePicker note below
- Links — native styles, no component
- Lists
- Multi Unit Division Selector
- Multi Unit Rooftop Selector
- Input Masking (Maskito) — currently folded into Input/Select/Combobox doc pages as a feature,
  not a dedicated entry
- Reusable Colors — tokens, not a component
- Search Bar — a pattern on top of Input
- Sizing — tokens, not a component

**Not yet compared against WebAwesome (no Figma-brief tracking either way — check the Figma file
directly before assuming status):**
- Action Select
- "Buttons (Standard)" — the plain native-`<button>` pattern (distinct from the Orderly Button
  wrapper, which is Complete above)
- "Button Group" as its own concept (distinct from the Button Group *section on the Button page*,
  which is In Progress — Dev above) — the plain `boss-button-group` wrapper itself has no
  dedicated coverage. WA has `wa-button-group`
- Toggle Buttons *(the legacy hand-rolled `button-select` component — distinct from the new
  `boss-toggle-button-group` being built under OR-13514; still needs its own clarification on
  whether it's superseded or coexists)*

**DatePicker** was flagged in an earlier hand-typed list as "In Progress — Designer" — not
verified here either way. It's absent from the Figma brief's tracked build-order list by name,
so its actual design status is unknown without checking the Figma file directly. Don't assume.
