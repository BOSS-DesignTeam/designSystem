# BOSS Design System — Project Brief
*Paste this entire document as the Project Instructions when creating the "BOSS Design System" project on Claude.ai or Cowork.*

---

## What this project is

We are building **RestaurantUI** — a Figma design system for Back Office (bepbackoffice.com), a restaurant management SaaS targeting independent operators and franchise networks. The system mirrors the **WebAwesome (WA)** semantic token model used in the codebase.

**Figma file key:** `B5j3nfocmShiBwqwy9dNXg`
**RUN_ID for idempotency tagging:** `bo-ds-2026-001`

---

## Reference files (always read these first)

Both files live in the Claude work folder / project knowledge:

- `restaurantui-token-system-for-ux 1 (1).md` — source of truth for all tokens (color, typography, spacing, component APIs). Critical sections: §0 WA gotchas, §2 color, §3 typography, §4 spacing/radius, §5 form-control sizing, §7 button variants, §9 component catalog.
- `BOSS_PD.md` — UX/UI craft standards, design heuristics, anti-patterns, Figma file organization, component governance, token values.

---

## Real WebAwesome Figma library — check this FIRST, always

There is a real, actual WebAwesome component library available in this Figma org:
**Web-Awesome-3-Design-Kit-v2-0-0** (library key `lk-46ccc9e51e4a78ca22bcd7c54d570a2abcb180a86
99a396f28d23e4d3514e3b4efde5caaf5d9993f83b52f24198d3f6cc083954e8526a5e338593f5466ed4f26`). It is
**not yet added to this file** (shows up under `libraries_available_to_add` via `get_libraries`,
not `libraries_added_to_file`), which is why it was missed for a full day of work on Radio/
Switch/Tooltip (2026-07-20) — those were hand-built from CSS research first, wrong, then had to
be rebuilt from this real library after the user called it out ("why are you still building
your own thing?").

**There is also a second, independent reference to the same class of resource, documented since
the very first Button component work on 2026-07-13:** a WebAwesome Figma kit file, key
`UAtCpcylvJ96X02SbIVSeM` (confirmed reachable — its Cover page loads fine). Both this file key
and the library key above point at the same real WebAwesome design asset. **Neither was
checked before hand-building Radio/Switch/Tooltip on 2026-07-20** — the file key had been sitting
in this brief for a week, the library was one `get_libraries` call away, and both were missed
until the user directly called it out twice ("why are you still building your own thing?" and,
after being told the task was rated "bad" for exactly this reason, a follow-up explaining that
the guidance had already been documented). **This is the single most important lesson in this
entire brief — read this section before writing a single line of component geometry.**

**Before building or "porting" ANY component going forward:** run `get_libraries` (or
`search_design_system` with `includeLibraryKeys` scoped to the key above) for the component
name FIRST, and/or check the `UAtCpcylvJ96X02SbIVSeM` file directly. If it exists in either, import
it (`figma.importComponentSetByKeyAsync` / `importComponentByKeyAsync`), create an instance of
the needed variant, `detachInstance()`, and rebind colors to this file's own tokens — do not
hand-draw geometry from web research or memory. Only hand-build from scratch if the component
genuinely isn't in either (confirmed via search, not assumed).

---

## Figma permissions

- You have pre-authorized permission to create new Figma elements, frames, components, and files.
- You are **NEVER** permitted to modify or delete existing Figma nodes.

---

## Critical token knowledge

### WA tint scale is INVERTED
Higher number = lighter. `50` = KEY (most saturated).

| Primitive | Hex | Meaning |
|---|---|---|
| `blue/50` | `#23408f` | Brand primary (KEY) |
| `blue/70` | `#49a4da` | Link / dark-mode brand |
| `blue/30` | `#002790` | Hover / pressed |
| `red/50` | `#fa1616` | Danger (KEY) |
| `orange/50` | `#fa9016` | **Warning = orange, NOT yellow** |
| `green/50` | `#00a95d` | Success (KEY) |
| `gray/10` | `#18191D` | Body text primary |
| `gray/50` | `#5f6272` | Secondary text |
| `gray/border` | `#d3d8e0` | Border (extra primitive, not in WA scale) |
| `white` | `#ffffff` | Surface / on-filled text |
| `black/spec-dark` | `#060d21` | Dark mode surface |

### Dark mode strategy
Codebase has no dark theme — dark values were designed net-new:
- Brand buttons keep `blue/50` fill (readable on dark)
- Text inverts (`gray/10` → `white`)
- Surfaces use `black/spec-dark` (`#060d21`)
- Secondary text uses `gray/70` in dark (vs `gray/50` in light)

---

## What's already built in the Figma file

### Variables (118 total, 0 broken aliases)

**Primitives collection** (`VariableCollectionId:1:2`, mode `1:0`)
- 42 COLOR variables, all `scopes=[]` (hidden from pickers), WA CSS var code syntax
- Includes all blue, red, orange, green, gray tints plus accent colors and surface primitives

**Color collection** (`VariableCollectionId:2:2`, Light mode `2:0`, Dark mode `2:1`)
- 53 semantic COLOR variables aliased to Primitives
- Targeted scopes: backgrounds = `FRAME_FILL/SHAPE_FILL`, text = `TEXT_FILL`, borders = `STROKE_COLOR`
- Key semantic tokens:

| Token | Light | Dark |
|---|---|---|
| `color/bg/brand/default` | blue/50 | blue/50 |
| `color/bg/brand/hover` | blue/30 | blue/70 |
| `color/bg/disabled` | gray/80 | gray/40 |
| `color/text/on-filled` | white | white |
| `color/text/on-disabled` | gray/60 | gray/60 |
| `color/text/brand` | blue/50 | blue/70 |
| `color/text/link` | blue/70 | blue/70 |
| `color/border/brand` | blue/50 | blue/70 |
| `color/surface/default` | white | black/spec-dark |

**Spacing collection** (`VariableCollectionId:3:2`, mode `3:0`)
- 26 FLOAT variables: spacing (11 steps, `spacing/0`–`spacing/10`), radius (5: `radius/xs`–`radius/xl`), control heights (5: `height/control/xs`–`xl`), control padding (5: `padding/control/xs`–`xl`)
- Key values: `spacing/2`=8px, `padding/control/m`=14px, `radius/m`=4px, `height/control/m`=32px

### Text styles (9 total)
All Roboto. Heading/1 (34px/Regular), Heading/3 (20px/Medium), Subtitle/1 (16px/Medium), Subtitle/2 (14px/Medium), Body/1 (16px/Regular), Body/2 (14px/Regular), Label/Button (14px/Medium), Caption (12px/Regular), Column Header (12px/Medium).

### Pages
- `0:1` Cover
- `5:2` Foundations — Colors documentation added 2026-07-17 (see Colors Foundations section below); Spacing documentation added 2026-07-21/22; type scale still not populated
- `5:3` --- (divider)
- `5:4` Button (Steve)
- `460:2` Split Button (Steve) — added 2026-07-13
- `468:2` Dropdown (Steve) — not previously logged in this brief; found during the 2026-07-22 Code Connect audit. Only "Dropdown Trigger" (ComponentSet `472:74`) is actually built — "Dropdown Item" is documented in text on the page but was never built as a real component.
- `741:2` --- Atoms --- (divider) — added 2026-07-20, marks the start of the atomic-design-tier section
- `741:3` Radio (Steve) — added 2026-07-20
- `741:4` Switch (Steve) — added 2026-07-20
- `741:5` Tooltip (Steve) — added 2026-07-20

### Button component (page `5:4` "Button (Steve)", ComponentSet ID `455:92`)
**NOTE (2026-07-13):** the original ComponentSet `13:2` (30 variants, described below in the
pre-2026-07-13 spec) was deleted in error while rebuilding this component — a violation of
the "never delete existing Figma nodes" rule. Recovery from Figma version history is on the
design team to confirm; this section describes the replacement that currently exists in the
file.

**45 variants** = 2 Variants × 4 Appearances × 3 Sizes × 3 States — combined into one
ComponentSet named `Button`.

- **Variant axis:** `Brand` | `Danger` (reduced from the prior brand/neutral/danger/success/
  warning — the BO Design Library's Buttons & Button Groups reference only defines blue and
  red; no green/orange/black tokens exist there. Flag design team if Neutral/Success
  semantics are still needed on other BO screens.)
- **Appearance axis:** `Filled` | `Outlined` | `Plain` | `Accent` (naming matches the
  WebAwesome Figma kit, file `UAtCpcylvJ96X02SbIVSeM`)
- **Size axis:** `Small` (12px label) | `Medium` (16px, default) | `Large` (20px) — all use
  16px/8px padding, 4px gap, 4px corner radius
- **State axis:** `Default` | `Hover` | `Disabled` (no `Active` — not defined in the library)

**Colors — BOSS_PD.md is the source of truth (resolved 2026-07-13, supersedes raw Design
Library hex where they conflicted):**

| Variant \| Appearance | Default | Hover | Disabled |
|---|---|---|---|
| Brand \| Filled | bg `$brand-darker-blue` #23408f, text white | bg `$brand-hover-blue` #002790, text white | Default look @ opacity 0.6 |
| Brand \| Outlined | border/text `$brand-darker-blue` #23408f, transparent bg | bg `$brand-secondary-hover-blue` #c8cfe3 | Default look @ opacity 0.6 |
| Brand \| Plain | text `$brand-darker-blue` #23408f, no border/bg | bg `$brand-secondary-hover-blue` #c8cfe3 | Default look @ opacity 0.6 |
| Brand \| Accent | text `$brand-active-blue` #49a4da, no border/bg | text `$brand-hover-blue` #002790 | Default look @ opacity 0.6 |
| Danger \| Filled | bg `$brand-warn` #fa1616, text white | bg `$brand-warn-hover` #e60c0c, text white | Default look @ opacity 0.6 |

Disabled uses component-level `opacity=0.6` on the Default appearance (matches the original
BOSS convention) rather than distinct lighter hex tints — the Design Library uses the latter,
but BOSS_PD.md's established opacity convention wins per source-of-truth resolution.

Labels use **Roboto Medium** per BOSS_PD.md §4.3 (not Roboto Regular as the Design Library's
own Button reference uses).

**Known limitation:** no dedicated BOSS_PD.md tokens exist for Outlined-hover border,
Plain-hover, or Accent-hover — reused the closest existing token (`$brand-secondary-hover-blue`
for hover surfaces, `$brand-hover-blue` for Accent's hover text) rather than inventing new
values. Flag to design team if dedicated tokens should be added.

---

### Split Button component (page `460:2` "Split Button (Steve)", ComponentSet ID `540:7`)
**Added 2026-07-13.** **ID correction (2026-07-22):** this brief previously listed the ComponentSet
ID as `461:110`. That node no longer exists — confirmed via direct lookup during the Code Connect
audit. The live component now lives at `540:7` ("Split Button (FA chevron-down)" section), created
when the hand-built chevron caret was swapped for the real Font Awesome `chevron-down` glyph. The
`461:110` → `540:7` change was never recorded here at the time; flagging so future audits don't
chase a dead ID. Real tag: `orderly-split-button` — a primary-action button fused with a
caret-triggered dropdown of plain string options in one control. Identified from the live
style guide's own Dropdown docs, which name-drop it as the simpler alternative to
`boss-dropdown` for "a simple primary-action-plus-variants menu with plain string options."

**18 variants** = 1 Variant × 2 Appearances × 3 Sizes × 3 States, combined into one
ComponentSet named `Split Button`.

- **Variant axis:** `Brand` only — the BO Design Library's Split Button reference only models
  Brand; no Danger split-button exists there.
- **Appearance axis:** `Filled` | `Outlined` only — `Plain`/`Accent` are borderless and use
  the simpler single-button `with-caret` pattern instead of a two-segment split (confirmed via
  the live style guide HTML).
- **Size axis:** `Small` | `Medium` | `Large`, matching Button.
- **State axis:** `Default` | `Hover` | `Disabled` — extrapolated from Button's resolved
  BOSS_PD.md spec; the Design Library reference only shows one static state per size/type.

**Structure:** two adjacent segments in one auto-layout row (`itemSpacing: 0`) — `main`
(label, rounded left corners only) and `caret` (hand-built vector chevron, rounded right
corners only). Filled divider between segments uses `$brand-border-primary` #d3d8e0 (BOSS_PD.md);
Outlined segments share the brand border with no doubled seam (`main` has no right stroke,
`caret` has no left stroke).

**Colors:** identical to the Button component's resolved Brand/Filled and Brand/Outlined
values (BOSS_PD.md source of truth) — see the Button component section above for the table.
Disabled = opacity 0.6 on the Default look, same convention as Button.

**Known limitations (see page's own To-Do section for detail):**
1. `orderly-split-button`'s real prop/event names in the doc's usage snippet are inferred from
   Button/`boss-dropdown-item` conventions — unconfirmed against the live
   `/styleGuideV2/components/split-button` page (only the Dropdown page was captured for
   reference). Verify before dev handoff.
2. Caret icon is a hand-built vector chevron, not the real Font Awesome 7 Pro glyph the live
   app uses (font may not be installed in this Figma file).
3. No hover/disabled reference existed in the Design Library — extrapolated from Button.

---

### Colors Foundations page (page `5:2` "Foundations", root frame `701:2`)
**Added 2026-07-17.** A "Colors" documentation section built on the previously-empty Foundations
page, covering 8 hue families / 42 swatches: Brand-Blue, Danger-Red, Success-Green,
Warning-Orange, Neutral-Gray, Base (White/Black), Surfaces, and Accents. Layout mirrors the
Design Library's own Colors page (file `wdwwm6VbBU89GFViEvcfkY`, page "✏️ Colors", frame
`490:205`): a swatch block + variable name + hex + legacy `$brand-*` SCSS alias, grouped by
family. Every swatch rectangle is bound live to its Primitives variable (not a flat hex fill),
so it stays in sync if the token changes.

**Source of truth used:** live-app CSS extracted from the saved `Back Office_Bankrec.html` and
`Back Office_GL_Alltransactions.html` captures (their bundled `styles-*.css`), cross-checked
against BOSS_PD.md / the restaurantui token doc and the Design Library's Colors page. Only
non-legacy categories were included — the Marketing/legacy palette from BOSS_PD.md §4.1 was
deliberately excluded as out of scope for the live app shell.

**Component-scoped grays intentionally excluded:** `gray/spec-dark`, `gray/select-border`,
`gray/select-disabled`, `gray/option-hover`, `gray/combobox-disabled`, `gray/tooltip-bg`,
`gray/tag-resting`, `blue/button-disabled` are component-implementation tokens (Select/Combobox/
Tooltip/Tag specific), not part of the general foundational palette — left off this page by
design.

**Bugs found and fixed while building this page (existing variables, not new — see the
"never modify existing nodes" rule; user explicitly authorized both fixes):**

1. **Brand semantic Light-mode values were scrambled.** `color/bg/brand/default`,
   `color/bg/brand/hover`, `color/text/brand`, `color/border/brand`, and `color/icon/brand` had
   Light-mode values hardcoded to stray orange/magenta raw hex instead of aliasing the correct
   blue primitives. Corrected all 5 to alias `blue/50` (default/text/border/icon) or `blue/30`
   (hover), matching the table above. Also aligned `codeSyntax` on all 5 to the WebAwesome
   role+tint convention (`var(--wa-color-brand-50)`, `var(--wa-color-brand-30)`), matching the
   pattern already used correctly on the danger tokens — previously these 5 used an
   inconsistent legacy `--color-bg-brand-hover`-style syntax. Did not touch the Button
   component's own tokens (`color/bg/button/brand-*`, `683:x` series) — those were already
   correct throughout.
2. **Two Primitives had drifted hex values vs. the live app.** `gray/border` was `#D7D8DC`
   (should be `#D3D8E0`) and `gray/60` was `#8D8D95` (should be `#8D8D90`). Confirmed against
   the live app's own compiled CSS in both HTML captures (`border:1px solid #d3d8e0` appears
   throughout `.boss-table-row` etc.; `--wa-color-gray-60: #8d8d90` is set directly in the
   WebAwesome variable block) — the HTML captures were treated as source of truth over BOSS_PD.md
   for this correction, though BOSS_PD.md's documented values already happened to match. Both
   primitive variables corrected; swatch labels on the Colors page updated to match.

---

## Atomic Design pass (2026-07-20)

**Method:** surveyed all 72 pages of the old Design Library (`wdwwm6VbBU89GFViEvcfkY`) for
atom-tier components (Button, Checkbox, Input, Tag, Divider — already ported into this file
earlier), cross-referenced against WebAwesome's real component catalog and the live codebase
(`restaurantui-token-system-for-ux 1 (1).md` §9). This surfaced one true gap already present in
the old library (Tooltip) and two gaps that exist in neither Figma library but are real,
WA-defined, codebase-used atoms (Radio, Switch). Everything else in the old library (Alert,
Toasts, Empty State, Menu, Table, Drawer, Navigation, Datepicker, etc.) is a molecule/organism —
composed of atoms, not one itself — and was excluded from this pass.

**Icon was evaluated and NOT built as a component.** The old library has no formal Icon
component (only raw Font Awesome exploration/instruction pages), and building one was
considered, but the user's direction instead was a standing policy: **use Font Awesome icons
directly (as literal glyph text, per the established convention from the Split Button caret)
any time a component needs an icon, rather than building/maintaining a separate Icon atom
component.** Apply this to all future component work in this file.

Per explicit user direction, each new atom got its **own page** (matching the existing
one-page-per-component convention — Button, Checkbox, Input, etc. each have their own page),
NOT bundled onto a single shared "Atoms" page. A new divider page `--- Atoms ---` (`741:2`)
was added instead, marking the start of the atomic-tier section in the page list.

### Radio component (page `741:3` "Radio (Steve)", ComponentSet ID `771:432`)
**Added 2026-07-20, rebuilt from the real WebAwesome library same day (see below).** 6 variants
= `Value` (Unselected/Selected) × `RadioState` (Default/Hover/Disabled). Sourced from the real
"Web-Awesome-3-Design-Kit-v2-0-0" org library (component key `53761025bdb44a5b9c7a4880b2568164
6d038bf0`) via `importComponentSetByKeyAsync` — imported the Appearance=Default/Size=Medium
variants, detached, and rebound colors to this file's tokens. 20px circle (real WA size — the
first draft guessed 14px to match Checkbox and was wrong), 8px gap to label, 1px border
(`gray/border` unselected, `blue/50` selected 14px dot). A "Focus Ring" element from the kit is
present but hidden (`visible=false`), kept for future focus-state work. Hover is NOT a variant
in the real kit — synthesized by darkening border/dot to `gray/70`/`blue/30`, matching this
file's Checkbox convention. Disabled = 0.5 component opacity, imported directly from the kit's
own Disabled variants. Maps to `wa-radio` / `bossRadioGroup`. Real prop mapping still inferred
for `bossRadioGroup` specifically — flag before dev handoff.

