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
- Toggle → `boss-toggle` (OR-13514, merged 2026-10-01). Replaced the legacy `button-select`, which
  was deleted after every usage moved over
- Organizational Tree → `boss-tree` (wraps `wa-tree`; dev BOPD-816 Done, doc page "Tree" in `style-guide-v2.nav.ts`). Figma
  [BOPD-869](https://diningalliance.atlassian.net/browse/BOPD-869) Done 2026-10-09: page `5176:162`, Tree Item `5177:306` (30 variants incl. WA selection
  model) + Tree `5177:307`. Follows the shipped look, not WA (raised with dev on BOPD-816). boss-tree has no `selection` input yet.
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
- **Spinner** — `boss-spinner` wraps `wa-spinner` · Dev: [PR #9722](https://github.com/orderlyapp/orderly/pull/9722)
  (BOPD-836), Testing (QE), not yet merged (includes the style-guide-v2 doc page) · Figma:
  [BOPD-878](https://diningalliance.atlassian.net/browse/BOPD-878) (Done 2026-10-09), **design built 2026-10-08** on page
  "Spinner (Steve)" `5135:162` in Base Components, set `5135:179`: Size Inline (16px, 2px track, Color
  Default / Brand / On Filled, track = arc at 25%) / Section (64px, 4px track, brand arc on gray/90).
  Built from the spec (the WA 3 kit has no Spinner). The branded bowl page loader is still out of scope.
  Design decisions 2026-10-09 (posted on PR #9722): remove `indicatorColor`/`trackColor`, keep the
  inline track at currentColor 25%, keep Section at 64px/4px, add an optional Section label (built in
  Figma as Label + Label Text), and use skeleton rows for empty loading tables. The bowl page loader is
  deferred to its own ticket. (OR-13623 and OR-12020 are the old keys of BOPD-878 and BOPD-836.)

**Quick win found along the way:** `components/boss-drawer/boss-drawer-doc.component.ts` is
fully built on disk (ts/html/scss all present) but has **no entry in `style-guide-v2.nav.ts`** —
one line away from being live, not a from-scratch build. `AGENTS.md` even treats it as the
reference example for future doc-page authors, but it's currently unreachable in the actual UI.
(Not listed as its own bucket item here since Drawer Figma work is now tracked under
"In Progress — Designer" below.)

---

## In Progress — Designer

- **Date Input / DatePicker + Financial Calendar Range** — `wa-date-input` + `wa-date-picker` (Pro) · Dev:
  [BOPD-921](https://diningalliance.atlassian.net/browse/BOPD-921) (v1 = Single + Range; week / period / year modes are v2). No Figma ticket.
  Figma build 2026-10-09 on page "Date Input (Steve)" `5200:162`, rebuilt to the WA spec and covering every option
  today's `datepicker` and `financial-calendar-range` offer. **Date Input** `5203:632`: Type Single / Range / Stepper × Input's states, 15 variants.
  **Date Calendar** `5202:1686`: Calendar Standard / Fiscal × Selection Day / Range / Week / Month / Year, plus Presets / Footer /
  Calendar Toggle / Week Numbers booleans (off). Fiscal Range (select-based) was built, then removed the same day by user decision: fiscal Year / Period / Week are picked in Date Calendar Fiscal. Atoms: Calendar Day
  `5200:183`, Calendar View Item `5200:194`. Priscilla's WIP page `4340:13854` is untouched. Open (page To-Do): outside days on vs WA
  default off, fiscal P/W column needs custom dev rendering, v2 story, preset list, review with Priscilla.
- **Selectable Split View / Split Panel** — `wa-split-panel` · Figma: [BOPD-857](https://diningalliance.atlassian.net/browse/BOPD-857) (was OR-13626). Figma
  build 2026-10-09 on page "Split Panel (Steve)" `5192:162`: `Split Panel` set `5192:217` built to the WA spec (Orientation × Divider
  Plain/Handle × State Default/Focus × Position 25/50/75 = 24 variants, Start/End instance-swap slots, placeholder `5192:163`) plus a
  Tree → Card list/detail example. **Open, asked Tom on BOPD-857:** what ships is a different custom component,
  `boss-selectable-split-view` (Left / Both / Right `boss-toggle` above two panes, no divider, used in Bank Rec). Nothing uses
  `wa-split-panel`. Direction pending: document the shipped one, migrate it to wa-split-panel, or keep both.
- **BOSS Table** — `wa-data-grid` (Pro; WebAwesome Pro 3.11 already ships in RestaurantUI) · Figma:
  [OR-13629](https://diningalliance.atlassian.net/browse/OR-13629). Figma build started 2026-10-07 on page `5027:162` (WIP section): one table with
  `Size` Standard (list screens, today's TanStack-based `boss-table`) / Report (financial statements,
  built from the Reporting Table components) × State Default / Loading / Empty / No Results, plus
  Standard header cell, cell, row, toolbar, pager and state-panel building blocks, and an Examples
  section. Second pass the same day: links and inline editors in cells, focus / resize / filter /
  column-menu headers, multi-period + variance alignment fixed in the Reporting Table components, row
  selection, collapsed-total rows, gray only in headers. Reporting Table and Data Grid pages archived 2026-10-07. Cells merged the same day: Table Cell and Table Header Cell now have Size = Standard | Report, and all instances use them (the Reporting Table rows still live on the archived page). Rows merged the same day (Table Row has Size = Standard | Report). Combo Cell, GL title cells and Sort moved over too (Table Cell Pair, Table Tree Cell, Table Sort), so BOSS Table no longer depends on the archived page. Open: a dev conversation on `wa-data-grid` gaps (inline
  editing, spanning headers, subtotal rows).
  **Loading → skeleton rows, 2026-10-09 ([BOPD-1167](https://diningalliance.atlassian.net/browse/BOPD-1167) Done; dev [BOPD-1177](https://diningalliance.atlassian.net/browse/BOPD-1177)):** State=Loading = live header + 5 new
  `Table Row` Type=Skeleton rows (both sizes; bars inside real column cells, following column widths). A new **Skeleton** component
  (`5197:167`, page "Skeleton (Steve)" `5197:162`) was imported from the WA kit and rebound. A new support variant was added: Table Cell Size=Standard, Type=Empty.
- **Drawer** — `wa-drawer` · Figma: [OR-13619](https://diningalliance.atlassian.net/browse/OR-13619) · Dev: OR-11865 (tickets already
  existed under "Not Started," merged from `boss-design-system-docs/Todo.md` 2026-09-25 — moved
  here now that real Figma work is underway). Figma build in progress, started 2026-10-05. Built
  so far: **Drawer Header** (Large/Medium/Small variants — editable Title/Subtitle text
  properties, Font Awesome icon glyphs exposed as TEXT properties, Icon Group/Header Subtext
  1/Header Subtext 2/Tag each independently togglable via BOOLEAN properties defaulting to
  **hidden**, responsive wrap on Large/Medium with title truncation, all text tied to shared text
  styles — Heading/3, Body/1, Body/2 — rather than raw overrides); **Drawer Body**
  (Large/Medium/Small, clipped/scrollable content area with a scroll-thumb affordance); and a
  composed **Drawer** panel (Header + Body stacked, `Elevation/Overlay` shadow) for all three
  sizes. Not yet built: the real `placement` (start/end/top/bottom) and `type` (primary/stacked)
  axes from the actual `boss-drawer` code spec (`restaurantui-token-system-for-ux.md` — type
  changes Medium/Large width, e.g. primary large = 95vw vs stacked large = 90vw). No RestaurantUI
  dev-side doc-page work has started (see the "quick win" note under "In Progress — Dev" above).

---

## Not Started

Real components exist and are used in production RestaurantUI code for every item below — none
of these are "doesn't exist," only "no dev work actively happening on a style-guide-v2 doc page."

**Design already done in Figma, dev just hasn't started yet (no active ticket found):**
- **Colour Roles + Sizing (token reference pages)** — not components. Figma story [BOPD-1184](https://diningalliance.atlassian.net/browse/BOPD-1184) (Done 2026-10-09). Built 2026-10-09: "Colour Roles (Steve)" `5225:162` (all 91 `color/*` roles with a swatch bound to the live variable,
  code name, light value and use, plus the decided rules) and "Sizing (Steve)" `5226:162` (spacing ladder with Sass and WA names, radius, control sizes, effect styles,
  z-index, layout dimensions). They sit after Foundations, which keeps the raw palette, the spacing use cases and the typography.
- **Filter Drawer + Search Bar** — shipped `<filter-drawer>` (29 usages) and `<search-bar>` (48), no WA equivalent. Figma story [BOPD-1182](https://diningalliance.atlassian.net/browse/BOPD-1182) (filed 2026-10-09). **Design built 2026-10-09**
  on page "Filter Drawer (Steve)" `5221:3845`: `Search Bar` `5221:3920` (State × Width Fixed / Full, from Input) and `Filter Drawer` `5221:19847` (State Collapsed /
  Expanded × Filters None / Applied; Top Header, Dark Panel, Top Header Content / Filter Row swap slots, Filter Count). **Correction:** the Filter Drawer isn't
  a Drawer overlay (this file said it was a pattern on Drawer, OR-13619): it's an inline collapsible filter bar on `boss-details`. Open: rename it
  (boss-filter-bar?), clean up its raw colours / `sl-input` styling, and decide the one default panel look. Also fixed: Input's Focus variant now shows its start icon.
- **Empty State** — shipped `<empty-state>` (`BossEmptyStateComponent`, 42 screens), no WA equivalent, no Figma ticket. **Design
  built 2026-10-09** on page "Empty State (Steve)" `5206:19089`, set `5206:19120`: Layout Standalone / Flush (= `flushLayout`), Icon + Icon
  Glyph (`empty-set`), Heading, Subheading, Actions (Outlined Brand) + Secondary Action (Plain = `isLinkDisplay`), matching code spacing (8 / 4 / 24).
  BOSS Table State=Empty / No Results now use it (Flush), replacing the Table State Panel (2026-10-09). Open: rename the selector to
  `boss-empty-state`.
- **Icons (documentation)** — Font Awesome 7 Pro glyphs, no Icon component (standing decision 2026-07-20) · Figma:
  [BOPD-876](https://diningalliance.atlassian.net/browse/BOPD-876) (was OR-13621, Done 2026-10-09) · Dev: [BOPD-844](https://diningalliance.atlassian.net/browse/BOPD-844) (was OR-12017; only the 3 raw `sl-icon` → `wa-icon`;
  `fa-icon` stays). Page "Icons (Steve)" `5201:166`, built 2026-10-09: sizes / weights with code classes, colour roles, 24 common glyphs, glyph editing.
- **Toast Notifications (documentation)** — `wa-toast` container · Figma: [BOPD-863](https://diningalliance.atlassian.net/browse/BOPD-863) (was OR-13631, Done 2026-10-09) · Dev:
  [BOPD-916](https://diningalliance.atlassian.net/browse/BOPD-916) (was OR-11863, To Do). A "Toast / Notifications (wa-toast)" section was added to the Toast page on 2026-10-09:
  placement map (default top-end), stacked example, duration guidance, code, legacy alert-service notes. Open: Toast Item 360px vs WA 448px stack, optional title.
- **Reusable Animations (documentation)** · Figma: [BOPD-860](https://diningalliance.atlassian.net/browse/BOPD-860) (was OR-13633, Done 2026-10-09). Page "Animations (Steve)"
  `5203:796`, built 2026-10-09: WA transition tokens (75/150/300ms ease) + the app's Angular animation library (`src/app/animations`), guidance,
  and a Smart Animate toast prototype. `wa-animation` is unused. Open: align library timings to WA tokens, add reduced-motion support.
- **Icon Button + More Menu** — `orderly-button` (icon-only) + `wa-dropdown` · Figma: [BOPD-859](https://diningalliance.atlassian.net/browse/BOPD-859) (was OR-13632, Done 2026-10-09) ·
  Dev: [BOPD-917](https://diningalliance.atlassian.net/browse/BOPD-917) (was OR-11862, To Do: sl-menu → wa-dropdown incl. moreOptionsMenu). **Design built 2026-10-09**
  on page "Icon Button (Steve)" `5182:198`: new `Icon Button` set `5182:343` (36 variants cloned from Button: Neutral Plain +
  Brand Filled/Outlined/Plain × S/M/L × Default/Hover/Disabled, square, `Icon Glyph` default `ellipsis-vertical`) and a More Menu
  pattern section (Neutral Plain trigger + Dropdown Items + Divider + Danger item), listing legacy MoreOptionsMenu behavior WA
  doesn't cover (disabled-item tooltip, stay-open default, stopImmediatePropagation, left-start placement). Card's Actions /
  Footer Actions slots now default to Icon Button (swapped 2026-10-09). The old "Card Action" stand-in was deleted.
- **Quantity Selector** — `wa-number-input` · Figma: [BOPD-870](https://diningalliance.atlassian.net/browse/BOPD-870) (was OR-13625, Done 2026-10-09) · Dev:
  [BOPD-1168](https://diningalliance.atlassian.net/browse/BOPD-1168) (To Do). **Design built 2026-10-09** on page "Quantity Selector (Steve)" `5171:162` in Base Components, set
  `5171:332`: built from our Input (the WA 3 kit has no Number Input). `State` Default/Focus/Error/Error Focused/Disabled
  × `Limit` None/Min/Max (13 variants), plus Value, Steppers, Label, Required, Hint, Error Text. Decided 2026-10-09: WA neutral
  steppers inside the field, 120px default width. Code drift: `quantity-selector` (Ordering spec item, supplier
  cart) uses red/green circle icons outside a 48px box. The `boss-*` wrapper name is still open.
- **Progress Bar** — `wa-progress-bar` · Figma: [BOPD-855](https://diningalliance.atlassian.net/browse/BOPD-855) (was OR-13628, Done 2026-10-09) · Dev:
  [BOPD-842](https://diningalliance.atlassian.net/browse/BOPD-842) (was OR-12018, To Do). **Design built 2026-10-09** on page "Progress Bar (Steve)"
  `5168:181` in Base Components, set `5168:222`: imported from the WA 3 kit, detached, rebound. `Value`
  0/25/50/75/100/Indeterminate + `Label` text inside the fill. Decided 2026-10-09: WA defaults (16px, brand blue
  on `color/bg/neutral/subtle`, label inside). Code drift for BOPD-842: `boss-progress-bar` still wraps
  `sl-progress-bar` at 9px with an orange `$alert-orange` fill, and the overview Budget / AdminUi billing bars
  use raw `sl-progress-bar` with status colors that this component doesn't model.
- **Floating Action Bar** — `boss-floating-action-bar` (tag name decided 2026-10-08). Figma story
  [BOPD-1042](https://diningalliance.atlassian.net/browse/BOPD-1042). Iteration 1 was rebuilt from 0.1 components on 2026-10-06 (page `942:2`, section
  "Iteration 1 — v0.1 rebuild"). Each action slot is a Button or a Dropdown Trigger, all Plain,
  with no Filled primary button. No WebAwesome equivalent. Dev: [BOPD-897](https://diningalliance.atlassian.net/browse/BOPD-897) is ready to be picked up
  and assigned to Hung (2026-10-08). Metric Group and No Actions Available options added to the
  Figma component 2026-10-08 (both required).
- **Radio Group** — design done 2026-09-29 (Radio Group: Orientation × Appearance Default/Button ×
  Disabled, Medium only, plus a new Radio Button building block; page `4754:162`, Base Components
  section). WA: `wa-radio-group` + `wa-radio appearance="button"`. Figma story: [OR-13675](https://diningalliance.atlassian.net/browse/OR-13675) · Dev: OR-11860. The
  existing Radio (Complete above) covers the single-radio atom only.
- **File Upload** — design done 2026-10-07 (File Upload: State Default/Dragging/Disabled × Files
  Blank/With Files, plus a File Upload Row building block; Medium only; page `5012:162`, Base
  Components section). WA: `wa-file-input` (Pro, not in the kit; built from the old library's File
  Upload). Figma story: [OR-13620](https://diningalliance.atlassian.net/browse/OR-13620). No RestaurantUI nav entry, no dev ticket
  found. Confirm the WA Pro license before dev starts.
- **Popover** — design done 2026-09-25 (Popover, 4 placements + With Arrow + Content slot; page
  `4692:164`, first page in the new "--- Base Components ---" section). WA: `wa-popover`. Figma
  story: OR-13617. No RestaurantUI nav entry, no dev ticket.
- **Card** — design done 2026-09-25 (Card, 5 Appearances × 2 Orientations + header/media/footer/
  action slots; page `4699:249`, Base Components section). WA: `wa-card`. Figma story: OR-13618.
  Dev: OR-11849 (sl-card → wa-card), not started.
- **Tabs** — design done 2026-09-08 (Tab / Tab Panel / Tab Group). No RestaurantUI nav entry, no
  active Jira ticket — likely needs one opened.
- **Toast** — design done 2026-09-17 (Toast Item). No RestaurantUI nav entry. OR-13530/OR-13531
  ("Add Trailing Icon…"/"Add Close icon…") read as Figma-side component edits, not RestaurantUI
  doc-page tickets — don't mistake those for dev progress on this item. **Action Toast
  ([OR-13630](https://diningalliance.atlassian.net/browse/OR-13630)) designed 2026-10-07** as an `Actions` option on this Toast Item (one or two small
  Buttons under the message), so it is no longer a separate not-started item.
- **Accordion** — design done 2026-07-30. **Discrepancy, needs a status check:** OR-13005 shows
  `Ready For Prod` in Jira (which usually means dev is finished, just not deployed), but Accordion
  is not actually in `style-guide-v2.nav.ts` on `master`. Don't trust that ticket's status at face
  value until someone confirms which is right.

**Figma design not started — WebAwesome has a matching component, Figma story filed (To Do).**
Build these from the WA kit, not from scratch. Merged from `boss-design-system-docs/Todo.md`
2026-09-25; WA matches checked against webawesome.com/docs/components the same day.
- **Layout** — `wa-page` · Figma: [OR-13622](https://diningalliance.atlassian.net/browse/OR-13622)
- **Progress Ring** — `wa-progress-ring` · Figma: [OR-13627](https://diningalliance.atlassian.net/browse/OR-13627) · Dev: OR-12019. **Deprioritized 2026-10-09: back of the
  line, after every other remaining component except Button Group** (which stays last).

**No WebAwesome component — custom build or pattern, no Figma story yet:**
- Address
- Links — native styles, no component
- Lists
- Multi Unit Division Selector
- Multi Unit Rooftop Selector
- Input Masking (Maskito) — currently folded into Input/Select/Combobox doc pages as a feature,
  not a dedicated entry

**Not yet compared against WebAwesome (no Figma-brief tracking either way — check the Figma file
directly before assuming status):**
- Action Select
- "Buttons (Standard)" — the plain native-`<button>` pattern (distinct from the Orderly Button
  wrapper, which is Complete above)
- "Button Group" as its own concept — the plain `boss-button-group` wrapper has no dedicated
  coverage (the segmented single-select pattern shipped separately as Toggle, Complete above).
  WA has `wa-button-group`. **Deprioritized 2026-10-07: do this last, after everything else on
  this list** (the product doesn't use it much on the site).

**DatePicker** and **Financial Calendar Range** moved to In Progress — Designer on 2026-10-09 (Date Input build).
