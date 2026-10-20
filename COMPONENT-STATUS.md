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

## Sync audit, recompiled 2026-10-20 from the qe1 style guide — what is out of date or out of sync (the to-do list)

Compared five sources. **How each was verified:**
- **Style guide v2** (saved in `styleguideV2/`, refresh weekly, see `CLAUDE.md`) — the saved **qe1** page `styleguideV2/Back Office.html` (replaced 2026-10-20; the main source now): 24 component pages + the Popup utility, live read of its sidebar. The two pages in `styleguideV2/components/` (Document Viewer, Document Strip) were saved from **qe2** and are not in the qe1 sidebar (see H). Neither environment is prod. The Patterns / UX Standards / Tokens groups exist but their entries are not visible.
- **WebAwesome** — webawesome.com/docs/components index, live fetch.
- **Figma 0.1** (`B5j3nfocmShiBwqwy9dNXg`) — all ~70 page names re-read live 2026-10-20 (only change since 2026-10-19: the two pages added this session), plus the component sets inside the Organizational Tree and BOSS Table pages. Other pages' contents were **not** opened, so a component hidden inside another page would be missed.
- **Old Figma library** ("Back Office Design Library", `wdwwm6VbBU89GFViEvcfkY`) — all page names read live, plus component names on 5 pages (Final Components, Base, Buttons & Button Groups, Navigation, Table). Not every page was opened.
- **Old style guide v1** (`#/styleGuide`) — read from the orderly master snapshot of Oct 2 (`3657a07ecec`), not from qe2. WA registrations (`webawesome-imports.ts`) are from the same snapshot.
- **Not re-checked:** Jira statuses of the older tickets, prod vs qe1/qe2, and any v2 change after the saved pages.

### A. Figma actions
`[ ]` not started · `[~]` first pass built, not published or finished · `[x]` done.
- [ ] **Copy Button** — in v2 on qe1 and qe2 (experimental, minimal), no Figma page. WA has `wa-copy-button`; check the WA kit first, build from it.
- [ ] **Document Viewer** — in the **qe2** v2 style guide only (experimental, standard; not in the qe1 build, see H), no WA equivalent (custom). **Parked 2026-10-20:** the Figma first pass (page "Document Viewer (Steve)") and story BOPD-1566 were removed and archived by decision, since the component may be unmerged. Revisit if it lands in the up-to-date build; the spec was read from the qe2 style guide page.
- [ ] **Document Strip** — in the **qe2** v2 style guide only (experimental, minimal; not in the qe1 build, see H), no WA equivalent (custom). **Parked 2026-10-20:** the Figma first pass (page "Document Strip (Steve)") and story BOPD-1566 were removed and archived by decision. Revisit if it lands in the up-to-date build.
- [ ] **Report Tree** — in v2 on qe1 and qe2 (experimental, minimal), no Figma page. The Organizational Tree page holds only Tree Item + Tree. Check the archived Reporting Table page before building.
- [ ] **Toast (Steve)** `4381:162` sits below the "--- Archive ---" divider but is a current component (Toast Item, Action Toast). Move it above the divider. Same for the Toast notifications section.
- [ ] **Datepicker (Priscilla)** `4340:13854` also sits below "--- Archive ---" with no `[Archived]` tag; Date Input (Steve) replaces it. Rename `[Archived]`, don't delete.
- [ ] **Tabs (Steve)** `3900:2` sits in "--- Dev Picked Up ---", but v2 on qe1 now has a **Tabs** page (experimental, standard). Designed and documented: move the page into "--- In Style Guide V2 ---" and link the dev ticket (none was found). Tabs moved to Complete below.
- [ ] **Accordion** `1142:2` sits in "--- In Style Guide V2 ---" but v2 has no Accordion page; v2 has **Details** (wraps `wa-details`). Confirm they are the same component, then rename the Figma page to match (the code name wins) or add the missing page. Jira OR-13005 reads "Ready For Prod", which also needs a check.
- [ ] **Tabbing Focus State Guidelines** `1103:2` is in "--- In Style Guide V2 ---" but is a guideline, not a component. Move it to Foundations, or add a matching page under v2 UX Standards.
- [ ] **Figma Foundations and Colour Roles / Sizing** are built but v2's Tokens group is a stub (OR-11841). Hand `Colour Roles (Steve)` `5225:162` and `Sizing (Steve)` `5226:162` to dev as the content.

### B. Style guide v2 actions (Figma is designed, no page in the qe1 style guide)
WA tag registered in `webawesome-imports.ts` (Oct 2 snapshot) means the page is cheap to add.
- [ ] **Card** — `wa-card` (registered), dev OR-11849
- [ ] **Toast** — `wa-toast` (registered), dev BOPD-916
- [ ] **Drawer** — `wa-drawer` (registered). The doc page is built on disk but has **no entry in `style-guide-v2.nav.ts`**, and it is still not in the qe2 sidebar. One line from live.
- [ ] **Popover** — `wa-popover` (registered). v2's Popup utility is a different thing (`wa-popup`).
- [ ] **Skeleton** — `wa-skeleton` (registered), dev BOPD-1177
- [ ] **Icons** — `wa-icon` (registered); documentation page, dev BOPD-844
- [ ] **Progress Bar** — `wa-progress-bar` (not registered), dev BOPD-842
- [ ] **Quantity Selector** — `wa-number-input` (not registered), dev BOPD-1168
- [ ] **Split Panel / Selectable Split View** — `wa-split-panel` (not registered), dev BOPD-1211
- [ ] **Date Input** — `wa-date-input` + `wa-date-picker`, Pro (not registered), dev BOPD-921
- [ ] **File Upload** — `wa-file-input`, Pro (not registered). Confirm the WA Pro licence.
- [ ] **BOSS Table** — `wa-data-grid`, Pro (not registered)
- [ ] **Icon Button + More Menu**, **Floating Action Bar** (dev BOPD-897), **Empty State** (rename to `boss-empty-state`, BOPD-1187), **Search Bar**, **Filter Drawer**, **Form** with Money Input, Numeric Set Input and Address (BOPD-1230 to 1233) — custom, no WA tag. v2's Patterns group has no entries, so these are candidates for it.
- [ ] **Field Message**, **Checklist Item / Status Row**, **Animations** — new in Figma, no v2 page. Decide component page vs Pattern.