### Switch component (page `741:4` "Switch (Steve)", ComponentSet ID `775:666`)
**Added 2026-07-20, rebuilt from the real WebAwesome library same day (see below).** 6 variants
= `Value` (Off/On) × `SwitchState` (Default/Hover/Disabled). Sourced from the real
"Web-Awesome-3-Design-Kit-v2-0-0" org library (component key `02ffbeb3bc023ecbed752329cdc9381c
022a5860`) — imported the Size=Medium variants, detached, rebound colors. Track: 35×20px pill
(real WA size — the first draft guessed 36×20 and was close but not exact), 12px thumb at 4px
inset (first draft used 16px/2px). Off = white track + `gray/70` border/thumb; On = `blue/50`
track + white thumb. Focus Ring preserved but hidden. Hover synthesized (not a real WA variant)
by darkening to `gray/60`/`blue/30`. Disabled = 0.5 opacity, from the kit's own Disabled
variants. Maps to `wa-switch` — flagged as "next up" before this pass. Real prop mapping
unconfirmed — flag before dev handoff.

### Tooltip component (page `741:5` "Tooltip (Steve)", ComponentSet ID `769:16`)
**Added 2026-07-20, rebuilt from the real WebAwesome library same day (see below).** 4 variants
= `Placement` (Top/Right/Bottom/Left). Originally ported from the old Design Library's own
Tooltip component (page "Tooltip", `14108:1490`, 12 placements) but hand-rebuilt from CSS
research first — wrong twice (triangle-polygon arrow, then corrected-but-still-approximated
padding/radius). Final version sourced from the real "Web-Awesome-3-Design-Kit-v2-0-0" org
library (component key `7225dad6ddab3242ed9a0d8aaf53023f172d50f0`) — imported Top/Bottom/Left/
Right variants, detached, rebound colors to `gray/tooltip-bg`. Real structure: a "Body" frame
(3px corner radius — the CSS-research draft guessed 4px) plus a separate "Arrow Placement"
frame containing an 8.48px square rotated 45° (arrow-size 6px × 0.7071 × 2, overlapping the
body edge so only the tip shows). Simplified from the kit's 12 placements (incl. Start/End) and
its Content INSTANCE_SWAP/With-Arrow boolean to the 4 core directions with plain text, matching
this reference's scope. No interaction states apply. Maps to `wa-tooltip`.

