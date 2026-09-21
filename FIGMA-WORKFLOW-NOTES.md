# Figma Workflow Notes — BOSS Design System
*Companion to BOSS_PD.md and the Project Brief. This file is technical/process — how to work in this
specific Figma file without repeating mistakes already made once. Update it when a new one surfaces.*

---

## 1. Check local Figma styles/variables BEFORE reaching for external docs

**The mistake, three times now:** building something from generic WebAwesome/Shoelace documentation
instead of searching this file's own effect styles, variables, and existing components first.

- Assumed `color/border/focus` needed to be created — it already existed, already aliased to `blue/70`.
- Built Checkbox's focus ring as a stroke/offset-outline based on generic WA/Shoelace docs (`outline-offset: 2px`)
  — this file already has a real `Focus/Ring` effect style (flush drop-shadow, offset 0, spread 3, `#49A4DA`
  @ 30%) already in use on Input/Select/Textarea. Had to rebuild Checkbox to match.
- Instanced a tag component (`Base / Individual`) for a Financial Table Cell's "Show Tag" property without
  checking it was actually **remote** (an external library component, not local to this file at all) --
  confirmed via `component.remote === true`, `pageId === null`. Compounding the error: even the real
  local tag component on this file's own Tag page was the wrong thing to reuse -- its own `.description`
  explicitly says it's a "building block" documenting Select's internal rendering, not general-purpose
  reusable content (see the rule below).

**Rule going forward:** before proposing a new token, pattern, component, or "the WebAwesome way" of doing
something, check `figma.variables.getLocalVariableCollectionsAsync()` and `figma.getLocalEffectStylesAsync()` /
`getLocalTextStylesAsync()` first. If it's not there, *then* check what real shipped code does
(SCSS files, live app) before falling back to generic library documentation as a last resort.

**Additional rule, specifically for reusing an existing component the user describes or that seems to
match a need:**
1. Confirm it's actually local to this file (`component.remote === false`, has a real `pageId`) -- not an
   external/team-library component that happens to show up in search results.
2. **Read its own `.description` field before instancing it.** Being local doesn't mean it's meant for the
   use case at hand -- several components in this file (`Tag Base`, `.Tag Group`, `Listbox/Container`) are
   explicitly documented as "building blocks" that illustrate what a *different* component renders
   natively, not general-purpose content to reuse elsewhere. Reusing one for an unrelated purpose is the
   same class of mistake as using a remote component -- wrong source, just wrong for a different reason.
   If the description says "this is not a building block to assemble," believe it, and look for what the
   description names as the *real* precedent instead (often: a raw HTML element used directly, hand-built
   to match the token spec, not any wrapper component).

---

## 2. Figma Plugin API gotchas hit more than once

### `layoutPositioning: 'ABSOLUTE'` is required to escape auto-layout flow
Any child of a `HORIZONTAL`/`VERTICAL` auto-layout frame that needs a fixed, corner-anchored, or
overlaid position (not flowed with its siblings) **must** have `layoutPositioning = 'ABSOLUTE'` set
explicitly. Without it, setting `x`/`y` directly gets silently overridden — the node gets flowed into
the row/column instead. Hit this on:
- Textarea's resize-grip (built inside a `HORIZONTAL` auto-layout with the value text)
- Checkbox's focus ring (same underlying component pattern)

**Check for this any time** a decorative/overlay element sits inside an auto-layout container and isn't
rendering where expected.