### C. WebAwesome components in neither v2 nor Figma
- **Likely relevant, not tracked anywhere:** Avatar, Carousel, Scroller, Pagination (only exists as Table Pager), Stepper / Step, Slider, Rating, Tag Input, Time Input, OTP Input, Checkbox Group, Color Picker. Decide yes / no for each. Avatar, Carousel and Scroller are already registered in `webawesome-imports.ts`, so code is ahead of both docs.
- **Already on the backlog, not built:** Button Group (last), Progress Ring (back of the line), Page (Layout, BOPD-877).
- **Probably not relevant:** charts, Sparkline, QR Code, Video, Video Playlist, Zoomable Frame, Markdown, Comparison, Animated Image, and the observer / format / include utilities.

### D. Old style guide v1 leftovers (no v2 page)
Still only in the legacy guide. Decide for each: migrate to v2, replace with a WA component, or retire.
- **Designed in Figma 0.1, needs a v2 page** (see B): `quantity-selector`, `file-uploader`, `boss-selectable-split-view`, `boss-progress-bar`, `boss-progress-ring` (no Figma yet), `financial-calendar-range` + datepicker, `boss-drawer`, `filter-drawer`, `search-bar`, `empty-state`, `boss-address`, `more-options-menu`.
- **No v2 page and no Figma 0.1 page:** `boss-header-info`, `boss-list-item`, `tab-bar` (probably superseded by the new v2 Tabs page; confirm), `boss-page-content`, `action-select`, `boss-button-group`, `boss-multi-unit-division-selector`, `boss-multi-unit-rooftop-selector`, `boss-toast-action-bar`.
- Directive guide (`bossPopover`) is covered by v2 Popup. The old playgrounds (form, table) are covered by Form and BOSS Table in Figma but not in v2.

### E. Old Figma library not carried into 0.1
Found by page and component name in the old library; each needs a decision (rebuild in 0.1, replace, or drop). 0.1 has no page for any of these:
- [ ] **Navigation** (Back Office Navigation, Global Settings Nav, Sub Nav, Restaurant Picker, nav icons) — 18+ components, the largest gap
- [ ] **Page Header / Page Heading** and **Top Bar** (code: `boss-page-content`, `boss-header-info`)
- [ ] **Menu** and **Menu / COA-GL**
- [ ] **Audit / History Log**
- [ ] **Financial Reporting Card**
- [ ] **Multi Unit Selector**
- [ ] **List** (code: `boss-list-item`)
- [ ] **Price Range Picker** and **Password Input**
- [ ] **Island**, **Disclosure Button**, button "decision group" and "view details" variants, **Scrollbar**, **Ordering Add Item**, **Accounting Tags / Bank Account Use**
- [ ] Old documentation pages with no 0.1 equivalent: Negative Numbers, Selection Bar, Panel Slide Out, Voice of the Product, Loading Screens (partly covered by Spinner + Skeleton), Dialogs, Layout, Search
- Covered in 0.1 under a new name: Alert → Callout, Tab Group → Tabs, Toasts → Toast, Datepicker / Date Range Picker → Date Input, Paginator / Table Pagination → Table Pager, Report Table / Table → BOSS Table, Toggle Button → Toggle, Dropdown Select → Select, Form (for Drawer) → Form, File Upload, Empty State, Floating Action Bar, Drawer, Tooltip, Checkbox, Input, Dialog.

### F. Docs out of sync
- [x] **Switch, Tooltip, Dialog, Spinner** were listed here as unmerged or in QE; all four are on the v2 sidebar on both qe1 and qe2. Moved to Complete below. Their Jira statuses (OR-13001, OR-13002, OR-13003, BOPD-836) were **not** rechecked, and Spinner's follow-up PR #9736 (BOPD-1185) status is unknown.
- [x] This file did not mention **Report Tree, Copy Button, Document Strip or Document Viewer**. Added in A. **Tabs** was listed as having no v2 page; qe1 has one (moved to Complete).
- [ ] **`manifest.json`** indexes 14 components. v2 on qe1 has 24 + Popup. Missing (11): Dialog, Divider, Dropdown, Radio, Split Button, Spinner, Tabs, Tree, Report Tree, Copy Button, Popup (plus Document Viewer and Document Strip if they merge). `CLAUDE.md` calls this file a first stop for tag names, so it needs a refresh.
- [ ] **`BOSS-Design-System-Project-Brief.md`** page list lags the file (it says so itself): Toast (Steve) and Datepicker (Priscilla) positions, and the pages added since 2026-10-08.
- [ ] **qe1 vs qe2 vs prod**: Complete here means "on the qe1 style guide". Check which of the newest pages are on prod. See H for the two environments that disagree.

### G. Button review 2026-10-20 — what must change so Figma, code and the style guide match
**How verified:** Figma Button (`3941:32`, 75 variants) and Icon Button (`5182:343`, 36 variants) read live; `orderly-button` source (`OrderlyButton.component.ts`) and usage counts read from the Oct 2 orderly master snapshot, **RestaurantUI only** (AdminUi not scanned); tokens from `tokens.json` (synced 2026-10-05). **Not done:** a scan of every Figma page for hand-built buttons (needs ~70 pages opened one at a time; better as a file-wide audit on Opus) and a check of how each variant looks in the running app.

**Why code and Figma names differ (by design).** Dev wraps the Web Awesome library in Angular components: `orderly-button` wraps `wa-button`, the `boss-*` components wrap their `wa-*` counterparts. Figma follows WA's own variant model, so the Figma name, the wrapper tag and the wa tag will not match one for one, and that gap is expected, not drift. Only differences inside a wrapper's own API (legacy variant names, options with no Figma counterpart) are action items below.