**Fixed 2026-07-20 (post-build bugs, three rounds):**

1. All three ComponentSets (Radio, Switch, Tooltip) were initially clipping some variants.
   Root cause: (a) Radio/Switch variant components were built by setting `layoutMode` directly
   rather than via `figma.createAutoLayout()`, leaving `counterAxisSizingMode` stuck on `FIXED`
   at Figma's 100px component default instead of hugging content; (b) after
   `combineAsVariants()`, variants were manually repositioned into a grid but the ComponentSet
   frame itself was never resized to match, so it kept its combine-time bounding box and
   clipped anything positioned outside it. Fixed by setting `counterAxisSizingMode = 'AUTO'` on
   each variant and resizing each ComponentSet.
2. The first fix's section resize introduced a second bug: the containing Section's size was
   computed from the ComponentSet's own `width`/`height` only, forgetting the ComponentSet
   itself sits at an offset (x=60, y=70) inside the section — so the sections were resized
   *smaller* than the offset + content actually needed, making Radio/Switch worse and leaving
   Tooltip's height ~10px short. Fixed by computing section size as `set.x + set.width + margin`
   / `set.y + set.height + margin` for all three.
3. The Tooltip arrow itself was wrong from the original build — a hand-drawn 3-point polygon
   triangle with buggy positioning, not matching WebAwesome/Shoelace's real popup-arrow
   mechanism. Researched the actual Shoelace/WA source (`popup.styles.ts`,
   `tooltip.styles.ts`, `light.css` theme tokens) and rebuilt to match exactly: the arrow is a
   **6px square rotated 45°** (a diamond, not a triangle) — size = `arrow-size × 0.7071 × 2`,
   same fill as the body, inserted *behind* the body in child order (z-index equivalent) so only
   the near tip pokes out past the body edge. Also corrected padding and font-size to the real
   Shoelace token defaults.
