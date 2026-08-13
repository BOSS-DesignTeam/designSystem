# Figma Workflow Notes — BOSS Design System
*Companion to BOSS_PD.md and the Project Brief. This file is technical/process — how to work in this
specific Figma file without repeating mistakes already made once. Update it when a new one surfaces.*

---

## 1. Check local Figma styles/variables BEFORE reaching for external docs

**The mistake, twice:** building something from generic WebAwesome/Shoelace documentation instead of
searching this file's own effect styles and variables first.

- Assumed `color/border/focus` needed to be created — it already existed, already aliased to `blue/70`.
- Built Checkbox's focus ring as a stroke/offset-outline based on generic WA/Shoelace docs (`outline-offset: 2px`)
  — this file already has a real `Focus/Ring` effect style (flush drop-shadow, offset 0, spread 3, `#49A4DA`
  @ 30%) already in use on Input/Select/Textarea. Had to rebuild Checkbox to match.

**Rule going forward:** before proposing a new token, pattern, or "the WebAwesome way" of doing something,
check `figma.variables.getLocalVariableCollectionsAsync()` and `figma.getLocalEffectStylesAsync()` /
`getLocalTextStylesAsync()` first. If it's not there, *then* check what real shipped code does
(SCSS files, live app) before falling back to generic library documentation as a last resort.

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

### `combineAsVariants` can produce malformed property names
Renaming children to `"Type=X, State=Y"` before calling `combineAsVariants` sometimes produces junk
property names like `"=Single Select, =Single, =Default"` instead of clean `Type`/`State` properties —
likely picking up a stray property from the original parent. **Fix:** after combining, always check
`componentPropertyDefinitions` and rename children directly if malformed. Don't assume the rename
survived the combine.

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

## 4. Jira story conventions (OR project, Back Office Dev)

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

## 5. Recurring design decisions worth remembering

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

## 6. Badge rebuild (2026-08-13) — two more lessons

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