**What the code does.** `orderly-button` still carries a shim (to be removed once OR-11958 sweeps every call site): legacy `default` → wa `neutral` + `outlined`, `primary` → `brand` + `accent`, `text` → `brand` + `plain`, `outlineButton` → `outlined`, anything else → `filled`; size `icon` → `s`. The code comment says neutral has no filled form in the DS v2 spec.

**Usage (606 `<orderly-button>` in 170 files):** `text` 192 · `primary` 190 · none 94 (= default) · `default` 45 · `brand` 36 · `neutral` 15 · `danger` 13 · `warning` 8 · `success` 2 · `secondary` 1 · the rest bound to expressions. 427 calls (70%) use legacy names, 521 (86%) counting calls with no variant. Options: `outlineButton` 52, `customWidth` 34, `caret` 19, `pillButton` 14, `circleButton` 6, `size="icon"` 4. Also 37 raw `sl-button`, 1 raw `wa-button`, 9 `boss-button-group`.

**Figma actions**
- [ ] **Add Neutral + Outlined to Button** (Small / Medium / Large × Active / Default / Hover / Disabled / Loading). It is what `default`, `neutral` and every call with no variant render: about 154 calls, 25% of all buttons. Figma Button has Brand and Danger only.
- [ ] **Add Neutral + Outlined to Icon Button.** Neutral is Plain only today; icon-only buttons in code inherit the neutral outlined default.
- [ ] **Decide Warning and Success** (8 and 2 calls in code, no Figma variant): add them, or retire them in code.
- [ ] **Danger look:** Figma draws Danger as `accent` (solid); the wrapper gives non-brand variants `appearance="filled"` unless `outlineButton` is set, so code may render a soft fill. Check the running app, then fix whichever side is wrong. Danger Outlined and Plain do not exist in Figma.
- [ ] **Label type:** the code has one button label token, `label-button` (14px / 20px / 500). Figma Button labels have **no text style** and use raw 12 / 16 / 20px by size. Confirm whether wa-button scales the font by size (then add per-size styles), or bind to Label/Button.
- [ ] **Unused legacy text styles** in the file, with one-off names: Small / Medium / Large Button, Small / Medium / Large Icon Button (plus h1-h3, Body 1/2, Subtitle 1/2 duplicates of the slash-named styles). Remove or document; do not delete without confirmation.
- [ ] **Options with no Figma counterpart:** pill (14), circle (6), caret (19; Dropdown Trigger covers some), custom width (34). Add as options or retire in code. `size="icon"` (4) maps to Small.
- [ ] `link` appearance exists in Figma; in code it is reachable only through `appearance="link"` (1 call). WA's `filled` and `filled-outlined` are not in Figma.

**Code actions (dev)**
- [ ] Finish the OR-11958 sweep: `primary` → `brand` (accent), `text` → `brand` + `appearance="plain"`, `default` and no-variant → `neutral`, drop `size="icon"`, then delete the shim.
- [ ] **`variant="secondary"`** (1 call) is not a valid variant; find it and fix.
- [ ] Replace 37 raw `sl-button` and 1 raw `wa-button`, and the hand-built buttons (BOPD-1186), with `orderly-button`.
- [ ] **Wrapper tag naming (low priority):** the `orderly-*` wrappers (`orderly-button`, `orderly-checkbox`, `orderly-split-button`) and the newer `boss-*` wrappers follow two prefixes (FIGMA-WORKFLOW-NOTES §6 sets `boss-*` going forward). Both wrap WA, so this is a dev choice: rename or document the exception. `manifest.json` should list the real tags.
- [ ] Document Strip's tile focus ring (qe2 only) uses a 2px `border-strong` outline; the standard is the Focus/Ring style. Moot until the component merges.

**Style guide v2 actions**
- [ ] Button page: show Neutral Outlined as the default, mark `primary` / `text` / `default` deprecated, document `warning` / `success` or remove them, and add pill / caret / custom width if they stay.

### H. qe1 and qe2 style guides disagree (found 2026-10-20)
Same `#/styleGuideV2` page, two builds (qe1 `main-OZLZUUIK.js`, qe2 `main-HBQSRVNM.js`). Comparing the sidebars:
- **Only on qe1:** Tabs.
- **Only on qe2:** Document Viewer, Document Strip.
- Everything else is identical: 23 components plus Popup, with the same status and tier labels.
- [ ] **Find out why.** Most likely each environment runs a different branch. Check which branch or PR adds Tabs, and which adds Document Viewer and Document Strip, and whether they are merged to `master`. The qe1 page was supplied as the more up-to-date one, so Document Viewer and Document Strip may still be unmerged work.
- [x] Figma pages for both components and story BOPD-1566 were removed and archived 2026-10-20 (the ticket had said both "already ship", true only on qe2).
- [ ] If Document Viewer and Document Strip land in the up-to-date build, re-save them from there and restart the Figma work (a new story, since BOPD-1566 is archived).

---

## Complete — designed in Figma AND has a real RestaurantUI style-guide-v2 doc page

Verified 2026-09-23 against both `BOSS-Design-System-Project-Brief.md`'s Figma build order and
`style-guide-v2.nav.ts` on `master` directly — not against Jira ticket wording, which has stale
entries (see the "In Progress — Dev" section). **Re-verified 2026-10-19** against the saved qe2
style guide v2 sidebar and the live Figma 0.1 page list (see the sync audit above).