4. **Root-cause fix, not just a patch:** all three components (Tooltip, Radio, Switch) were
   hand-rebuilt from CSS/web research instead of sourced from Figma directly — even after the
   CSS-accurate tooltip-arrow fix, this was still "building our own thing" rather than using the
   authoritative design asset. Checked `get_libraries` on this file and found a real
   **Web-Awesome-3-Design-Kit-v2-0-0** library already available in the org (not yet added to
   this file) with real Tooltip, Radio, and Switch component sets. Replaced all three hand-built
   components with real imports: `figma.importComponentSetByKeyAsync()` → picked the needed
   variants → `createInstance()` → `detachInstance()` → rebound colors from the kit's own
   variables to this file's tokens (gray/tooltip-bg, gray/border, blue/50, gray/70) → text
   swapped to this file's Roboto. This is real, more precise geometry than any hand-built
   version: Tooltip body corner radius 3 (was guessed as 4), Radio circle 20px (was built at
   14px to match Checkbox — now bigger, matching WA proper), Switch track 35×20px with a 12px
   thumb at 4px inset (was hand-built at 36×20/16px). A "Focus Ring" element exists in the real
   Radio/Switch components (hidden, kept for future focus-state work) that wasn't in the
   hand-built versions at all. Hover states still had to be synthesized (the real WA kit doesn't
   model Hover as a variant) by darkening border/fill colors, consistent with this file's
   Default/Hover/Disabled convention from Checkbox.