### Setting `x`/`y` before `appendChild` into a `SECTION` breaks its export bounding box
Building a "Reference only" comparison area for Tabs (2026-09-08) as a `SECTION` with children
positioned via `instance.x = x; instance.y = y;` **before** `refArea.appendChild(instance)` produced
two symptoms: (1) `get_screenshot` on the section returned an export bounding box stretched back to
the page origin (`original_width`/`height` far larger than the section's own declared `width`/
`height`), and (2) two of the five children rendered visually overlapping on canvas even though
`get_metadata`-style inspection of their `x`/`y` properties looked correct and non-overlapping.
Root cause not fully isolated (sections appear to renormalize/re-anchor a child's coordinate space
on `appendChild` in a way plain frames don't), but the fix was straightforward: **append the child
to its parent first, then set `x`/`y`** — the same append-before-position order already required
for `layoutPositioning = 'ABSOLUTE'` above, just for section children too. Simpler still: prefer a
plain auto-layout `FRAME` over a `SECTION` for grouping reference/comparison content — auto-layout
handles child spacing itself, so no manual `x`/`y` is needed at all. Always re-screenshot a newly
built section/frame before treating it as done; the malformed bbox and the overlap were both
visible immediately once checked, not something that would surface from metadata alone.

### `combineAsVariants` can produce malformed property names
Renaming children to `"Type=X, State=Y"` before calling `combineAsVariants` sometimes produces junk
property names like `"=Single Select, =Single, =Default"` instead of clean `Type`/`State` properties —
likely picking up a stray property from the original parent. **Fix:** after combining, always check
`componentPropertyDefinitions` and rename children directly if malformed. Don't assume the rename
survived the combine.

**Corollary hit during the Tooltip 12-placement rebuild (2026-09-08):** the malformed names above
came specifically from re-combining components that had *previously* been variants of another
ComponentSet (they carried stray parent-property baggage into the new combine) — components that
were never previously grouped (freshly cloned/created) came out clean. If mixing "already was a
variant somewhere" nodes with fresh ones in one `combineAsVariants` call, expect only the
previously-grouped ones to need the rename fix.

**Also hit in the same rebuild:** calling `compSet.componentPropertyDefinitions` in the *same*
`use_figma` script as the `combineAsVariants()` that created it threw `"Component set has existing
errors"` and rolled back the entire script (this environment's scripts are transactional — see
"Empty ComponentSets auto-delete" below for the same rollback behavior in a different context).
Moving that read to a separate, subsequent `use_figma` call succeeded immediately, once the
malformed names were also fixed. Treat combine-then-immediately-read-properties as a pattern to
avoid — split it into two calls even when nothing looks wrong yet.

### Empty ComponentSets auto-delete
When every child/variant is removed or moved out of a `COMPONENT_SET`, Figma deletes the now-empty set
automatically. Don't call `.remove()` on it afterward — it'll throw `node does not exist` and roll back
the whole script (Figma plugin scripts appear to be transactional — one uncaught error rolls back
everything the script did, including successful steps earlier in the same call).

### `clipsContent` and glow effects
A `DROP_SHADOW` effect (like `Focus/Ring`) with nonzero spread needs `clipsContent: false` on its parent
to render fully at tight bounds. If a component is resized to exactly match its visible content (no
margin), and `clipsContent` is `true` (Figma's default), the glow gets clipped at the edges. Check
`clipsContent` on siblings/reference components before assuming a size mismatch is a margin problem.

### `figma.currentPage` does not persist reliably across tool calls
Explicitly call `figma.setCurrentPageAsync(page)` at the start of every script that touches nodes on a
specific page — don't assume the page set in a previous call is still current. Building nodes without
this can land them on the wrong page entirely (happened once with Select's Medium-only ComponentSets
landing on the Input page).

### `resize()` before setting sizing modes
For auto-layout frames, call `.resize()` **before** setting `layoutSizingHorizontal`/`Vertical` or
`primaryAxisSizingMode`/`counterAxisSizingMode` — `resize()` can reset sizing modes to `FIXED`, so setting
modes first and resizing after can undo the mode you just set.

### `Hug` outer frame + `Fixed` inner child = resize clips the child (Input, 2026-09-13)
Input's 6 state variants (`State=Default/Focus/Filled/Disabled/Error Focused/Error`) had the outer
component set to auto-layout **Hug** on both axes, with the inner `input` box (the visible bordered
field) set to **Fixed** 280×40. Hug-sized components can still be resized manually as an instance
override, but a `Fixed` child doesn't follow that resize — it stays pinned at its original size and
gets clipped/cut off whenever the instance is resized smaller (or looks like dead space when resized
larger). Fix, applied to all 6 variants:
1. `node.resize(w, h)` on the outer component first (per the gotcha above), then explicitly set
   `primaryAxisSizingMode = 'FIXED'` and `counterAxisSizingMode = 'FIXED'` on it — switching the
   outer frame from Hug to a real, independently resizable Fixed size (same visual size as before,
   288×88, so nothing shifts).
2. On the inner `input` child, set `layoutSizingHorizontal = 'FILL'` and
   `layoutSizingVertical = 'FILL'` — Fill is only a legal combination once the parent axis is no
   longer Hug, which is why step 1 has to happen first.
Verified by test-resizing the `Default` variant to 400×140 and screenshotting — the input box grew
to match — then resizing back to 288×88. **Check for this pattern on any other component where an
outer frame Hugs and a visibly-bordered inner box is Fixed** — same failure mode will reproduce.

**Correction (2026-09-16):** the input box should only Fill horizontally, not vertically — the
Medium size's 40px height is a real spec value (see the Documentation section: "Height: 32/40/48px
(s/m/l)"), not something that should stretch when the component is resized taller. Setting
`layoutSizingVertical = 'HUG'` looked like the obvious alternative to Fill but is also wrong: it
recomputes height from content + padding (8px top/bottom padding + ~19px text = 35px), silently
shrinking the box 5px below spec. The correct setting is `layoutSizingVertical = 'FIXED'` with an
explicit `resize()` back to 40 — same "resize before setting sizing modes" ordering gotcha applies
(resize the child first, since `resize()` resets both axes' sizing modes to `FIXED` as a side effect,
*then* re-set `layoutSizingHorizontal = 'FILL'` after, so the horizontal Fill isn't clobbered by that
side effect). Applied to all 6 state variants; verified by resizing `Default` to 400×140 again —
width filled, height stayed pinned at 40.

**Note (2026-09-17):** this correction was briefly lost from this file when a teammate's "sync from
local copy" push (`ebe9ec5`) overwrote it with a stale local version predating the fix — a real
instance of the exact silent-drift risk this whole file exists to catch, just happening to this
document itself rather than a component. Re-added here after noticing the gap while adding the
Toast note below. **If a sync/merge to this file ever looks like it dropped recent content, diff
against the previous commit before trusting the result — don't assume a "sync" commit is additive.**

### Same Hug/Fixed clip pattern reproduced on Select, both Single and Multi (2026-09-21)
Predicted by the Input note above ("check for this pattern on any other component") — confirmed on
the `Single Select` and `Multi Select` ComponentSets on the Select page. All 12 state variants (6 per
set) had the inner `Input` box (the visible bordered field) `Fixed` 280×40, so resizing an instance
wider left the box pinned and the dropdown chevron stranded mid-component instead of at the right edge.
- **Single Select's 6 variants** (`State=Default/Expanded/Selected/Disabled/Error Focused/Error`): outer
  frame was already auto-layout **Fixed** on both axes (not Hug, unlike Input) — only needed step 2 of
  the Input recipe: set the `Input` child's `layoutSizingHorizontal = 'FILL'` directly, no outer mode
  change needed since parent wasn't Hug to begin with.
- **Multi Select's 6 variants** (`State=Default/Expanded/Multiple Tags/Disabled/Error Focused/Error`):
  outer frame *was* Hug on both axes — full Input recipe applied: `resize(280, 40)` + set both outer
  axes to `FIXED`, then `resize(280, 40)` + `layoutSizingHorizontal = 'FILL'` on the `Input` child
  (vertical stays `FIXED` from the resize side-effect, matching the 40px Medium spec — see the Input
  correction above).
Verified by creating throwaway instances of each set's `Default`/`Expanded` variant, resizing to 500×40,
and screenshotting — `Input` box and chevron both tracked the full width on both — then deleting the
test instances.

**Not fixed, flagged only:** `Multi Select with Listbox` (`583:422`) wraps its `Multi Select` instance
with `layoutSizingHorizontal = 'FIXED'` inside an outer frame whose *width* axis is itself Hug (`AUTO`)
rather than Fixed — inconsistent with its sibling `Single Select with Listbox` (`489:241`), whose
wrapped instance is already `FILL` inside a Fixed-width outer. Resizing the Multi Select composite
wouldn't grow the inner instance, but fixing it means deciding whether the outer should switch to
Fixed-width (matching its sibling) or stay Hug some other way — a design call, not a mechanical
repeat of this recipe. Left alone pending that decision.

### Wiring dormant Label/Helper Text nodes on Select via component properties (2026-09-21)
Select's `Label` frame (`Label` text + `*` required asterisk) and `helper-text` node existed on all 12
state variants (Single + Multi) already, but were hardcoded `visible: false` with **no component
property at all** — not a toggle bug, a complete gap. Added properties to each `ComponentSetNode`
directly (`set.addComponentProperty(...)`, callable on the set even though the general recipe says to
add properties to variant components pre-combine — works fine post-hoc on an already-combined set) and
bound each variant's nodes via `componentPropertyReferences`, mirroring Input's exact model (confirmed
node-for-node against Input's `label row`/`Help Text` bindings first):
- `Label Text` (TEXT, default `"Label"`) → the `Label` frame's inner `Label` text node's `characters`
- `Show Label` (BOOLEAN, default `true`) → the `Label` frame's `visible`
- `Required Field` (BOOLEAN, default `true`) → the `*` text node's `visible`
- `Show Help Text` (BOOLEAN, default `true`) → `helper-text`'s `visible` (non-error variants only)
- `Help Text` (TEXT, default `"Help text"`) → `helper-text`'s `characters` (non-error variants only)

**Error-state helper-text is a different node shape and intentionally NOT bound to `Show Help Text`:**
on `Error`/`Error Focused`, `helper-text` is a `FRAME` (warning icon + `message` text), not a bare
`TEXT` node — set its `visible = true` directly (hardcoded, unbound), matching Input's own Error Text
being unconnected to any property. Skipped adding Input's `Error Text (sample only)` TEXT property
entirely — checked Input's copy first and found it's declared on the ComponentSet but never actually
bound to any node (`componentPropertyReferences: {}` on the Error variant's own `Error Text` node), i.e.
already dead/decorative there. Not worth reproducing a no-op property just for cosmetic parity; the
`"(sample only)"` suffix on Input's version was already a signal it isn't meant to be live-editable.

**Second-order bug this surfaced:** the outer variant frame's height was still `Fixed 40` (just the
`Input` box) because Label/helper-text had never been visible before. Once wired to `visible: true`
defaults, content (16 label + 4 gap + 40 input + 4 gap + 16 helper = 80) overflowed the 40px bounds —
invisible in a screenshot because `clipsContent: false`, but wrong for anything measuring the
component's actual bounding box (auto-layout parents, overlap checks). Fixed by `resize(280, 80)` on
all 12 variants, matching Input's own pre-sized `288×80` content total (`88` outer incl. 4px
top/bottom padding — Select has 0 padding so `80` is exact). **General lesson: making a previously-
hidden child visible for the first time needs a height check on any `Fixed`-sizing-mode ancestor, same
class of bug as the resize-clips-child pattern above, just triggered by a visibility change instead of
a manual resize.**

Verified with throwaway instances: default rendering (label + asterisk + input + help text), an
instance with `Show Label: false` + custom `Help Text` value, and the Error/Error Focused variants
(warning icon + message auto-visible) — all screenshotted correctly, then deleted. Also re-screenshotted
`Single Select with Listbox` (`489:241`) and `Multi Select with Listbox` (`583:422`) end-to-end to
confirm the now-taller variants didn't overlap the listbox panel below them — both composites' outer
frames already Hug on the height axis, so they grew cleanly with no manual fix needed there.

### Width-only resize via `minHeight`/`maxHeight` lock, plus single-line ellipsis truncation (Input, 2026-09-21)
Two related asks: (1) an instance shouldn't be manually resizable taller/shorter, only wider/narrower
— the fixed 40px Medium input box is a real spec value, not something a designer should be able to
drag out of shape by accident; (2) a long value/placeholder should truncate with an ellipsis instead
of wrapping to multiple lines and blowing out the fixed height.

**Width-only resize — `minHeight = maxHeight = currentHeight`, leave width unconstrained:**
Set directly on each of the 6 variant `COMPONENT`s (`node.minHeight = node.maxHeight = 88`), not on
instances. Confirmed by test: a **new** instance created *after* setting this on the master inherits
`minHeight`/`maxHeight` automatically — this is a real per-frame constraint property (not a
Figma-UI-only drag limit), and it's enforced even through a programmatic `resize()` call, not just
manual dragging: `instance.resize(288, 200)` on a locked instance silently clamped back to height 88
while width applied as requested. This is the correct mechanism for "only allow resizing in one
axis" generally — leave the other axis's `minWidth`/`maxWidth` (or `minHeight`/`maxHeight`) at `null`
to keep it free.

**Truncation recipe — `textAutoResize` becomes `'TRUNCATE'` as a side effect, order matters:**
The value text (`Placeholder` on 5 variants, `Input` on Filled — bound to the `Input Text`/
`Placeholder` component properties) was `textAutoResize: 'HEIGHT'`, which wraps to more lines and
grows height instead of truncating. Fix, same node, in this exact order:
1. `node.textAutoResize = 'NONE'`
2. `node.textTruncation = 'ENDING'` — Figma auto-flips `textAutoResize` to `'TRUNCATE'` as a
   side effect of this assignment (confirmed by reading it back after; don't set `'TRUNCATE'`
   directly, it's not clear from the type alone that this is the value to assign to get ellipsis
   behavior, it's assigned *for* you).
3. `node.resize(currentWidth, 19)` — re-asserts the single-line height. Skipping this step leaves the
   node's height at whatever it last auto-computed (in one test, a stale multi-line 76px from before
   truncation was enabled), so truncation looks like it silently did nothing.
4. Since this text node is `layoutSizingHorizontal: 'FILL'` against its auto-layout `input` parent
   (so its width still tracks the box as it's resized), step 3's `resize()` clobbers that back to
   `FIXED` per the usual resize-resets-sizing-modes gotcha — re-set
   `node.layoutSizingHorizontal = 'FILL'` **after** the resize call to restore it. Leave
   `layoutSizingVertical` at the `FIXED` value `resize()` already set — that's the desired outcome
   (single fixed-height line), no need to touch it back.
`maxLines` stayed `null` throughout on every attempt to set it (writes silently no-op'd) — turned out
unnecessary: `textAutoResize: 'NONE'` + a single-line-height `resize()` was sufficient for one-line
ellipsis truncation on its own.

Verified on a `Filled` instance with a long value ("This is a very long value that should truncate...")
— rendered as `☆ This is a very long value that sho...` at the normal 288px width, then deleted.
Verified the resize lock on a separate `Default` instance via `resize(500, 300)` — landed at 500×88,
not 500×300. Applied to all 6 state variants; full component-set screenshot confirmed no regressions
across Default/Focus/Filled/Disabled/Error Focused/Error.

### Adding Trailing Icon to Button — 60-variant bulk edit, clone-the-sibling pattern (2026-09-21)
Button already had a `Leading Icon` boolean (bound to a `leading-icon` text node) but no trailing
equivalent. The `Button` ComponentSet is large — 60 variants (`Variant` × `Appearance` × `Size` ×
`State`, Danger restricted to `Filled` only) — all on the page flagged `(Steve in styleguide but not
updated)`. **Surveyed all 60 before touching anything**: every variant had the exact same
`["leading-icon", "Button"]` child structure with identical `componentPropertyReferences` — no drift,
unlike what the "not updated" flag might suggest. Confirming that first avoided writing a fix that
assumed uniformity and silently skipped or mis-handled outliers.

**Pattern: clone the existing sibling instead of building a new text node from scratch.**
`leadingIcon.clone()` inherits its exact font (`Font Awesome 7 Pro Regular`), fontSize, and fill —
including the fill's `boundVariables` alias — for free, correct per-variant automatically (icon color
always matches that variant's text color, e.g. white on Filled, brand-blue on Outlined/Plain, muted on
Disabled). Building a fresh text node per variant would have meant re-deriving and re-binding all of
that per variant instead of getting it free from the clone. Then: `node.appendChild(clone)` (places it
last in the `HORIZONTAL` auto-layout, i.e. trailing, no manual positioning needed), rename to
`trailing-icon`, set `characters = 'arrow-right'` (distinct placeholder from leading's `'star'`, so the
two are visually distinguishable in the unpopulated component-set view), `visible = false` to match the
new property's default, bind `componentPropertyReferences = { visible: trailingIconKey }`.
`addComponentProperty` called once on the `ComponentSetNode` up front (same as the Select note above —
works fine post-hoc on an already-combined set), `Trailing Icon` defaulting to `false` so every
existing instance's rendered appearance is unchanged.

**Scale note:** ran the 58 remaining variants (2 already covered by an initial 2-variant validation
pass) as 3 batched `use_figma` calls of ~19-20 each rather than one 60-variant call or one-call-per-
variant — the earlier Select/Input fixes (6-12 variants) ran fine in a single call each, but scripts
here are transactional (one uncaught error rolls back the *entire* call), so at 60 variants the
blast radius of a late failure got large enough to be worth chunking. Validated the full batch
afterward with a single pass checking every variant's child order, `visible`, `characters`, and
`componentPropertyReferences` against the expected shape — zero problems found.

Verified visually: default appearance unchanged (60-variant grid screenshot, pixel-identical to
before) — plus targeted instances with `Trailing Icon: true` alone, combined with `Leading Icon: true`,
across Filled/Outlined/Disabled/Accent/Danger to confirm the cloned styling (including the muted
Disabled fill) tracks correctly per variant.

**Not addressed, flagged only:** neither `Leading Icon` nor the new `Trailing Icon` has a paired glyph
`TEXT` property — both icons are hardcoded characters (`star` / `arrow-right`) with only a visibility
toggle, unlike `Left/Middle/Right End Option` on the Toggle Button Group (same file), which already
model `Icon` as a real bindable text property alongside its boolean. Left this at parity with Leading
Icon's existing (already-shipped) level of completeness rather than improving one side unrequested;
worth a follow-up if editable icon glyphs are wanted on Button generally. Also didn't verify the
`arrow-right` default or general icon-slot behavior against real shipped `wa-button` code — this page's
own "not updated" flag means the real component may already differ from what's here.

### `STRETCH` alignment as an alternative to `FILL` sizing for hug-parent children (Toast, 2026-09-17)
Building Toast Item's colored accent bar (needs to span the full height of the card, whatever that
height ends up being once a multi-line `Message` wraps) looked like the same problem as the Input
fix above — but the card's outer frame needs to stay **Hug** (so it grows with wrapped text), and
`FILL` sizing on a child is illegal against a Hug parent axis (see the Input fix's step 1: `FILL`
only works once the parent is switched to `FIXED`). Setting the accent bar's `layoutAlign =
'STRETCH'` instead of touching its sizing mode solved this directly: a `STRETCH`-aligned child
matches whatever height the Hug parent resolves to from its *other* children, with no parent
sizing-mode change needed at all. **Try `STRETCH` alignment first, before reaching for the
Hug→Fixed→Fill dance, any time a decorative/full-height child (accent bars, dividers, side rails)
needs to track a hug-sized sibling rather than actually drive the parent's own size.**

---

## 3. Editing permissions

Earlier in this project, CLAUDE.md restricted Claude to **creating** new Figma nodes only — never
modifying or deleting existing ones. This caused a recurring pattern: clone the existing component →
edit the clone → leave the original untouched → add a migration/deprecation note pointing to the new
one. This is why several components briefly existed as duplicate old/new pairs (Textarea, Checkbox,
Input, Select).

**That restriction has since been removed for this project.** Claude can now edit existing nodes
directly — trim variants, fix positioning, rename, etc. — with no clone-and-replace step needed. The
result should always be **one canonical version** of each component, not parallel old/new copies.

---

## 4. Every PR needs a linked Jira story — check before opening one

**Rule going forward:** before opening a PR against this repo (BOSS-DesignTeam/designSystem) or the
product repo (orderlyapp/orderly), confirm there's a Jira story (OR project) that actually covers the
change, and link it in the PR description/title. This applies even to small, documentation-only
changes like this file — a note like this one exists specifically *because* an unticketed doc sync
once clobbered content instead of merging it, with nothing tracking what the intended change even was.

**Procedure when no story exists yet:**
1. **Check first.** Search Jira for an existing story that already covers the change before assuming
   one doesn't exist — a duplicate story is its own kind of drift, same class of mistake as rebuilding
   something that already exists locally (§1 above).
2. **Draft one** if none exists, following the Jira story conventions in §5 below (title format,
   `customfield_11734` Capitalization Category, parent epic OR-11839 for migration/style-guide work).
3. **Get it confirmed** — by the user, or created outright if already authorized to do so directly —
   before opening the PR. Don't open the PR first and backfill the ticket after; the ticket is what
   defines the scope the PR should be reviewed against, not a formality added afterward.
4. **Keep the ticket and the PR in sync as work progresses.** If the actual change ends up differing
   from what the story originally described (broader, narrower, or just different), update the
   story's description to match reality before merging — don't let the ticket describe a plan the code
   no longer follows.
5. **Transition the story's status automatically as the work moves, not just the description.**
   Don't leave it sitting in `To Do` while a PR is already open, and don't leave it in `Code Review`
   after merging. For this style-guide/design-system track specifically, the real lifecycle uses
   eight statuses. Seven of them were verified against every ticket under this epic (OR-11839);
   `Ready For Prod` is added on top going forward even though it has no historical usage yet, since
   the team wants a distinct "done, waiting to release" step ahead of `On Prod` rather than jumping
   straight from `Testing` to live. This Jira instance's workflow also offers `UI Review`,
   `Merge to Main`, `QE2 Testing`, `QE2 Verified`, and `PM Review`, but none of those are used here:
   there's no PM in this loop, and UI review happens as part of the same person's own process
   rather than a separate tracked state. Use only these eight:
   - Not yet prioritized → `Backlog`
   - Prioritized, not started → `To Do`
   - Actively being worked on → `In Progress`
   - PR opened, awaiting review → `Code Review`
   - Needs functional verification before shipping → `Testing`
   - Done and verified, waiting to release → `Ready For Prod`
   - Merged and live → `On Prod`
   - Abandoned, never shipping → `Dismissed` (see OR-12428, OR-12033 for real examples)
   Check the issue's own available transitions rather than assuming every project uses every status
   its workflow supports — seven of these eight are real, observed usage for this epic; `Ready For
   Prod` is the one intended-use addition, to apply once work is done and verified but not yet live.
6. **Skip mandatory reviewer sign-off when the PR touches only this workflow-notes file.** A pure
   FIGMA-WORKFLOW-NOTES.md change carries no product risk, so it doesn't need a reviewer's time or
   another round of review-agent tokens spent on it — this doc is process notes for whoever does the
   work next, not shipped code. Points 1-5 above still apply (linked story, kept in sync, transitioned
   through to `On Prod`) so there's still a paper trail; only the human-review gate is waived. This is
   scoped to PRs where the workflow-notes file is the *only* file changed — a PR that bundles a
   workflow-notes update with any actual code or component change still needs a real reviewer.

---

## 5. Jira story conventions (OR project, Back Office Dev)

Reference example: OR-12589 ("Add tag component to style guide"). Format:

- **Title:** imperative — "Add/Update [Component] component in style guide"
- **Description:** short bullet list, ending with a `---` divider and a WebAwesome docs link
- **Required custom field:** `customfield_11734` ("Capitalization Category") must be set or issue
  creation fails. Use `{"id": "11810"}` (value: "New Feature Development") unless told otherwise.
- **Parent epic:** OR-11839 ("Webawesome Migration Fun") for anything migration/style-guide related.

**Core philosophy (from Tom Horn's comment on OR-12589), applies to every wrapper component story:**
Our `boss-*` components are wrappers over WebAwesome's native form, not rebuilds. WA ships its own
variants/appearances/sizes out of the box. Anything WA provides natively that we deliberately *don't*
use must be **explicitly blocked** in the wrapper — otherwise the dev-facing API is confusing (options
that look available but aren't actually supported). Anything our design shows that WA does *not*
provide natively (e.g., an "Inactive" state) must be flagged as something to **hand-build** into the
wrapper. Every new component story should call out both categories explicitly, not leave them implicit.

---

## 6. Recurring design decisions worth remembering

- **Naming convention for all new/updated components:** `<boss-componentname>` — kebab-case, no
  `wa-*`/`sl-*` suffix in the visible tag (`<boss-button>`, `<boss-combobox>`, `<boss-breadcrumb>`).
  This is the standard going forward for anything built or updated from here on. Known exceptions
  that predate this convention: always double-check a component's real tag with whoever owns the
  source before assuming — some older components use a bare tag with no `boss-` prefix at all
  (tags themselves have no `boss-tag` wrapper, raw `sl-tag`/`wa-tag` either side of the migration).

- **Always bind to real tokens — color, spacing, typography, effects — never a value that just
  happens to match.** A raw hex/fontSize/spacing number that visually matches a token is not the
  same as being bound to it: if the token changes later, an unbound value won't follow. This bit
  Combobox directly — every text node had the correct pixel size (12px/16px) but none were actually
  bound to `Caption`/`Body/1`, and two effect nodes used raw one-off shadow values instead of the
  shared `Focus/Ring`/`Error/Ring` styles. Before calling any component "done," audit:
  - **Colors** — fills/strokes should show a real `boundVariables` reference, not a flat hex
  - **Typography** — text nodes should have a real `textStyleId` set (e.g. `Caption`, `Body/1`),
    not just a fontSize/fontName that coincidentally matches one
  - **Spacing** — padding/gap/radius values bound to spacing variables where they exist
  - **Effects** — shadows/glows bound to the real shared effect style (`Focus/Ring`, `Error/Ring`),
    not a duplicated one-off with slightly different opacity/behavior

- **Sizing scope:** this system only needs Medium-size form controls (Input, Select, Combobox).
  Small/Large are intentionally out of scope — not an oversight, a deliberate decision (same height
  as Small in code; Medium's 16px font matches body text; no dense-toolbar use case exists in this
  product).
- **Focus mechanism:** flush glow via the `Focus/Ring` / `Error/Ring` effect styles (drop-shadow, offset
  0, spread 3), *not* an offset stroke/outline. This is what Input/Select/Textarea/Combobox actually
  ship in code (`box-shadow: 0 0 0 3px rgba(...)`, with WA's native offset outline explicitly
  suppressed via `outline: none`).
- **Focus color:** `blue/70` (`#49A4DA`) — but confirmed in code only for Input/Select/Combobox/Textarea.
  Not yet confirmed for Checkbox/Radio/Switch/Button — tracked in OR-12956.

---

## 7. Badge rebuild (2026-08-13) — two more lessons

**WA's appearance names don't match their visual weight — check the real library render, not the name.**
Screenshotting the real `Web-Awesome-3-Design-Kit-v2-0-0` Badge component (key
`d4083ea95a9c67e1c98799c12946850015e9f5f5`) showed `Appearance=Accent` is the bold solid-fill look
and `Appearance=Filled` is the *lighter* tint-only look — backwards from what the names suggest.
Would have shipped visually wrong if built from the docs page text alone. This file's old two-value
"Filled"/"Subtle" Badge appearances turned out to already be exact matches for WA's real Accent and
Filled-Outlined, respectively — confirmed by comparing screenshots, not by name.

**Adding a shared TEXT/BOOLEAN component property to variants built via clone-then-recolor (not
`combineAsVariants`):** mint the property once by calling `addComponentProperty` directly on the
`ComponentSetNode` (works even after the set already exists/is combined), then set
`componentPropertyReferences` on the corresponding child node in every variant to that same key.
Do **not** call `addComponentProperty` separately on each variant component — that mints a different
key per call and produces duplicate/inconsistent properties across the set. This is how Badge's new
`Show Start Icon`/`Start Icon`/`Show End Icon`/`End Icon`/`Label` properties were wired across all
40 variants after generating them by cloning one fully-featured template component.

**Icon-in-badge convention:** no INSTANCE_SWAP icon component convention exists anywhere in this
file. Icons are modeled as plain TEXT nodes set to `Font Awesome 7 Pro` Regular with a glyph-name
string as `characters` (e.g. `"star"`, `"arrow-right"`) — the same pattern Tag already uses for its
close (`X`) icon. Reuse this, don't introduce INSTANCE_SWAP icon slots as a new pattern.

**Correction (same day):** initially skipped modeling `attention` (pulse/bounce) as a real Badge
option because the real WA kit component doesn't expose it as a variant either — reasonable
inference, but wrong call. The user explicitly wants "an example and option for everything" on a
given WA docs page, which overrides matching the kit component 1:1. Added `Show Pulse`/`Show
Bounce` booleans that render a static halo/dashed-ring proxy (animations can't be shown in a still
frame) — document clearly in the component description that these are a static proxy, not a literal
port, so nobody expects the Figma rendering to animate. Lesson: when a user names a specific docs
page as the completeness bar, treat every section of that page as in-scope by default, even ones
the "real" reference library omits — ask before dropping a section, don't infer it out of scope.

**`figma.createAutoLayout()` / `figma.createFrame()` default to an opaque white fill.** Wrapping
badge instances in helper-built row/column auto-layout frames (for the Examples section's dark
"preview card" look) without explicitly setting `fills = []` painted a solid white bar over the
dark card background — looked like a broken corner/notch in a screenshot, not obviously "the row
has a fill." Any decorative-only wrapper frame needs `fills = []` set explicitly; don't assume a
fresh frame is transparent.

**Badge's real Neutral text/border token is near-black** (`color/text/primary`, designed for this
file's light pages) — placed on a dark preview-card background (to visually match a dark-themed
reference doc site) it goes invisible. This is a real light-vs-dark token mismatch, not a bug: fix
it with a display-only per-instance override in the example (don't change the shared token/component
just to satisfy one dark-background demo).

---

## 8. Checking and fixing variant-model drift against the real WA kit

Companion to the Project Brief's "Match WebAwesome's variant model, not just its geometry" rule —
this section is the mechanical how-to. Grew out of the 2026-09-08 pass that found Hover states on
Radio/Switch/Checkbox that WA doesn't model, Tooltip trimmed from 12 placements to 4, and
Accordion's Icon Placement locked to one option — none individually alarming, all invisible unless
someone actually diffed this file's variants against WA's real ones.

**Note the Badge exception (§7 above) before applying this mechanically:** matching WA's variant
model is the *default*, not an absolute rule. When the user (or a docs page named as the
completeness bar) explicitly wants more than WA models — Badge's pulse/bounce booleans are the
precedent — that instruction wins. The point of this section is to stop *silent, undiscussed*
drift in either direction, not to forbid deliberate, confirmed departures from WA.

**1. Get the real WA property list fresh, every time.** Don't trust this brief's own notes about
what a WA component models — they can be stale (the Radio/Switch color-drift findings were only
caught by re-inspecting live `boundVariables`, not by reading prior notes). Re-import and read
directly:
```js
const waSet = await figma.importComponentSetByKeyAsync(COMPONENT_KEY); // no need to place it on canvas
return waSet.componentPropertyDefinitions; // and waSet.children.map(c => c.name) for exact variant combos
```

**2. Diff against this file's live version**, not against what the brief says it should be:
```js
const compSet = await figma.getNodeByIdAsync(THIS_FILES_COMPSET_ID);
return compSet.componentPropertyDefinitions;
```
Compare property-by-property. A property/option WA has that this file doesn't (or vice versa) is a
real finding — decide and document which side of the Badge exception it falls on.

**3. Check for instance usage before removing anything.** Never delete a variant without first
confirming nothing on the page (or, time permitting, elsewhere in the file) references it as a
main component — a removed variant that something still points to leaves a broken instance behind:
```js
const instances = page.findAllWithCriteria({ types: ['INSTANCE'] });
for (const inst of instances) {
  const main = await inst.getMainComponentAsync();
  if (main && targetVariantIds.has(main.id)) { /* flag before deleting */ }
}
```

**4. Adding a missing WA option to an existing axis (e.g. Accordion's Icon Placement, Tooltip's
Start/End placements): clone, don't rebuild from scratch.** Clone the closest existing variant,
make the minimal structural change (reorder auto-layout children, flip a `primaryAxisAlignItems`
from `CENTER` to `MIN`/`MAX`), rename, and let inherited auto-layout/property bindings carry over.
Reverse-engineering pixel offsets from the WA source is unnecessary and error-prone when the real
component's alignment/padding properties are readable directly (see the Tooltip Start/End build:
the "obvious" fix looked like manual arrow-position math, but the real fix was three lines reading
`primaryAxisAlignItems`).