- Badge
- Button (Orderly) — Figma Appearance renamed 2026-10-13 to match the code: accent (was Filled), outlined, plain, link (was Accent); published 2026-10-14
- Checkbox
- Divider
- Dropdown
- Input
- Radio
- Select
- Split Button
- Tag
- Tabs → `wa-tab-group`; v2 page "Tabs" (experimental, standard) is in the qe1 sidebar (found 2026-10-20, replaces the "no nav entry" note). Figma: Tab / Tab Panel / Tab Group on page `3900:2`, designed 2026-09-08. Dev ticket not found. The old `tab-bar` in the v1 guide is probably superseded (confirm).
- Switch → `boss-switch` (moved from In Progress — Dev 2026-10-19; OR-13001 was Code Review, now in the qe2 v2 sidebar, Jira status not rechecked). Figma checked colour is orange/50 by decision.
- Tooltip → `boss-tooltip` (moved 2026-10-19; OR-13002 was Code Review, now in the qe2 v2 sidebar, Jira status not rechecked)
- Dialog → v2 `dialog` (moved 2026-10-19; OR-13003 was Code Review, now in the qe2 v2 sidebar, Jira status not rechecked)
- **Spinner** (moved from In Progress — Dev 2026-10-19; now in the qe2 v2 sidebar, Jira/prod status not rechecked) — `boss-spinner` wraps `wa-spinner` · Dev: [PR #9722](https://github.com/orderlyapp/orderly/pull/9722)
  (BOPD-836), **merged 2026-10-08**, still Testing (QE) in Jira, not on prod yet (includes the style-guide-v2 doc page) · Figma:
  [BOPD-878](https://diningalliance.atlassian.net/browse/BOPD-878) (Done 2026-10-09), **design built 2026-10-08** on page
  "Spinner (Steve)" `5135:162` in Base Components, set `5135:179`: Size Inline (16px, 2px track, Color
  Default / Brand / On Filled, track = arc at 25%) / Section (64px, 4px track, brand arc on gray/90).
  Built from the spec (the WA 3 kit has no Spinner). The branded bowl page loader is still out of scope.
  Design decisions 2026-10-09 (posted on PR #9722): remove `indicatorColor`/`trackColor`, keep the
  inline track at currentColor 25%, keep Section at 64px/4px, add an optional Section label (built in
  Figma as Label + Label Text), and use skeleton rows for empty loading tables. The bowl page loader is
  deferred to its own ticket. (OR-13623 and OR-12020 are the old keys of BOPD-878 and BOPD-836.)
  **Follow-up: [BOPD-1185](https://diningalliance.atlassian.net/browse/BOPD-1185) (Code Review), [PR #9736](https://github.com/orderlyapp/orderly/pull/9736).** PR #9722 merged before those decisions were posted (comment on #9722, 2026-10-09), so master still had the
  `indicatorColor` / `trackColor` inputs (and the Payroll register pink override) and no Section label. The fix is committed locally on branch
  `steve.mings/BOPD-1185-boss-spinner-remove-overrides-add-label` (removes both inputs, Payroll back to the standard spinner, adds `label`, updates the style-guide page). Opened 2026-10-09; lint and a template type-check pass, not yet run in a browser.
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
- Breadcrumb (Figma Breadcrumb Item Hover changed to `color/text/brand` 2026-10, colour review H1 / hover round I; code hover should be `text-brand`)
- Combobox
- Details
- Textarea
- Popup *(utility)*

---

## In Progress — Dev

Real, active development happening right now — a real PR/ticket in motion, not just "design is
done so it's eligible." If nobody's actually writing code for it today, it belongs in Not Started
below instead, even if the design side is finished.

Nothing is in active dev here right now. Switch, Tooltip, Dialog and Spinner were listed in this section
until 2026-10-19, when all four turned out to be on qe2's style guide v2 sidebar; they moved to Complete.
Jira statuses were not rechecked.

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
  Tree → Card list/detail example. **Direction settled (Tom, BOPD-857, 2026-10-09): go with WA.** `Selectable Split View` set `5265:20092`
  (View = Left / Both / Right, 600 wide) added 2026-10-12: Toggle (Options=3) above a Split Panel instance (Both, exactly 50%) or a single
  full-width pane (Left / Right, no divider). Prototype clicks on the toggle switch views. Pane content is placeholder. Code migration:
  [BOPD-1211](https://diningalliance.atlassian.net/browse/BOPD-1211) (`boss-selectable-split-view` → `wa-split-panel`; used in Bank Rec Matched
  Transactions tab + Match Details drawer). Open: Both → Left → Both returns to 50% or the dragged position (design assumes 50%).
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
- **Form** — `boss-form` (custom composite, no WA equivalent; 14 usages, mostly Drawer bodies) · Figma:
  [BOPD-1223](https://diningalliance.atlassian.net/browse/BOPD-1223) (filed and Done 2026-10-12, under BOPD-826; dev follow-ups filed 2026-10-12: BOPD-1230 to BOPD-1233). Was missing from every list until 2026-10-12.
  Modes View / Edit / Read-only; header with Edit, Cancel, Save and Delete; field rows with label, required `*`, help text, locked-field tooltip, error and
  warning messages; 13 field types. **Atoms audit (live in Figma, 2026-10-12):** already designed = Input, Single Select, Multi Select, Textarea, Date Input,
  Quantity Selector, Switch, Checkbox, Radio Group. **Missing atoms built 2026-10-12, each on its own page after Date Input (Steve):** "Money Input (Steve)"
  `5279:284` (set `5279:232`, cloned from Input, fixed $ prefix; `boss-money-input`), "Numeric Set Input (Steve)" `5282:285` (set `5282:233`, two fields + delimiter +
  Money ($) option; `boss-tuple-input`), "Address (Steve)" `5284:14734` (set `5284:14930`, composed of Input + Single Select instances; `boss-address`). Each has
  Documentation / To-Do / Examples. **The Form itself built 2026-10-12** on page "Form (Steve)" `5287:162`: `Form` set `5288:20665` (Mode View / Edit / Read-only, five-row sample),
  `Form Header` `5287:205` (Mode × Save Enabled/Disabled, Title / Info Tooltip / Show Actions / Delete), `Form Row` `5288:266` (Mode View / View Control / Edit × State Default / Error / Warning;
  Control, Boolean Control, Error Control swap slots), support `Form Quantity Field` `5288:175`. Examples show all 13 field types in Edit plus validation / locked rows.
  Open: header 48px vs code 35px (Icon Buttons); Edit / Delete are bare icons in code; warnings share the error red; raw brand colours in code; a Form has a fixed row count, compose real forms from Header + Rows. Other open: code still wraps Shoelace internals; Edit icon vs Icon Button; Single Select's Disabled look is paler than Input's; Input's Error variants aren't wired to its properties (fixed in the three new sets).
- **Period Close States** — pattern, not a WA component · Figma: [BOPD-1110](https://diningalliance.atlassian.net/browse/BOPD-1110) (epic [BOPD-42](https://diningalliance.atlassian.net/browse/BOPD-42), first of 10 design stories BOPD-1110 to BOPD-1119; it feeds all the others). Built 2026-10-13 on page "Period Close States (Steve)" `5318:162`,
  from existing Badge / Callout / Button / Tooltip plus new components. **Period Status Badge** `5318:212` (State = Open, Soft Close, Overdue, Sealed, Reopened, Needs Review, Pending Approval; wraps Badge, **no colour**, all Neutral: Open / Soft close / Pending Outlined, Reopened / Needs review Filled-Outlined, Sealed Filled + lock, Overdue Accent = the one loud chip). **Locked Marker** `5318:220` (Type Icon / Label, gray).
  **Field Message** (page "Field Message (Steve)" `5326:21175`, set `5326:21185`: Type Error / Warning / Neutral, Show Icon, Message), extracted from the Form Row message. Documentation, To-Do with a status per item, and Examples (soft close, AP signed off, sealed, a Callout per state, the BOPD-304 error / hold copy table).
  The 14 component gaps are drawn on page "Period Close Gaps (Steve)" `5324:162`, each with a STATUS line. **Fixed 2026-10-13:** Alert Banner renamed **Callout** (page "Callout (Steve)" moved into the style guide group; old Alert page renamed "Alert [Archived]" and moved to the archive, not deleted; style guide side of BOPD-1048 still open); Callout message now wraps (Copy / Message Row / Message fill, all 10 variants); Tooltip Content text exposed as an instance property; Field Message built; `manifest.json` Badge tag corrected to `badge`.
  **Open:** Tooltip on a disabled control needs a dev check; Tooltip text can't wrap in this file (Content is a remote component); one-action Callout limit and 993px default width; dev review of the copy. **Decided 2026-10-13:** Callout banners keep their status colours (only the badges are colourless); the Badge End icon stays for now. Then BOPD-1111 to 1119.
- **BOPD-1111 Close dashboard: location view** — design story under BOPD-42 · Figma: [BOPD-1111](https://diningalliance.atlassian.net/browse/BOPD-1111). Built 2026-10-13 in the **epic file** "BOPD-42 Period close" (`zbs8jTlxXJzIXwFhJE0G8b`), page "BOPD-1111 Close dashboard: location view" `1:47`, from the BOSS library (not hand-copied). Seven 1440px screens: Open, Soft close, Soft close ready to seal, Overdue, Sealed, Reopened (year-end), Needs review; three dialogs (seal, sign off AP, undo Payroll sign-off); a notes frame with coverage, open questions and gaps. Uses Period Status Badge, Callout, Locked Marker, Field Message, Button, Single Select, Input, Badge, Table Header Cell / Table Cell, Dialog.
  **Gaps, fixed 2026-10-13 in the design system file:** Card has a `Content` slot (With Content / With Body toggles); Dialog has a `Content` slot (With Content / With Message), so BOPD-1113 can add a reason field; Input, Single Select and Multi Select help text wraps; Table Cell Text types truncate with an ellipsis (link cells don't yet) and the Actions cell has `Action 1 Icon`, `Action 2 Icon` and `Action 2` properties; Table Row has `Column 1` to `Column 7` toggles and exposed cells, so a row can have any set of columns; new **Checklist Item** and **Status Row** components on page "Checklist (Steve)"; Brief now notes the Button appearance names (link / accent / outlined / plain). **Tooltip fixed 2026-10-13:** its text was the remote Web Awesome "Text Node" (left linked when the WA Tooltip was detached); replaced in all 12 variants with a local `Tooltip Content` (`5346:209`, Body/2, hugs to 240px then wraps) and the text is an exposed property. Radio and Switch (8 variants, 13 instances, 47 label uses) moved the same day to a local `Control Label` (`5350:235`, Roboto 16 / 120%, color/text/primary, exposed Label text). **Correction 2026-10-14:** the remaining remote Text Node uses are not in our Callout, Details, Tree Item, Checkbox or Tab (every live variant checked: 0). They sit inside Web Awesome reference copies kept in "Reference only" frames (Callout page, Accordion page, Organizational Tree page, Tabs page), so there is nothing to swap. See page "Remote Text Node Audit (Steve)". The only other users are four orphan hover components (`Radio/Unselected/Hover`, `Radio/Selected/Hover`, `Switch/Off/Hover`, `Switch/On/Hover`) that sit on no page. **Still open:** the changed components must be published; the 7 screens were rebuilt as a v2 row (2026-10-14). **Open questions:** who can sign off AP and Payroll; how shared bank accounts count per location (BOPD-308).
- **BOPD-1111 v2 rebuild, 2026-10-14** — second row (y 2400) on page `1:47` of the epic file, beside the old row (kept for comparison): Card with `Content` slot, Status Row, Checklist Item, Table Row with Column toggles, wrapping Input help text, truncating Table Cell. **Period Status Badge and Locked Marker moved to the epic file (2026-10-14, user decision): they are a use of the library Badge, so they are local components on the epic file's "BOPD-1110" page; the unpublished originals stay on the design system file's "Period Close States (Steve)" page. Both screen rows were relinked (48 instances).** **Publish state (Table Cell does not need its own publish, it ships inside Table Row; see the brief):** Card, Dialog, Input, Selects, Table Row, Tooltip, Radio, Switch, Callout, Button, Checklist Item, Status Row, Field Message are current; **Period Status Badge and Locked Marker show as UNPUBLISHED** (PSB and Locked Marker were published on 2026-10-13 and have since dropped out of the library, cause unknown), so v2 reaches them through copies already in the epic file. Checklist Item and Status Row got a height fix and Checklist Item a link-icon fix after the publish and need republishing. **Rebuild gaps, status:** Table Row cell widths are Fill-based and an instance can't fix a width (documented, not a defect); Table Header Cell labels now truncate; Status Row has a With Link toggle; Card has With Header Note / Header Note; Status Row action area hugs its content (min 130px). These library fixes need publishing (Table Row carries Table Cell and Table Header Cell; also Checklist Item, Status Row, Card), then the v2 overrides can go.
- **BOPD-1112 Close dashboard: group view** — design story under BOPD-42 · Figma: [BOPD-1112](https://diningalliance.atlassian.net/browse/BOPD-1112). Built 2026-10-14 in the epic file, page "BOPD-1112 Close dashboard: group view" `23:2`. Four 1440px screens: mixed states (12 locations), filtered to Overdue and Needs review, all locations sealed, and the empty / single-location cases (no filter match, no locations, one-location flow to BOPD-1111); plus a notes frame. One row per location in a Table Row table: Location (link), Period (oldest unsealed), State (Period Status Badge), Modules ready (x of 5 plus icons), Pending approval, Close target, row menu. Summary tiles by state, a Callout counting Overdue and Needs review, search + State filter + Overdue only switch, filter chips.
  **Gaps:** Table Cell had no content slot (a local `Table Cell Content` copy on the page, swapped into Table Row cells). **Fixed 2026-10-14 in the library:** Table Cell now has `Type=Content` (Standard Left / Center / Right and Report Left, 44 variants) with a `Content` slot; it reaches the epic file when Table Row is published, after which the local copy can be swapped for it; Table Row is fixed at seven columns; no filter chip component (Neutral Outlined Badge with an x); Table Toolbar has no State filter or switch so it wasn't used. **Open questions:** which period a row shows (oldest unsealed, as drawn, or one fiscal period); whether users see only locations where they hold the closer permission; whether Sealed locations hide once everything urgent is clear.
- **BOPD-1113 Reopen, needs review, and re-verify flows** — design story under BOPD-42 · Figma: [BOPD-1113](https://diningalliance.atlassian.net/browse/BOPD-1113). Built 2026-10-14 in the epic file, page "BOPD-1113 Reopen, needs review, and re-verify flows". Seven flow stages plus a notes stage: (1) Reopen action with and without the permission; (2) Reopen dialog with a required reason (empty, error, filled), using the Dialog `Content` slot and Textarea; (3) reopening an earlier period: reason, then a blocking confirmation listing every later sealed period with a confirm checkbox; (4) Needs review: filled warning Callout with the standard message, period list with Sealed vs Needs review badges, Re-verify card; (5) Re-verify confirmation with the changes since seal, and the blocked cases (year-end re-run failed, pending); (6) reopened vs first-time soft close; (7) reopen reasons in the period history.
  **Decisions to confirm (on the page):** reason minimum 10 characters; two-step flow for a non-latest period; re-verify uses a confirm checkbox, not a reason; no button (not a disabled one) without the permission. **Open from the story:** automatic reopening of later periods is deferred. **Gaps:** Dialog title does not wrap (runs into the close button); Dialog footer buttons have no label properties; Textarea has no Label / Value / Help text properties; no summary-list component; period list still uses the local Table Cell Content copy.
- **BOPD-1114 Closer approval queue and notifications** — design story under BOPD-42 · Figma: [BOPD-1114](https://diningalliance.atlassian.net/browse/BOPD-1114). Built 2026-10-14 in the epic file, page "BOPD-1114 Closer approval queue and notifications" `35:713` (wrapper `35:714`). Nine stacked 1440px frames: (1) notification options compared, with a recommendation: nav count + location-dashboard queue + Pending close approval filter in every module, email digest later; (2) the queue for one location across modules (module tabs, Source and Entered by filters, selectable Table Row table, Pager); (3) approve one item from its row, or several with a confirmation dialog (count, total, blocked items) and a toast; (4) re-date dialogs (open period, refused sealed date) and the re-dating rules; (5) system-created items labelled by source (POS import, Integration, Recurring JE, Reversing JE) and the Source filter; (6) AP All invoices as a closer and as a non-closer (status badge, filter, Approve off with the reason); (7) what a non-closer sees while entering, right after saving and on the saved invoice; (8) empty queue, filters match nothing, and the dashboard seal check passing; (9) notes and gaps. Uses Card (Content slot), Table Row / Table Header Cell / Table Cell, Table Cell Content, Table Toolbar (Bulk Actions on), Table Pager, Tab, Single Select, Date Input, Dialog (Content slot), Callout, Toast Item, Badge, Button, Empty State, Checklist Item, Field Message, and the epic-local Period Status Badge.
  **Decisions to confirm (on the page):** nav count only for closers and gone at 0; single approve is one click, bulk approve confirms with no cap; closers approve their own items; re-date takes open periods only and no reason; closers may re-date system items (POS import is questionable); waiting time counts from creation; Post-period-end adjustment label on every module, not only JEs; one location and period per queue. **Open:** notification approach not yet reviewed with dev and product; Bank Rec and Inventory pending types; no notice to the person whose item is approved or re-dated; whether the nav count updates live. **Gaps:** Table Row template is fixed (checkbox, expander, one Fill text cell, three 160px cells, 40px menu cell) and nested cells only accept Fill; a Text + Sub Text cell is 50px tall against 43px neighbours; Table Cell Content slot keeps a placeholder "default" text to delete on every use; Table Toolbar has one bulk-action button ("Mark as Paid"); Dialog footer buttons ship with the star icon on and no label property; Field Message and Empty State subheading do not wrap (Field Message fixed with an instance override, Empty State copy shortened); Single Select with Listbox shows four options and covers its own field; Badge has no System/Source variant (Neutral Filled-Outlined + gear icon used). Table Row build recipe is in FIGMA-WORKFLOW-NOTES.md section 14.
- **BOPD-1115 AP screens under period close** — design story under BOPD-42 · Figma: [BOPD-1115](https://diningalliance.atlassian.net/browse/BOPD-1115). Built 2026-10-14 in the epic file, page "BOPD-1115 AP screens under period close" `49:2` (wrapper `49:3`). Eleven frames: (1) the AP state pattern, five states side by side (Open, Soft close closer, Soft close non-closer, AP signed off, Sealed); (2 to 8) All invoices, Aging (read only), Payment runs, Payments, Invoice entry, Invoice detail and Payment entry, each as five state strips (period badge, banner, header buttons on or off, row actions, GL date field message on the forms); (9) invoice image upload in a closed period, end to end (upload dialog, toast, invoice with Saved, period sealed, the two ways out); (10) AP mark ready and undo inside AP (Status Row card, confirmation with checkbox, blocked case, undo dialog); (11) notes and gaps. Uses Period Status Badge, Badge, Callout, Button, Date Input, Field Message, Toast Item, Status Row, Checklist Item, Checkbox, Dialog (Content slot), Card.
  **Decisions to confirm (on the page):** banner Warning only for a closer in soft close, Neutral otherwise; non-closer edits own pending items only; image upload stays on when AP is signed off (BOPD-311 says regardless of state, BOPD-309 blocks all new AP transactions); Mark AP ready blocked while AP items are pending; Aging includes pending items, marked; void blocked once signed off or sealed; Reopen period only for those who can reopen. **Open:** who may mark AP ready; payment run containing pending invoices; screens not in the story list. **Gaps:** Status Row action slot ships two placeholder buttons, title truncates near 28 characters, detail text does not grow the row; Checklist Item With Link shows a placeholder that overlaps and has no text property; Neutral Callout icon is a gear; Callout has one action; Date Input has no period state; disabled Button has no Tooltip.
- **BOPD-1116 Payroll, Sales, Bank Rec and Inventory under period close** — design story under BOPD-42 · Figma: [BOPD-1116](https://diningalliance.atlassian.net/browse/BOPD-1116). Built 2026-10-14 in the epic file, page "BOPD-1116 Payroll, Sales, Bank Rec and Inventory under period close" `53:2` (wrapper `53:3`). Eight frames: (1) screen inventory, proposed (only Bank Rec was read from a saved page; Payroll, Sales and Inventory are inferred from the navigation and GL transaction types and are labelled Inferred, **not yet confirmed with dev**); (2) Payroll entries and (3) Sales entries in five states including module signed off (Sales only on the manual fallback); (4) Bank Rec bank transactions and GL entries; (5) Bank Rec reconciliation report in Open, Soft close, Sealed (locked by period close) and Reopened (unlocked); (6) Inventory submissions, with the sealed block explained (reversal and rewrite); (7) Payroll and Sales sign-off cards with confirm, blocked and undo dialogs; (8) notes and gaps.
  **Decisions to confirm (on the page):** states per module (Payroll signed off; Sales signed off only on fallback; Bank Rec and Inventory none); report approve and unapprove in soft close open to everyone; locked report label and the Reopen path; Payroll and Sales mark ready blocked while entries are pending; the payroll dialog does not claim the provider is told the period is locked (BOPD-306 investigation). **Open:** real screens in Payroll, Sales and Inventory; shared bank accounts (BOPD-308); who can sign off Payroll. **Gaps:** as BOPD-1115; the screens are state sheets, not full pages.
- **BOPD-1117 Journal entry screens under period close** — design story under BOPD-42 · Figma: [BOPD-1117](https://diningalliance.atlassian.net/browse/BOPD-1117). Built 2026-10-14 in the epic file, page "BOPD-1117 Journal entries under period close" `58:2` (wrapper `58:3`). Five frames: (1) the GL date picker naming the period of every date (soft close date, sealed date refused, open date), drawn from Date Input and Date Calendar with a period legend; (2) journal entry form in four states (Cancel, Preview, Save, Save and Approve as in the saved GL page); (3) detail kinds: draft, pending as non-closer, pending as closer, approved by a closer with the Post-period-end adjustment label, sealed approved, recurring entry held, auto-reversing entry held in a sealed period, year-end closing entry; (4) the journal entry list with the pending and label filters, labels in the status cell and a labels legend; (5) notes and gaps.
  **Decisions to confirm (on the page):** the picker allows soft close dates with a warning and blocks sealed dates; Post-period-end adjustment is a label not a status; held entries in a sealed period offer Re-date and Reopen, never Approve; system year-end entries show no actions; a Label filter besides Status. **Open:** UI name of the year-end entries (FiscalYearEnd, RetainedEarnings); approver shown in the list or only in the detail. **Gaps:** **no period-aware date picker exists** (the dependency named in the story; frame 1 is a workaround); Date Input has no message of its own; Badge has no entry-kind variant.
- **BOPD-1118 Period close reports** — design story under BOPD-42 · Figma: [BOPD-1118](https://diningalliance.atlassian.net/browse/BOPD-1118). Built 2026-10-14 in the epic file, page "BOPD-1118 Period close reports" `62:2` (wrapper `62:3`). Six frames: (1) where the reports are reached (Reports menu, close dashboard card, period history); (2) trial balance at close with snapshot version selection and a vs version 1 column; (3) year-end pre-closing and post-closing versions; (4) changes after reopen: two versions compared, an account opening to approved, changed and removed transactions, and a year-end re-run as one line with its four entries behind it; (5) post-period-end adjustments, filterable by location; (6) notes and gaps. All three tables use the BOSS Table report size (Table Row Size=Report, three column groups). The figures balance, and version 1 to version 2 ties to the changes report.
  **Decisions to confirm (on the page):** menu, dashboard and history entry points; version numbering (1a and 1b for the year-end pair); sign convention; compare opens latest against previous; re-run label and net effect; adjustments report covers every location the user can see. **Not drawn:** the drill-down from a trial balance account or an adjustment to its transaction (links to existing screens), and the empty state for periods sealed before snapshots shipped. **Open:** who may see the reports. **Gaps:** Table Row Report is built for the profit and loss report (expander, GL number, title, up to three groups of an amount and percent pair plus a 94px variance cell), so the percent text is hidden and text values sit in numeric cells; seven-digit amounts need whole dollars in the variance cell; the Variance property controls every variance cell (see FIGMA-WORKFLOW-NOTES.md section 14); header labels truncate near 14 characters; rows cannot hold a Badge.
- **BOPD-1119 Financial calendar guardrails (internal admin)** — design story under BOPD-42 · Figma: [BOPD-1119](https://diningalliance.atlassian.net/browse/BOPD-1119). Built 2026-10-14 in the epic file, page "BOPD-1119 Financial calendar guardrails" `66:2` (wrapper `66:3`). Three frames: (1) a calendar edit that is allowed (toast), blocked (dialog naming locations, periods and states with Period Status Badges, and a count of the rest), with the Override as admin action; (2) the override dialog in three states (nothing entered, reason missing, ready) with the Textarea, the sealed periods that will move to Needs review, and a confirmation checkbox, plus the toast and the Needs review message and history entry that follow; (3) notes and gaps.
  **Decisions to confirm (on the page):** block when any location is in soft close, sealed, needs review or reopened in the range; override as its own permission or not; no minimum reason length (BOPD-1113 suggests 10); soft close periods listed as keeping their state. **Open:** 53-week years have no screen; what happens to entries in a soft close period that fall outside it. **Gaps:** Textarea has no label, value or help properties; Dialog has no scroll area and its title does not wrap.
  **Assembled page (2026-10-14):** epic file page "Assembled page: Period close, location view" `71:2`. The location close dashboard in soft close with every blocker at once, composed from the stories' designs: nav count, header, banner, module readiness, seal checks, pending summary, queue preview, earlier periods, reports, history. Page frame `71:3`, annotated copy `76:1647` (numbered regions), legend `76:2519`. Handoff and the end-of-epic fix list: PERIOD-CLOSE-HANDOFF.md.
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
  with no accent (solid, was Filled) primary button. No WebAwesome equivalent. Dev: [BOPD-897](https://diningalliance.atlassian.net/browse/BOPD-897) is ready to be picked up
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
- **Tabs** — moved to Complete 2026-10-20: the qe1 v2 style guide has a Tabs page.
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
- **Layout** — `wa-page` · Figma: [BOPD-877](https://diningalliance.atlassian.net/browse/BOPD-877) (was OR-13622)
- **Progress Ring** — `wa-progress-ring` · Figma: [BOPD-858](https://diningalliance.atlassian.net/browse/BOPD-858) (was OR-13627) · Dev: [BOPD-843](https://diningalliance.atlassian.net/browse/BOPD-843) (was OR-12019, To Do). **Deprioritized 2026-10-09: back of the
  line, after every other remaining component except Button Group** (which stays last).

**No WebAwesome component — custom build or pattern, no Figma story yet:**
- Address — built 2026-10-12 as a Form atom (BOPD-1223), page "Address (Steve)" `5284:14734`
- Multi Unit Division Selector
- Multi Unit Rooftop Selector
- Input Masking (Maskito) — a feature of Input, not a component (decided 2026-10-13: no Figma
  component). Wired through `boss-input`'s `mask` / `unmaskHandler` inputs, ~64 files, presets in
  `maskito-presets.ts`. Optional documentation page (preset table, masked vs unmasked value,
  combobox caveat, obscured SSN/FEIN) proposed, not yet decided.

**Dropped 2026-10-13 (covered by existing components, no work needed):** Links (native styles,
covered by Button types) and Lists (covered by Accordion).

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

**Dev follow-ups found during the 2026-10-09 design work (all filed, To Do):**
- **Spinner:** [BOPD-1185](https://diningalliance.atlassian.net/browse/BOPD-1185), PR #9736 open (see the Spinner entry above).
- **Hand-built buttons:** [BOPD-1186](https://diningalliance.atlassian.net/browse/BOPD-1186). `#reviewOrderBtn` (filled navy "Review Order") and `#saveForLaterBtn` in `pages/ordering/orderCartFlyout/` become `orderly-button`, with the real Button hover.
- **Empty State:** [BOPD-1187](https://diningalliance.atlassian.net/browse/BOPD-1187). Rename the `<empty-state>` selector to `boss-empty-state` (42 templates) and add a style-guide page.
- **Colour hover wiring:** [BOPD-1188](https://diningalliance.atlassian.net/browse/BOPD-1188). The 79 orange hover rules (colour-review section I) move to brand, with the listed exceptions.
- **Form (BOPD-1223):** [BOPD-1230](https://diningalliance.atlassian.net/browse/BOPD-1230) migrate `boss-form`, `boss-money-input`, `boss-tuple-input` and `boss-address` off Shoelace; [BOPD-1231](https://diningalliance.atlassian.net/browse/BOPD-1231) raw colours to colour roles, error ring, warning colour; [BOPD-1232](https://diningalliance.atlassian.net/browse/BOPD-1232) header Icon Buttons, header height, truncation tooltips; [BOPD-1233](https://diningalliance.atlassian.net/browse/BOPD-1233) Single Select disabled look, Input Error wiring, Address beyond the US.