Verified visually — all three components fully contained in their sections, real geometry
throughout, no more hand-approximated shapes.

---

## Publish & Code Connect audit (2026-07-22)

**Trigger:** user asked to audit every `(Steve)`-labeled component — check that Code Connect
points at a real production component rather than defaulting to "generic WebAwesome," confirm
each component is published (a hard prerequisite for Code Connect), and confirm the component is
readable by developer AI agents via `get_design_context`.

**Scope found:** 6 `(Steve)` components, not the 5 this brief had previously logged — `Dropdown
(Steve)` / `Dropdown Trigger` (page `468:2`, ComponentSet `472:74`) was undocumented until
this pass (see Pages list above).

**Findings before any fix:**
- **None of the 6 had any Code Connect mapping at all** — `get_code_connect_map` returned `{}`
  for every one. The "generic WebAwesome" concern was directionally right but understated the
  actual risk: with no mapping, `get_design_context`'s fallback auto-generates raw React+Tailwind
  JSX straight from layer geometry — the wrong framework entirely for this codebase (Angular +
  WebAwesome custom elements/SCSS, not React+Tailwind).
- **Publish status was the real blocker.** Radio (`771:432`), Switch (`775:666`), and Tooltip
  (`769:16`) had **never been published** — confirmed via `getPublishStatusAsync()` returning
  `UNPUBLISHED`. Button (`455:92`) and Split Button (`540:7`) were published but `CHANGED` (local
  edits since last publish). Dropdown Trigger (`472:74`) was the only one `CURRENT`.