**5. Recombining variants that were previously grouped will very likely hit the malformed-name bug
(§2 above) — expect it, don't be surprised by it.** Every fix in this section so far (Tooltip,
Accordion) that mixed *previously-grouped* variants with *freshly-created* ones during a
`combineAsVariants` call reproduced this bug on the previously-grouped ones specifically. Plan for
the rename-fix step as part of the work, not as debugging when it "goes wrong."

**6. Re-check page layout after the set grows — and after extending an existing range, not just
after adding a brand-new variant type.** Adding variants makes the ComponentSet taller/wider —
re-verify nothing below or beside it (a To-Do frame, a section boundary) now overlaps. This is a
`page.children.map(c => ({name: c.name, x: c.x, y: c.y}))` position check, not a screenshot judgment
call — do it every time. Caught real overlaps repeatedly:
- Tooltip's reference section, Accordion's To-Do frame (both from the 2026-09-08 pass above)
- Financial Table Read Only Cell: `Collapsed`/`Expanded`/`Empty` added at a default/arbitrary
  position (often `(0,0)`) without checking where existing variants already sat, then again with
  `No Value` landing directly on top of `Collapsed`
- GL Child/GL Ghost Row (2026-09-15): adding `Depth=4` appended the new variants without
  repositioning, landing off in unrelated space while the *existing* depths' grid layout stayed
  untouched — same root cause, just triggered by extending a property's range rather than adding a
  new one

A quick `cellSet.children.map(c => ({name: c.name, x: c.x, y: c.y}))` before placing anything new
costs nothing and prevents this every time; when it's an existing range being extended rather than a
new variant type, re-lay-out the *whole* set (all values, not just the new addition) in the
established row/column grid after adding, rather than only positioning the new piece.

**7. Update the component's own on-canvas documentation text, not just this brief.** A "Known
limitations" note that says "Icon Placement fixed at End" is actively wrong once Start is added —
stale on-canvas docs are exactly the kind of drift this whole section exists to prevent. Grep the
page's text nodes for the old constraint before considering the update done.

**Watch for silent clipping when appending to that documentation text (found during the Dialog
boolean-conversion audit, 2026-09-08):** not every doc/To-Do frame in this file is auto-layout.
Appending text to a `TEXT` node with `textAutoResize='HEIGHT'` grows the text node correctly, but
if its parent frame has `layoutMode='NONE'` and `clipsContent=true` (a plain fixed-size frame, not
an auto-layout one), the frame itself does **not** grow to match — the added text silently clips at
the frame's old bottom edge. `get_screenshot` on the frame will report the *old*, wrong dimensions
and look fine at a glance; only reading the actual rendered image (not just trusting the returned
width/height) surfaces the cut-off sentence. Check `frame.layoutMode` before assuming a text append
is safe — if `'NONE'`, resize the frame explicitly afterward:
```js
todo.resizeWithoutConstraints(todo.width, textNode.y + textNode.height + margin);
```