- Empirically confirmed `add_code_connect_map` hard-fails on unpublished components: `"Published
  component not found. Please make sure component/component set is published before mapping."`
  Code Connect cannot be wired up before publishing — there is no workaround.
- **No tool available (Plugin API or Figma MCP) can execute Figma's "Publish" action.** It is a
  manual step only available in the Figma app UI (Assets panel or toolbar Publish dialog,
  requires publish rights on the team library). The user published Button, Split Button,
  Dropdown Trigger, Radio, Switch, and Tooltip manually; confirmed all 6 as `CURRENT` afterward.

**Code Connect mappings applied (2026-07-22, via `add_code_connect_map`, label `Web Components`),
using documented tag names only — NOT verified against real RestaurantUI source files (user
explicitly chose to skip source verification since the repo isn't checked out in this workspace):**

| Component | Node ID | Mapped source |
|---|---|---|
| Button | `455:92` | `orderly-button (boss-button)` |
| Split Button | `540:7` | `orderly-split-button` |
| Dropdown Trigger | `472:74` | `boss-dropdown + orderly-button (with-caret trigger)` |
| Radio | `771:432` | `bossRadioGroup (wa-radio)` |
| Switch | `775:666` | `wa-switch` |
| Tooltip | `769:16` | `wa-tooltip` |

**Verified post-fix:** `get_design_context` on all 6 now returns `import <Component> from
"<mapped source>"` wrapped in `<CodeConnectSnippet>`, confirming a developer AI agent reading
these nodes gets the real production reference instead of the raw-geometry fallback.

**Follow-up still open:** the mappings above trust the tag names already written into each
page's own documentation text. They have not been checked against actual `boss-*`/`orderly-*`
source files in the RestaurantUI repo. Do this before treating any of the 6 as fully dev-ready
(see Open questions below).

---

## Figma file layout conventions

- Doc frames: Roboto Medium 32px title + Body/2 description, positioned above component sets
- Grid gap: 16px between variants, 40px padding inside ComponentSet
- Column order: `Default | Hover | Disabled` (per Size row); Appearance groups ordered `Filled | Outlined | Plain | Accent`
- Row order: `Brand | Danger` (was: `brand | neutral | danger | success | warning`)
- Page naming: `[Status] Page Name` per craft standards (e.g. `[WIP] Button`)

---

## Component build order (remaining)

Button, Split Button, Input, Select, Badge/Tag, Checkbox, Divider are done. Radio, Switch, and
Tooltip are also done (2026-07-20, via the Atomic Design pass — see that section above).
Dropdown Trigger (page `468:2`) is also built, though "Dropdown Item" on that same page is
documented but not yet built. All 6 `(Steve)` components are now published with Code Connect
mappings applied (see Publish & Code Connect audit section above). Remaining, now
organism/molecule-tier rather than atoms:

1. **Alert / Banner** — uses all 5 semantic colors; WA: `wa-alert`
2. **Modal / Dialog** — WA: `wa-dialog`

---

## Workflow rules

1. Always load `figma:figma-use` + `figma:figma-generate-library` skills before any `use_figma` call.
2. Check `sharedPluginData('dsb', 'key')` before creating — skip if already tagged with `bo-ds-2026-001`.
3. Call `resize()` before setting `layoutMode` on any frame.
4. `await figma.setCurrentPageAsync(page)` — never use sync setter.
5. Always `return` all created node IDs.
6. Screenshot + user checkpoint before moving to the next component.

---

## Open questions / future work

- ~~Add `/85` tint primitives for red and green to enable distinct danger/success subtle-hover states~~ — moot: Neutral/Success/Warning variants dropped from Button 2026-07-13 (see Button component section)
- Add `focus` state to button (focus ring: `color/border/focus`, 2px offset)
- ~~Add `size` component property~~ — done 2026-07-13: Small/Medium/Large added (not xs/xl)
- Confirm recovery status of the original 30-variant Button ComponentSet (`13:2`), deleted in error 2026-07-13
- Add dedicated BOSS_PD.md tokens for Outlined/Plain/Accent hover states (currently reusing `$brand-secondary-hover-blue` / `$brand-hover-blue` as stand-ins)
- ~~Foundations page content (color swatches...) not yet populated~~ — Colors done 2026-07-17, Spacing done 2026-07-21/22 (see respective Foundations sections); type scale still not populated
- Phase 4 QA + accessibility audit pending
- ~~Radio/Switch/Tooltip unpublished, blocking Code Connect~~ — done 2026-07-22, all 6 `(Steve)` components published and Code Connect–mapped (see Publish & Code Connect audit section)
- Code Connect mappings for all 6 `(Steve)` components use documented tag names only — not verified against real `boss-*`/`orderly-*` source files in the RestaurantUI repo. Verify before dev handoff.
- "Dropdown Item" (page `468:2`) is documented in text but was never built as an actual Figma component — only "Dropdown Trigger" exists