**A second, sneakier variant of the same bug (found on the Dropdown page during the same 2026-09-08
audit): the TEXT node itself can have `textAutoResize='NONE'`, not just its parent frame.** Most
doc/To-Do text in this file uses `textAutoResize='HEIGHT'` (grows with content), but the Dropdown
page's `desc`/`body` text nodes were `'NONE'` (fixed box) — appending text left `node.height`
completely unchanged (reporting the old, pre-append value), so computing a sibling's new position
from that height positioned it as if nothing had grown, and the resize check based on it concluded
"no resize needed" when the opposite was true. **Before trusting any `textNode.height` read after
an append, check `textNode.textAutoResize` first** — if `'NONE'`, temporarily set it to `'HEIGHT'`
to force Figma to compute the true content height, read `.height` again, *then* do position/resize
math with that real number:
```js
if (node.textAutoResize === 'NONE') node.textAutoResize = 'HEIGHT'; // now .height reflects real content
const trueHeight = node.height;
```
Also: fixing one section's height can cascade — growing a Documentation section can push it past
a To-Do section positioned right after it, which can in turn collide with whatever comes after
*that*. After any resize, re-check the whole page's children for overlaps programmatically (a
simple AABB overlap test), not just the two sections you touched.

---

## 9. Don't prefix boolean property names with "Show"

Name a boolean property after the *thing it controls*, not the action of showing it — `Trailing
Icon`, not `Show Trailing Icon`. The "show/hide" behavior is already implied by it being a
boolean; restating it in the name is redundant and makes the properties panel noisier.

**Renamed 2026-08-17:** `Show Value` → `Value`, `Show Tag` → `Tag` (Financial Table Read Only
Cell); `Show Sort` → `Sort`, `Show Date` → `Date` (Header Cell Types); `Show Cursor` → `Cursor`
(Financial Table Editable Cell). All 5 confirmed still working after the rename. `Show Trailing
Icon` → `Trailing Icon` (Card Header) was the first instance of this rule being applied.
