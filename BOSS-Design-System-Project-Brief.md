# BOSS Design System — Project Brief
*Paste this entire document as the Project Instructions when creating the "BOSS Design System" project on Claude.ai or Cowork.*

---

## What this project is

We are building **RestaurantUI** — a Figma design system for Back Office (bepbackoffice.com), a restaurant management SaaS targeting independent operators and franchise networks. The system mirrors the **WebAwesome (WA)** semantic token model used in the codebase.

**Figma file key:** `B5j3nfocmShiBwqwy9dNXg`
**Figma file URL:** https://www.figma.com/design/B5j3nfocmShiBwqwy9dNXg/Back-Office-Design-System-0.1
**RUN_ID for idempotency tagging:** `bo-ds-2026-001`

---

## Reference files (always read these first)

Both files live in the Claude work folder / project knowledge:

- `restaurantui-token-system-for-ux 1 (1).md` — source of truth for all tokens (color, typography, spacing, component APIs). Critical sections: §0 WA gotchas, §2 color, §3 typography, §4 spacing/radius, §5 form-control sizing, §7 button variants, §9 component catalog.
- `BOSS_PD.md` — UX/UI craft standards, design heuristics, anti-patterns, Figma file organization, component governance, token values.
- `tokens.json` — **machine-readable token export synced from real code** (`orderlyapp/orderly`, package `RestaurantUI`; `meta.ref` and `meta.synced` record the branch/commit and date — first sync 2026-10-05 from `thorn/sidebar-wa-refresh@a689fc70d03`). Generated from `_roles.scss`, `_colors.scss`, `_sizing.scss`, `_text.scss`. Contents: `color` (76 `--boss-color-*` roles from code, resolved to hex, each with a `usage` note; light theme only, as the product has no dark mode; plus 2 **Figma-only** entries added by hand 2026-10-06, `boss-color-bg-control-checked` and `boss-color-border-control-checked`, whose `usage` starts with "FIGMA-ONLY" because code has no matching role yet), `type` (Roboto, `heading-1`…`subtitle-2` etc. with size/line-height/weight/tracking), `spacing` (11-step Sass ladder; no `--boss-*` spacing roles exist yet), `radius` (5), `control` (heights + inline padding for the five control sizes). **Use this as the first check for a token value** before the markdown token doc, which is hand-written and can lag code. Values only, no Figma variable IDs: still read Figma variables live when checking for drift.
- `manifest.json` — index of the "Back Office Design System" package (namespace `BackOffice`): the 14 documented components with group + one-line summary and the real tag each wraps (e.g. Button → `orderly-button`, Callout → `boss-callout`, Combobox → `boss-combobox`/`boss-multi-combobox`), plus the Logos asset group (`back-office-wordmark.png`, `back-office-mark.png`). Use it to confirm a component's real tag name and grouping before building or documenting it.
- Both JSON files are the canonical copies. The `.rtf` files next to them are the original TextEdit saves; don't read or edit those. When a newer export arrives, replace the `.json` contents (saved as **plain text**, not RTF) and update the counts above. **Re-add any "FIGMA-ONLY" entries the new export doesn't include**, or drop them once code ships the matching role.

---

## Reference libraries — ONLY these two, never search broadly

Exactly two Figma libraries are in scope for this project. **Every `search_design_system` call
MUST pass `includeLibraryKeys` scoped to the two keys below — never an unscoped search.** An
unscoped search also pulls in Material 3, every Apple OS kit (iOS/macOS/watchOS/visionOS), Ant
Design, Blueprint, Paper Wireframe, and Simple Design System — none relevant to this project. Their
descriptions alone (Material 3's full multi-year changelog, for one) can add tens of thousands of
tokens to a single `get_libraries`/`search_design_system` response for zero benefit — this is
exactly what happened during the Accordion build on 2026-07-30.

```js
includeLibraryKeys: [
  "lk-46ccc9e51e4a78ca22bcd7c54d570a2abcb180a8699a396f28d23e4d3514e3b4efde5caaf5d9993f83b52f24198d3f6cc083954e8526a5e338593f5466ed4f26", // Web-Awesome-3-Design-Kit-v2-0-0
  "lk-890204ffe946154f7c57b4204cf9a32584d66b1f850893304b780d0f40675c0d3e90934973a0f8a16f9b0cf229ad7f5f215ccf9ee5bc421135d6264e911db065", // Back Office Design Library ("the old BOSS design system")
]
```

1. **Web-Awesome-3-Design-Kit-v2-0-0** — the real WebAwesome component library (also reachable as
   a standalone file, key `UAtCpcylvJ96X02SbIVSeM`, confirmed reachable — its Cover page loads
   fine). Primary reference for generic web-component structure/naming/variants (Button, Details/
   Accordion, Progress Bar, etc.).
2. **Back Office Design Library** — the existing "old BOSS" library, already subscribed to this
   file (appears under `libraries_added_to_file`). Check this FIRST for anything that's a
   BO-specific pattern rather than a generic web primitive (e.g. table-row text styles). It has
   no entry for every component — absence here just means fall through to the WebAwesome kit.

**These keys are stable — do not call `get_libraries` to rediscover them.** Only re-run
`get_libraries` if a key above stops resolving, or to check whether a genuinely new library was
subscribed to the file. `get_libraries` is one of the most expensive calls available in this
project (full changelog text for every community library in the org) — treat it as a last resort,
not a routine discovery step.

**Before building or "porting" ANY component:** go straight to `search_design_system` scoped to
the two keys above (skip `get_libraries` entirely). If the component exists in either, import it
(`figma.importComponentSetByKeyAsync` / `importComponentByKeyAsync`), create an instance of the
needed variant, `detachInstance()`, and rebind colors to this file's own tokens — do not hand-draw
geometry from web research or memory. Only hand-build from scratch once absence from *both*
libraries is confirmed via search, not assumed.

**Why this rule exists:** Radio/Switch/Tooltip were hand-built from CSS research on 2026-07-20,
wrong, then had to be rebuilt from the real WebAwesome library after the user called it out twice
("why are you still building your own thing?") — despite both the library and the standalone file
key (documented since Button, 2026-07-13) being available the whole time. **This is still the
single most important lesson in this brief — read this section before writing a single line of
component geometry.**

**Match WebAwesome's *variant model*, not just its geometry — same rule, one level deeper.**
Sourcing a component's shapes/colors from the real WA kit isn't sufficient on its own if the
*states and axes* it exposes get silently added to or trimmed from along the way. This exact
pattern cost a full afternoon of retroactive fixes on 2026-09-08:

- **Radio, Switch, and Checkbox** had all quietly gained a `Hover` state this file's own
  Default/Hover/Disabled convention called for, but the real WA kit does not model (`Selected`/
  `Checked` × `Disabled` only) — had to be removed from all three, plus an undocumented duplicate
  legacy Radio component discovered along the way.
- **Tooltip** had been silently reduced from WA's real 12 `Placement` options (adding Start/End to
  each direction) down to 4, and was missing WA's `With Arrow` boolean entirely — had to be
  expanded back to all 12 plus the boolean.
- **Accordion** had `Icon Placement` hard-locked to `End`, dropping WA's real `Start` option —
  had to be added back.
- **Modal** was named and tagged inconsistently with WA's own `wa-dialog` naming — renamed to
  `Dialog` throughout.

None of these were correctness bugs in the traditional sense — every one of them "worked" and
looked reasonable in isolation. They were **undocumented, silent deviations from WA's own
variant/property model**, each one individually defensible ("this file already has a
Default/Hover/Disabled convention," "4 placements covers this reference's scope") but collectively
adding up to a component library that quietly drifted away from being an accurate WA mirror.

**Going forward, treat the real WA component's `componentPropertyDefinitions` as the default scope
for any component built or updated from it** — same variant axes, same option values, same
boolean/text properties, unless a deviation is a **flagged, explicit decision** (recorded in that
component's own section of this brief and, ideally, confirmed with the user first) rather than
something that happens quietly while solving a different problem. Concretely, before calling a
component "done" or "updated":
1. Re-import the real WA component fresh (`importComponentSetByKeyAsync`) and read its
   `componentPropertyDefinitions` — don't rely on memory or an old note in this brief, which can
   itself be stale (see the Radio/Switch color-drift findings from the same day, caught the same
   way).
2. Diff that property list against what's actually live in this file's version.
3. Every difference is either (a) something WA doesn't model that this file added on purpose (state
   it and why), or (b) something WA models that this file is deliberately not building yet (state
   it as a known limitation, don't just omit it silently).
4. See [FIGMA-WORKFLOW-NOTES.md §7](FIGMA-WORKFLOW-NOTES.md#7-checking-and-fixing-variant-model-drift-against-the-real-wa-kit) for the mechanical how-to (cloning
   variants, fixing the `combineAsVariants` malformed-name bug that tends to fire when doing this,
   etc.).

---

## Session token-efficiency rules

Lessons from a 2026-07-30 usage review (the Accordion build ran unexpectedly high on tokens even
though the chat had just been `/clear`ed — the cost was all live-session tool output, not stale
history):

- **Skip `get_libraries`.** See the library-keys block above — they're hardcoded now.
- **Always scope `search_design_system`** to the two `includeLibraryKeys` above.
- **Check the Variables reference tables below (Spacing/Radius/Height/Padding, and Color) before
  querying Figma directly.** Only call `figma.variables.getLocalVariablesAsync()` /
  `getLocalVariableCollectionsAsync()` for a token that's genuinely missing from those tables, and
  filter to the specific collection/name needed — never dump a whole collection. A full Color-
  collection dump during the Accordion build ran past 20KB and got truncated mid-response; that
  single call was likely the largest line item of the session.
- **Batch validation screenshots.** One combined `screenshot()` of a variant grid (or ComponentSet)
  beats one screenshot per individual variant — images cost meaningfully more tokens than text,
  and this adds up fast across an iterative build.
- **Not reducible:** the Figma MCP tool schemas and the mandatory `figma-use`/
  `figma-generate-library` skill docs load in full every time `use_figma` work starts, regardless
  of `/clear`. That's a fixed cost of this workflow, not something to optimize away.

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
| `blue/70` | `#49a4da` | Focus ring / dark-mode brand (no longer the light-mode link) |
| `blue/link` | `#237db1` | Link text, accent button (`$brand-link-blue`, 4.5:1) |
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

### Variables (counts below are from 07-30; Color is now 76 — see note)

**Primitives collection** (`VariableCollectionId:1:2`, mode `1:0`)
- 42 COLOR variables, all `scopes=[]` (hidden from pickers), WA CSS var code syntax
- Includes all blue, red, orange, green, gray tints plus accent colors and surface primitives

**Color collection** (`VariableCollectionId:2:2`, Light mode `2:0`, Dark mode `2:1`)
- 53 semantic COLOR variables aliased to Primitives
- Targeted scopes: backgrounds = `FRAME_FILL/SHAPE_FILL`, text = `TEXT_FILL`, borders = `STROKE_COLOR`
- Key semantic tokens:

**Color collection now has 76 tokens (verified live 2026-10-05) — the tables below cover the
original 53.** Checked by code-syntax name against the RestaurantUI `--boss-color-*` export: every code
role exists in Figma and every Light value matches. The 23 added since 07-30, not in the tables:
- Status hover/disabled: `color/bg/{danger,success,warning}/subtle-hover` (red/90, green/90,
  orange/90), `color/bg/danger/disabled` (red/90)
- Component roles: `color/text/label`, `color/border/select` + `select-disabled`, `color/bg/option-hover`
  (surface/table-header), `color/text/combobox-disabled`, `color/bg/tooltip` (gray/tooltip-bg),
  `color/bg/input/{resting,disabled}`, `color/bg/tag/{resting,disabled}`
- Button (`678:x`/`683:x`): `color/{bg,border,text}/button/brand-*`, `brand-accent-{default,hover,disabled}`
  (blue/link family), `color/bg/button/brand-subtle-hover`, `color/text/button/on-fill`

17 of these had `ALL_SCOPES`; set to the collection's convention 2026-10-05 (bg → frame/shape fill,
text → text fill, border → stroke). **Open (Dark mode only — code has no dark theme to copy):**
`color/bg/input/*` and `color/bg/tag/*` Dark are raw `#ffffff`, not aliases — placeholders; and the
status `subtle-hover` tokens alias light tints (red/90 etc.) in Dark while their `subtle` siblings use
gray/10. Needs a design decision.

**Full semantic Color token reference** (verified live 2026-07-30 — supersedes any earlier partial
table). "Light"/"Dark" columns name the **Primitives** variable each mode aliases to, not raw hex —
look up the primitive in the Primitives list below if you need the actual value.

*Surface*

| Token | Light | Dark |
|---|---|---|
| `color/surface/default` | white | black/spec-dark |
| `color/surface/secondary` | gray/95 | gray/10 |
| `color/surface/drawer` | surface/drawer | gray/10 |
| `color/surface/table-header` | surface/table-header | gray/10 |
| `color/surface/table-hover` | surface/table-hover | gray/30 |
| `color/surface/row-active` | surface/row-active | gray/30 |

*Background*

| Token | Light | Dark |
|---|---|---|
| `color/bg/brand/default` | blue/50 | blue/50 |
| `color/bg/brand/hover` | blue/30 | blue/70 |
| `color/bg/brand/subtle` | blue/95 | gray/10 |
| `color/bg/brand/subtle-hover` | blue/90 | gray/30 |
| `color/bg/danger/default` | red/50 | red/50 |
| `color/bg/danger/hover` | red/40 | red/40 |
| `color/bg/danger/subtle` | red/90 | gray/10 |
| `color/bg/success/default` | green/50 | green/50 |
| `color/bg/success/hover` | green/40 | green/40 |
| `color/bg/success/subtle` | green/90 | gray/10 |
| `color/bg/warning/default` | orange/50 | orange/50 |
| `color/bg/warning/hover` | orange/40 | orange/40 |
| `color/bg/warning/subtle` | orange/95 | gray/10 |
| `color/bg/neutral/default` | gray/10 | gray/40 |
| `color/bg/neutral/hover` | gray/30 | gray/50 |
| `color/bg/neutral/subtle` | gray/95 | gray/10 |
| `color/bg/control/checked` | orange/50 | orange/50 |
| `color/bg/neutral/subtle-hover` | gray/90 | gray/30 |
| `color/bg/disabled` | gray/80 | gray/40 |
| `color/bg/option-hover` | gray/option-hover | gray/30 |

*Text*

| Token | Light | Dark |
|---|---|---|
| `color/text/primary` | gray/10 | white |
| `color/text/secondary` | gray/50 | gray/70 |
| `color/text/on-filled` | white | white |
| `color/text/on-disabled` | gray/60 | gray/60 |
| `color/text/disabled` | gray/60 | gray/60 |
| `color/text/brand` | blue/50 | blue/70 |
| `color/text/link` | blue/link | blue/70 |
| `color/text/danger` | red/50 | red/90 ⚠️ |
| `color/text/success` | green/50 | green/90 |
| `color/text/warning` | orange/50 | orange/90 |
| `color/text/table-header` | gray/50 | gray/70 |
| `color/text/label` | gray/10 | white |

**Link color (verified live 2026-10-05):** `color/text/link` Light now aliases `blue/link`
(`#237db1`, `$brand-link-blue`, 4.5:1 on white) instead of `blue/70` (`#49a4da`, ~2.6:1), matching
RestaurantUI `--boss-color-text-link`. Already done in the file before this check (primitives
`4777:162–164`, not recorded here at the time). Same family drives the link-style button text:
`color/text/button/brand-accent-default|hover|disabled` → `blue/link|link-hover|link-disabled`
(Dark: `blue/70` / `blue/30` / `blue/button-disabled`). Button Accent appearance and Breadcrumb
labels confirmed bound to these. The 3 new primitives' scopes set to `[]` to match the rest of
Primitives. Note the RestaurantUI source is the `thorn/sidebar-wa-refresh` branch — re-check if
it changes before merging.

⚠️ `color/text/danger` (and `color/icon/danger` below) alias to `red/90` — a *light* tint — in Dark
mode. That looks like a bug (danger text should stay legible-strong in dark mode, not go pale) but
it's what's live in the file as of 2026-07-30. Flagging, not silently "fixing" — confirm with
design team before touching it.

*Border*

| Token | Light | Dark |
|---|---|---|
| `color/border/brand` | blue/50 | blue/70 |
| `color/border/danger` | red/50 | red/50 |
| `color/border/success` | green/50 | green/50 |
| `color/border/warning` | orange/50 | orange/50 |
| `color/border/neutral` | gray/border | gray/40 |
| `color/border/default` | gray/border | gray/30 |
| `color/border/disabled` | gray/80 | gray/40 |
| `color/border/focus` | blue/70 | blue/70 |
| `color/border/select` | gray/select-border | gray/40 |
| `color/border/select-disabled` | gray/select-disabled | gray/40 |
| `color/border/control/checked` | orange/50 | orange/50 |

*Icon*

| Token | Light | Dark |
|---|---|---|
| `color/icon/brand` | blue/50 | blue/70 |
| `color/icon/danger` | red/50 | red/90 ⚠️ (see note above) |
| `color/icon/success` | green/50 | green/90 |
| `color/icon/warning` | orange/50 | orange/90 |
| `color/icon/default` | gray/50 | gray/70 |
| `color/icon/on-filled` | white | white |
| `color/icon/disabled` | gray/60 | gray/60 |

**Primitives collection** quick name list (1 mode, `scopes=[]`, hidden from pickers) — look these up
by name in Figma if you need the exact hex: `blue/95`, `blue/90`, `blue/secondary-hover`,
`blue/light-bluish-grey`, `blue/70`, `blue/60`, `blue/50`, `blue/30`, `blue/link`, `blue/link-hover`,
`blue/link-disabled`, `red/90`, `red/50`, `red/40`,
`red/30`, `orange/95`, `orange/90`, `orange/70`, `orange/50`, `orange/40`, `green/90`, `green/50`,
`green/40`, `gray/95`, `gray/90`, `gray/border`, `gray/80`, `gray/70`, `gray/60`, `gray/50`,
`gray/40`, `gray/30`, `gray/10`, `white`, `black`, `black/spec-dark`, `surface/drawer`,
`surface/table`, `surface/table-header`, `surface/table-hover`, `surface/table-row-highlight`,
`surface/row-active`, `accent/highlight`, `accent/system-blue`, `accent/magenta`,
`gray/spec-dark`, `gray/select-border`, `gray/select-disabled`, `gray/option-hover`,
`gray/combobox-disabled`, `gray/tooltip-bg`, `gray/tag-resting`, `blue/button-disabled`.

**Spacing collection** (`VariableCollectionId:3:2`, mode `3:0`) — **control height/padding re-synced
2026-10-05** to RestaurantUI `_sizing.scss` (export from `thorn/sidebar-wa-refresh@a689fc70d03`). The
2026-07-30 "correction" recorded here had it backwards: it overwrote the correct code values
(m=32px height, 14px padding) with Figma's drifted ones. Fixed values: `height/control/m` 40→32,
`height/control/l` 48→50, `padding/control/s` 4→12, `padding/control/m` 8→14, `padding/control/l`
12→20. Each variable's description now cites its `sizing.$control-*` source.

Before the value change, every misuse of the padding variables as generic spacing was rebound,
value-neutral, so nothing else moved: `padding/control/s` (used as 4px gaps/padding) → `spacing/1`
on Listbox `124:2` main components, Select listbox, Combobox, Textarea, and Tabbing Focus
checkboxes; `padding/control/m` top/bottom on the Select `Input` frame (`365:130` etc.) and
Datepicker `4540:15005` → `spacing/2`. Left/right stay on `padding/control/m` (correct use, now
14px). **Rule going forward: `padding/control/*` is inline (left/right) padding of a control only —
never gaps or vertical padding; use `spacing/*` for those.** Visible effects: Radio Group / Radio
Button height 40→32 (bound to `height/control/m`); Select/Datepicker field text inset 8→14px.
Foundations height/padding labels updated to the new values and `--boss-control-*` names.

**Select height fixed same day (page `53:2`, sets `1258:149` Single / `1258:150` Multi).** Every
variant's `Input` field was a hardcoded 40px; now bound to `height/control/m` (32px) with 0
top/bottom padding and centered content (the WA pattern — a 26px Multi Select tag wouldn't fit
32px with 8px vertical padding). Variants switched from fixed 80px to hug height (80px after matching Input's padding, below).
Select has no Size axis — only `m` is modeled.

**Combobox, Button, Split Button, Dropdown Trigger fixed same day.** Every control in the file now
takes its height and inline padding from the control variables, with 0 vertical padding and
centered content:
- **Combobox** (`749:107`, 7 variants): field 40→32 (`height/control/m`), sides `padding/control/m`,
  plus 4px `spacing/1` outer padding to match Select/Input at 80px.
- **Button** (`3941:32`, 60), **Split Button** (`540:7`, 18 — both `main` and `caret` segments),
  **Dropdown Trigger** (`472:74`, 18): Small/Medium/Large heights were padding-driven 30/35/39px;
  now `height/control/s|m|l` = 32/32/50, sides `padding/control/s|m|l` = 12/14/20 (Split Button's
  caret keeps its 12px sides — code has no caret token). Split Button and Dropdown Trigger sets
  resized to fit (Large grew 11px). Dropdown Item (menu row, 30px) intentionally untouched.
- **Open:** button labels are 12/16/20px per size with no text style; code's `label-button` is
  14px/20px. Left as-is pending dev confirmation of per-size label sizes. Priscilla's standalone
  Datepicker field (`4540:15005`) is still 40px — left for her.

**Input height fixed same day (page `50:2`, set `210:72`, 6 State variants).** Same 40px
hardcoded field. Now: height → `height/control/m` (32px), left/right → `padding/control/m` (14px),
top/bottom 0, centered. Its padding had been bound to `Spacing/small` — a **remote** variable from
another library's "Semantics" collection, not this file's Spacing collection — now replaced with
local variables. Variants hug, 88→80px. Select variants then given the same 4px top/bottom
outer padding (`spacing/1`, as Input already used), so both are 80px overall with a 32px field.

| Category | Token | Value |
|---|---|---|
| Spacing | `spacing/1` | 4px |
| Spacing | `spacing/2` | 8px |
| Spacing | `spacing/3` | 12px |
| Spacing | `spacing/4` | 16px |
| Spacing | `spacing/5` | 20px |
| Spacing | `spacing/6` | 24px |
| Spacing | `spacing/8` | 32px |
| Spacing | `spacing/12` | 48px |
| Spacing | `spacing/16` | 64px |
| Spacing | `spacing/18` | 72px |
| Spacing | `spacing/32` | 128px |
| Radius | `radius/s` | 3px |
| Radius | `radius/m` | 4px |
| Radius | `radius/l` | 8px |
| Radius | `radius/xl` | 16px |
| Radius | `radius/full` | 9999px |
| Height | `height/control/xs` | 26px |
| Height | `height/control/s` | 32px |
| Height | `height/control/m` | 32px |
| Height | `height/control/l` | 50px |
| Height | `height/control/xl` | 64px |
| Padding | `padding/control/xs` | 8px |
| Padding | `padding/control/s` | 12px |
| Padding | `padding/control/m` | 14px |
| Padding | `padding/control/l` | 20px |
| Padding | `padding/control/xl` | 24px |

### Text styles (9 total)
All Roboto. Heading/1 (36px/42px Regular — was 34px, synced to code 2026-10-05), Heading/3 (20px/Medium), Subtitle/1 (16px/Medium), Subtitle/2 (14px/Medium), Body/1 (16px/Regular), Body/2 (14px/Regular), Label/Button (14px/Medium), Caption (12px/Regular), Column Header (12px/Medium).

**Typography sync (2026-10-05, verified live).** All 9 styles are bound to the `Typography`
variable collection. Checked against RestaurantUI `_text.scss` (`--boss-font-*`): 8 already matched
on size, line height, weight and letter spacing. Only Heading/1 differed — `font-size/2xl`
(`4740:174`, used by Heading/1 only) changed 34→36. Foundations page now has a **Typography**
section (`4887:162`, below Focus / Interaction States) with live-style specimens per row, spec,
`--boss-font-*` role and usage. The file also still carries ~25 legacy unbound styles (`h1`, `Body 1`,
`Small/Medium/Large Button`, icon styles…) from the old library — not touched, not part of the scale.

### Pages
- `0:1` Cover
- `5:2` Foundations — Colors documentation added 2026-07-17 (see Colors Foundations section below); Spacing documentation added 2026-07-21/22; Typography added 2026-10-05
- `5:3` --- (divider)
- `5:4` Button (Steve)
- `460:2` Split Button (Steve) — added 2026-07-13
- `468:2` Dropdown (Steve) — not previously logged in this brief; found during the 2026-07-22 Code Connect audit. "Dropdown Trigger" (ComponentSet `472:74`) was already built; "Dropdown Item" (new section, ComponentSet `3945:3188`) was built 2026-09-08 — see Dropdown component section below.
- `741:2` --- Atoms --- (divider) — added 2026-07-20, marks the start of the atomic-design-tier section
- `741:3` Radio (Steve) — added 2026-07-20
- `741:4` Switch (Steve) — added 2026-07-20
- `741:5` Tooltip (Steve) — added 2026-07-20
- `905:598` Alert (Steve) — not previously logged in this brief; found live in the file during the
  2026-07-30 Accordion build (`figma.root.children` fan-out check). 15 variants, Intent x Size.
- `934:6` Dialog (Steve) — not previously logged in this brief; found live in the file during the
  2026-07-30 Accordion build. Header/Footer boolean combos. **Renamed 2026-09-08** from "Modal
  (Steve)" (ComponentSet `934:427` renamed "Modal" → "Dialog") to match WebAwesome's own naming
  (`wa-dialog`) ahead of the Tabs/Toast/Popover build-order additions — see the Dialog page's own
  To-Do item 4 for the resolved `boss-dialog` tag-name note.
- `942:2` Floating Action Bar (Steve decisions keep and improve) — not previously logged in this brief; found live in
  the file during the 2026-07-30 Accordion build. Iteration 1 chosen and rebuilt from 0.1 components
  2026-10-06 — see Floating Action Bar component section below.
- `1142:2` Accordion (Steve) — added 2026-07-30, see Accordion component section below.
- `1617:2` Alert Banner (Steve) — added 2026-08-14, see Alert Banner component section below.
- `3900:2` Tabs (Steve) — added 2026-09-08, see Tab component section below.
- `4692:163` --- Base Components --- (divider, plus `4692:162` spacer) — added 2026-09-25, new page
  section placed between WOrK In Progress and To do.
- `4692:164` Popover (Steve) — added 2026-09-25, first page in the Base Components section, see
  Popover component section below.
- `4699:249` Card (Steve) — added 2026-09-25, second page in the Base Components section, see Card
  component section below.
- `4754:162` Radio Group (Steve) — added 2026-09-29, third page in the Base Components section, see
  Radio Group component section below.
- `5012:162` File Upload (Steve) — added 2026-10-07, placed right after Radio Group, which now sits in
  the "--- Ready to be Picked Up ---" section (not Base Components). See File Upload component section below.
- `5027:162` BOSS Table (Steve) — added 2026-10-07 in the "--- WOrK In Progress ---" section. See BOSS
  Table component section below.
- **Archived 2026-10-07 (user decision):** `1483:112` "Reporting Table (Chance) [Archived]" (moved from
  the WIP section to the end of the Archive section) and `3101:5065` "Data Grid (Priscilla's Experiment)
  [Archived]" (already in the Archive section, renamed). BOSS Table replaces both. Note: BOSS Table's Report
  size is still built from instances of the Reporting Table components, so they live on an archived page
  but must not be deleted until they are merged into BOSS Table's own building blocks.

**Note (2026-07-30):** the three pages above (Alert, Modal — renamed Dialog 2026-09-08, Floating
Action Bar) exist and are
built out in the live file but were absent from this brief's page list — same drift pattern as the
Split Button ID correction on 2026-07-22. `get_metadata` with no `nodeId` also under-reported the
page list (returned only Cover); `figma.root.children` via `use_figma` was the source that actually
matched the file. Prefer that method over `get_metadata`'s bare page listing when auditing this file.

### Button component (page `5:4` "Button (Steve)", ComponentSet ID `3941:32`)
**ID corrected 2026-10-06:** this heading previously said `455:92`, which no longer resolves. The live
Button ComponentSet is `3941:32` (60 variants: Variant × Appearance × Size × State, plus Leading/Trailing
Icon + Glyph properties), confirmed via an Iteration 2 FAB instance's `mainComponent.parent`.
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

**Audited 2026-09-08 against the real WA Button, as part of a sweep of every remaining `(Steve)`
page.** This file's own To-Do already correctly flagged the gap ("No Active state or Pill property
built yet, though WebAwesome's own kit defines both") — confirmed still accurate via a fresh
import (componentKey `c7a5004eda26694c66b513124bc9169525434547`, 600 real variants: `Variant`
Brand/Success/Warning/Danger/Neutral × `Appearance` Accent/Filled-Outlined/Filled/Outlined/Plain ×
`Size` × `Pill` × `State` Default/Hover/**Active**/Disabled, plus Label/icon-slot/Focused
properties). Per explicit direction, added **just** the `Active` state — now 60 variants (was 45).

**Color decision for Active, confirmed with the user first:** the real WA kit derives Active
mathematically from Default (a 20%-black overlay vs Hover's 10%) — verified directly by comparing
`Background` frame paint stacks between WA's real Hover and Active variants across all 5
Brand/Danger×Appearance combos (identical base colors, only the black-overlay opacity differs:
10%→20%). Replicating that exact math would require a new primitive darker than `blue/30`, which
this file's own palette doesn't have (`blue/30` is already documented as serving double duty for
"Hover / pressed"). Rather than invent a new tint, Active reuses Hover's exact resolved colors —
confirmed with the user before building, not assumed.

**Built by cloning the 15 Hover variants** (one per Variant×Appearance×Size combo) and renaming to
`State=Active` — no new colors needed given the decision above. Hit the same
`combineAsVariants`-mangles-previously-grouped-variants bug as Tooltip/Accordion when recombining;
fixed by identifying each of the 45 original variants via structural fingerprint (bound
fill/stroke/label variable names + width + opacity), not by trusting an assumed array order — an
initial attempt at positional-order fixing produced wrong names silently and had to be redone.
Also caught, while updating this page's own doc text: a genuinely new gap, not previously flagged
— this file's `Appearance` axis is missing WA's real `Filled-Outlined` option. Not built (out of
scope for this pass), logged as a new item in the page's own To-Do.

**Pre-existing issue found, not caused by this update:** the Button ComponentSet was already
overlapping its own "Button / Documentation" section before this session touched anything (captured
its pre-edit position/size and confirmed the original 411×1019 box already exceeded the
Documentation section's bounds at the same origin). Left alone — out of scope for this audit, and
not a regression.

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

**Audited 2026-09-08 as part of the `(Steve)`-page sweep — no real WA equivalent exists to audit
against.** WA's real kit has no "Split Button" component (`search_design_system` returns only
`Button` and an unrelated `Cluster` layout primitive for that query); this is a genuine BOSS-
original composite, already documented as such above. No changes made to the component.

**Stale To-Do item found and corrected 2026-09-08** (during a pass checking every page's To-Do
list for staleness): item 2 claimed the caret icon was "a hand-built vector chevron... not the real
Font Awesome 7 Pro glyph." Confirmed via direct node inspection that this is no longer true — the
caret is already a real `Font Awesome 7 Pro` Solid glyph. This matches what this section's own
history above already says (the caret was swapped for the real glyph when the component moved to
its current ComponentSet, `540:7`, "FA chevron-down") — the on-canvas To-Do just never got updated
after that fix shipped. Marked resolved on the page itself.

---

### Dropdown component (page `468:2` "Dropdown (Steve)")

**Dropdown Trigger** (ComponentSet `472:74`) was already built (see the 2026-07-22 Code Connect
audit section below) — audited 2026-09-08, no real standalone WA equivalent to diff against (WA's
"Dropdown" is a single, non-configurable component that's actually a composed *example* menu, not
a trigger-button variant set; the trigger itself is conceptually just Button-with-caret, which
inherits Button's own audit findings above). No changes made to Dropdown Trigger.

**Dropdown Item — built 2026-09-08** (new page section "Dropdown Item", ComponentSet `3945:3188`),
closing the gap this brief had flagged since 2026-07-22 ('"Dropdown Item" is documented in text but
was never built as an actual Figma component'). Sourced from the real WA Dropdown Item
(componentKey `7f2e2e8f4837cf7bfb701667c9b08397d5c1a5e6`): horizontal auto-layout row, 16px
horizontal / 8px vertical padding (`spacing/4`/`spacing/2`), 8px gap (`spacing/2`), `radius/s`
(3px) corners, matching WA's real geometry exactly. **6 variants** = `Variant` (Default/Danger) ×
`State` (Default/Hover/Disabled) — `State` is this file's own established convention (Radio/
Switch/Accordion/Tab/Dropdown Trigger precedent) layered on top of WA's real `Disabled` axis, same
pattern as everywhere else. Plus WA's real boolean/text properties: `Label`, `Details`, `Checked`,
`With Submenu`, `With Details`, `With Icon`, `Checkbox` — all present, matching WA's property
surface. Leading icon, checkbox glyph, and submenu chevron are plain Font Awesome text glyphs
(`gear`/`check`/`chevron-right` as defaults), not INSTANCE_SWAP — matches this file's established
icon convention (Badge/Tag/Tab), not a gap.

**Course-corrected mid-build after finding this page already had a detailed, research-backed spec
for this exact component that generic WA sourcing alone didn't match.** This page's own
Documentation text (written before Dropdown Item existed as a component) already specified real
colors from the live style guide: hover should use the same blue family tint as Trigger/Split
Button/Button's Outlined hover (`#c8cfe3`), not a generic gray option-hover. The first build pass
used `color/bg/option-hover` (this file's generic dropdown/select hover token) and Roboto Regular
labels — both wrong against this page's own spec. Fixed to `color/bg/button/brand-subtle-hover`
(the bound token resolving to that same `#c8cfe3`, keeping "one consistent hover color across the
whole family" as the spec requires) and Roboto Medium labels (matching "bold label" in the spec).
**Lesson, not just a fix:** should have read this page's existing Documentation text before
building from WA structure alone — the "inspect before creating, match existing conventions" rule
applies to a single page's prior research notes just as much as to the whole file's token system.

**Known simplification, not full parity:** `Checked` exists as a real property but doesn't yet
visually distinguish from unchecked (the checkbox glyph is a static checkmark, not swapped based on
`Checked`'s value) — flagged on the page's own To-Do, not silently overclaimed. Danger variant
allows `With Details`/`With Submenu`/`With Icon` to be toggled even though the live style guide's
own example only shows Danger as a single-line label — matches WA's own unrestricted property
model rather than hand-locking Danger down further; flagged for design team if BO wants it
restricted.

**Layout bug found and fixed while updating this page's own documentation text (unrelated to
Dropdown Item's structure, but caught in the process):** the Dropdown page's `desc`/`body` text
nodes have `textAutoResize='NONE'` (a fixed-size box), unlike most other pages in this file which
use `'HEIGHT'` (auto-grows). Appending text left `.height` completely unchanged, so a
position/resize calculation based on that stale height concluded no fix was needed when the text
was actually badly overlapping/clipped — caught only by opening the actual rendered screenshot, not
by trusting reported dimensions. Fixed by forcing `textAutoResize='HEIGHT'` first to get the true
height, then repositioning; the resulting growth cascaded into the To-Do section below it and (in
turn) the new Dropdown Item section below *that*, requiring all three to be repositioned in
sequence. Documented as a new gotcha in `FIGMA-WORKFLOW-NOTES.md` §2.

**Dropdown Trigger updated 2026-10-06 — Plain appearance + leading icon** (driven by the Floating
Action Bar rebuild below, which needed both). Now **27 variants** = `Appearance` (Filled / Outlined /
**Plain**) × `Size` × `State`. The 9 Plain variants were cloned from Outlined and restyled to match
Button's own Plain variants token-for-token: no stroke, `color/bg/button/brand-subtle-hover` fill on
Hover, `color/text/button/brand-default` / `brand-disabled` on label + caret. New properties
**`Leading Icon`** (BOOLEAN, default `false`) and **`Leading Icon Glyph`** (TEXT, default `star`):
the same names as Button's, rendered as a Font Awesome 7 Pro text glyph (`leading-icon`) at the label's
font size and color, before the label on all 27 variants. Default off so every existing instance
renders unchanged. Preview frame "Dropdown Trigger — Leading Icon examples" (`4930:13023`) sits right
of the set. **Filled/Outlined tokenized the same day:** all 18 were bound to the same tokens as their Button
counterparts (fills, strokes, label, caret, icon). Default/Hover were already the exact token values.
The 6 Disabled variants changed color: they had used base brand `#23408f` at 60% opacity, and now use
`color/*/button/brand-disabled` at 60% opacity, matching Button exactly. Plain Disabled was aligned to
the same 60% opacity.

---

### Floating Action Bar component (page `942:2`, v0.1 rebuild section `4929:523`)
**Iteration 1 chosen and rebuilt from 0.1 components 2026-10-06.** The page holds three earlier
iterations (1: plain icon+label `Action Item` rows, component `942:6`; 2: button-group, `952:45`;
3: card, `952:65`) plus old-library reference instances. All are left as-is. The new section
"Iteration 1 — v0.1 rebuild (Button | Dropdown actions)" holds:
- **`FAB Action`** (ComponentSet `4929:540`) is the slot component. `Type` = `Button` (nested 0.1 Button
  `3941:32`, Small/**Plain**, leading icon) or `Dropdown` (nested Dropdown Trigger `472:74`,
  Small/**Plain**). The nested instance is exposed (`isExposedInstance`), so Appearance/State/glyph/label
  are editable from the bar. Dropdown = Dropdown Trigger, not the form Select. That was the user's call
  (2026-10-06): action menus like the old FAB's "More Actions ▾", not value-picking fields.
- **`Floating Action Bar`** (Component `4929:542`) uses Iteration 1's shell and tokens unchanged:
  `color/surface/default`, `radius/m`, `Elevation/Overlay`, `spacing/4` padding, `spacing/6` between
  groups, `spacing/2` within groups, vertical Divider `601:8`. Properties: `Count Label`,
  `Show Secondary Actions`, `Show Primary Actions` (each hides its group + preceding divider). It has 3
  secondary + 2 primary FAB Action slots. Default: Export, Duplicate (Buttons), Move to (Dropdown,
  `folder-open` icon) | More Actions (Dropdown), Approve (Button).
- **All actions Plain, with no Filled primary button (user decision, 2026-10-06).** The bar floats
  over table content, so the actions stay quiet and the selection count leads. This replaced the
  first-pass Outlined slots with one Filled "Approve". *Gotcha hit while switching:* changing the
  nested instance's `Appearance` (a variant swap) reset every slot's label and icon overrides on the
  bar and its instances. They were restored explicitly. `findOne` also skips the children of a
  group hidden by a boolean property, so the slots in a hidden group need separate handling.
- Examples (buttons only / mixed / primary-only with 12 selected), a doc frame and a To-Do frame.
- To-Do still open: fixed slot count (5); old
  FAB's Metric Group / No Actions Available props not modeled; tag name (`boss-floating-action-bar`
  vs `boss-action-bar`) undecided. No WA equivalent exists (audited 2026-09-08).

---

### Accordion component (page `1142:2` "Accordion (Steve)", ComponentSet ID `1154:512`)
**Added 2026-07-30.** A single collapsible disclosure item. Real tag: `wa-details` — checked
`get_libraries` FIRST per this brief's standing rule (see "Real WebAwesome Figma library" section
above); the Back Office Design Library and BOSS_PD.md have no accordion/details spec of their own,
so this is the one BOSS component built directly from the real WebAwesome kit (file/library key
`lk-46ccc9e51e4a78ca22bcd7c54d570a2abcb180a86...` , component key `f13440c5b3bf248f65b6254aabd97799e6c26f64`)
rather than from a resolved Design Library + BOSS_PD.md spec. Two throwaway reference instances of
the real WA `Details` component were imported onto the page to study structure before building —
relocated to a labeled "Reference only" area at x=1400 rather than deleted, per the standing
never-delete-existing-nodes rule.

**12 variants** (was 6 before 2026-09-08, see update below) = Open (`False`/`True`) × State
(`Default`/`Hover`/`Disabled`) × IconPlacement (`Start`/`End`), combined into one ComponentSet
named `Accordion` (ID `3929:75` as of the rebuild — was `1154:512`).

- **Open axis:** `False` (header only) | `True` (header + Body content panel).
- **State axis:** `Default` | `Hover` | `Disabled` — matches the Radio/Switch/Tooltip convention
  (no `Active`, same as Button's resolved reasoning: not defined in the library).
- **IconPlacement axis (added 2026-09-08):** `Start` | `End` — matches WA's own real axis exactly.
  `End` (chevron after the label) was the only option before this update; `Start` moves the chevron
  before the label in the Header row.
- **Still reduced from WA:** the real WebAwesome `Details` ComponentSet has 32 variants (`Open` ×
  `Icon Placement` [Start/End] × `Appearance` [Outlined/Filled-outlined/Filled/Plain] × `Disabled`).
  BOSS now covers the full `Icon Placement` axis but still keeps only the bordered `Appearance` —
  see Known Limitations below.

**Updated 2026-09-08: added Icon Placement (Start/End)**, per explicit direction to match
WebAwesome exactly. Built the 6 `Start` variants by cloning the existing 6 (now-`End`) variants and
reordering the Header row's children (`insertChild(0, chevron)` to move the chevron before the
Label) — no other changes needed, since the Label already used `layoutSizingHorizontal='FILL'` and
the Header's `itemSpacing`/padding apply the same regardless of child order. Hit the same two
Tooltip-rebuild bugs on recombining all 12: `combineAsVariants` mangled the 6 *original* variants'
names (fixed by renaming back, per `FIGMA-WORKFLOW-NOTES.md` §2) and the ComponentSet grew tall
enough to overlap the page's own To-Do frame below it (caught via a page-layout check, not a
screenshot, and fixed by repositioning To-Do below the new taller grid).

**Structure:** vertical auto-layout panel, `color/surface/default` fill, 1px `color/border/default`
stroke, `radius/l` (8px) corners — this radius choice came from the Dialog component's own resolved
panel convention (`--wa-border-radius-l,8px`) in this same file, not from WA's raw Details value
(12px), since Dialog is the closer in-file precedent for a bordered/panel container. Header row:
horizontal auto-layout, `spacing/4` (16px) padding + gap, `Subtitle/1` label text
(`color/text/primary`), Font Awesome 7 Pro Solid chevron icon (`color/icon/default`,
16px/"Med Solid Icon" style) — `chevron-right` (U+F054) when closed, `chevron-down` (U+F078) when
open. Body panel (Open=True only): `spacing/4` padding, `Body/1` content text
(`color/text/secondary`, matching Dialog's body-message convention rather than WA's own
text-normal). Hover fills the header row with `color/bg/neutral/subtle-hover`. Disabled uses
component-level `opacity=0.6` on the Default look — same convention as Button/Split Button, not
distinct disabled tokens.

**Component properties:** `Label` (TEXT, default "Accordion Item") bound on all 12 variants;
`Content` (TEXT, default placeholder copy) bound on the 6 `Open=True` variants only — mirrors the
editable-instance pattern already used on Alert's `Message` property. Both properties' bindings
carried over automatically through the clone-and-reorder process used to add IconPlacement.

**Known limitations (see page's own To-Do section for detail):**
1. **Resolved 2026-09-08 (Icon Placement):** Appearance axis is still reduced to bordered-only —
   WA's Filled/Filled-outlined/Plain appearances were dropped since nothing in this file or
   BOSS_PD.md calls for them, and remain out of scope. Flag design team if needed.
2. No live bepbackoffice.com style-guide page for Accordion was found or confirmed reachable this
   session (unlike Dropdown/Split Button, which had a captured live HTML reference) — this build
   leans on the WA kit + this file's own Dialog/Alert conventions only. Verify against the live app
   before dev handoff.
3. Only a single collapsible item is modeled — a multi-item "Accordion Group" wrapper (matching
   WA's own scope split) was not built.

---

### Alert Banner component (page `1617:2` "Alert Banner (Steve)", ComponentSet ID `1621:156`)
**Added 2026-08-14.** A slim, full-width, single-line notice bar — icon + message + optional
inline action link — distinct from the card-style "Alert" component already on the `Alert
(Steve)` page (`910:77`, Title/Message/Close pattern).

**5 variants** = `Intent` (Brand/Success/Warning/Danger/Neutral), combined into one ComponentSet
named `Alert Banner`.

**Source:** the old Back Office Design Library actually has *three* distinct "Alert"-family
components, discovered via `search_design_system` scoped to both project libraries:
1. **Alert** (componentKey `a11fdcace6d19b459d4158f2bf5ccce0b7483525`, older) — the 993px-wide
   Title/Message/Action/Close card, already ported into this file as `925:16`.
2. **Alert** (componentKey `6f131d438f0bfd828865a1edffb65477c84e9e97`, newest) — turned out to be
   an unrelated small notification-dot/badge indicator (`Alert Type`: Medium/High/Number
   High/Number Medium/Alert Dot × `Size`: Large/Small) — confirmed by importing and screenshotting
   it, not assumed from the name. Not relevant to this build.
3. **Alert Banner** (componentKey `7caad3eba09b8f4e85e88b02f65a6f4ac04ca058`) — the real source for
   this component: a slim single-line bar (icon + "Warning Text." + inline blue "Action Link."),
   `Property 1` (Alert Banner - Non Rounded/Rounded) × `Property 2` (Medium/High/Success). Imported
   and screenshotted to confirm before building — see reference instances left on this page's
   `Reference only` area (x=1400) per the standing never-delete-existing-nodes convention (same
   pattern as the Accordion build's reference instances).

Also imported and inspected the real WebAwesome **Callout** component (`wa-callout`, componentKey
`f2aa406ca85264e4b0aaa4fcc75696256fb9fd82`) as the closest WA atom — WA has no component named
"Alert" or "Banner". Inspecting its node tree directly (not just the screenshot) confirmed its
"circular icon badge" look is baked into the Font Awesome glyph itself (e.g. `circle-info` already
contains a circle) — there is no separate wrapping shape. This meant the existing compact Alert
component's icon convention (plain Font Awesome glyph text, no wrapper) already matched the real
WA structure; no new icon pattern was introduced.

**Decisions locked with the user before building (2026-08-14), since the old library source
conflicted with this file's own established Alert conventions:**
- **Color scope:** extended from the old library's 3 severities (Warning/Danger/Success) to all 5
  semantic intents (Brand/Success/Warning/Danger/Neutral) — matches the compact Alert component and
  the project brief's locked build-order note ("Alert / Banner — uses all 5 semantic colors").
- **Corner radius:** the old library's Rounded/Non-Rounded variant axis was dropped in favor of a
  single fixed value. Initially set to `0` (flush/non-rounded), matching the old library's own
  default variant and the typical top-of-page/banner placement — **updated 2026-08-18 to `4px`**
  per user request across all 5 variants. Deliberately **not** bound to a radius token — no
  4px-specific radius token exists in this file's Spacing collection, so this remains an
  intentional fixed-geometry value, not an oversight.
- **Icon treatment:** flat single-color Font Awesome glyph (no wrapper), reusing the compact
  Alert's exact glyphs and `color/icon/*` tokens for consistency: `circle-info` (Brand),
  `circle-check` (Success), `triangle-exclamation` (Warning), `circle-exclamation` (Danger),
  `gear` (Neutral, using `color/icon/default` — no dedicated `color/icon/neutral` token exists).

**Structure:** horizontal auto-layout, `spacing/2` (8px) gap and vertical padding, `spacing/4`
(16px) horizontal padding, background `color/bg/{intent}/subtle` (same subtle tone as the compact
Alert, for family consistency). Message text uses `Body/2` style + `color/text/primary`. Action
link text uses the file's own `Link` text style + `color/text/link` (`blue/70`) — kept the same
link color regardless of severity, matching the old library reference (all three severities showed
the same blue action link).

**Component properties:** `Show Icon` (BOOLEAN, default true), `Message` (TEXT, default "Alert
message text."), `Show Action` (BOOLEAN, default **false**), `Action Text` (TEXT, default "Action
Link.") — added for instance editability; the old library source had no exposed properties at all
(static text only). Wired via the Badge-established pattern: minted once via `addComponentProperty`
on the `ComponentSetNode` after combining, then `componentPropertyReferences` set per-variant child
— not re-minted per variant. Verified with a test instance toggling `Show Action` to `true`.

**Updated same day (2026-08-14):** added an optional `Title` line per user request, mirroring the
old system's card-style Alert (`925:16`), which stacks a Medium-weight Title above a Regular-weight
Message. New properties: `Show Title` (BOOLEAN) + `Title Text` (TEXT, default "Title") — `Title`
uses `Subtitle/2` (14px Medium) vs `Message`'s `Body/2` (14px Regular), same color
(`color/text/primary`) as the card Alert's Title/Message pair, one step down in scale to match this
component's slimmer banner footprint. Structurally, `Message` + `Action` were re-parented into a
new `Message Row` (horizontal) inside a new `Copy` (vertical) wrapper alongside `Title`. Both new
wrapper frames needed `fills = []` set explicitly — `figma.createAutoLayout()` defaults to an
opaque white fill (a gotcha already documented in `FIGMA-WORKFLOW-NOTES.md` §6 from the Badge
build) — caught via screenshot verification before shipping, not left in.

**`Show Title` default flipped to `true` same day**, per follow-up user request — the two-line
Title + Message look is now the default across all 5 variants (verified via screenshot; icon
recenters correctly against the taller stack). Toggle off per-instance for the original
single-line look.

**Added `Show Close` same day**, per user feedback that both Title and Close were clearly present
in the old card-style Alert (`925:16` — `Show close` boolean + a `"close"` Font Awesome glyph) and
should have been carried over from the start, not just Title. New property: `Show Close` (BOOLEAN,
default **true** — matching parity with the old card Alert's own default and with `Show Title`).
Close icon reuses the same `"close"` Font Awesome 7 Pro glyph name as the old card Alert (renders
as an X), but at this component's own Solid-weight/16px (`Med Solid Icon`) convention rather than
the old card Alert's Regular/22px — kept internally consistent with Alert Banner's own leading
icon rather than matching the card Alert 1:1. Fill bound to `color/text/primary` (severity-
independent, matching the card Alert precedent). Positioned as the third row child, top-aligned via
a per-child `layoutAlign` override so it doesn't follow the row's own center-aligned leading icon.
Hit one bug along the way: setting `Copy`'s `layoutSizingHorizontal` to `FILL` (intending to push
Close to the far right once the banner is stretched full-width) clipped the Message text, because
`FILL` inside a HUG-width base component has no real space to fill — reverted `Copy` to `HUG`;
FILL should be set on real page instances instead, not baked into the base variant. Verified both
`Show Close=true` (default) and `=false` via test instances before removing them.

**Re-positioned same day, per follow-up user request:** Close needed to stay fixed at the banner's
top-right corner regardless of resizing, not drift based on sibling flow width (the FILL-vs-HUG
fix above only solved clipping, not this). Switched Close to `layoutPositioning = 'ABSOLUTE'` with
`constraints = { horizontal: 'MAX', vertical: 'MIN' }` — the same escape-auto-layout-flow pattern
already documented in `FIGMA-WORKFLOW-NOTES.md` §2 for Textarea's resize-grip and Checkbox's focus
ring. `Copy`'s reserved space for Close was moved into the root row's own `paddingRight` (now `16 +
close.width(12) + 8` gap = `36px`, a deliberate composite value, not bound to a single spacing
token) so Title/Message/Action never render underneath the now-absolutely-positioned icon. Verified
by resizing a test instance to `500px` wide — Close tracked to stay `16px` from the new right edge
instead of following the text flow.

**Known limitations:**
1. No direct WebAwesome tag maps to "banner" as its own component — the closest real primitive is
   `wa-callout`. Real dev-facing tag/prop mapping for this BOSS component is unconfirmed — flag
   before dev handoff / Code Connect.
2. Not yet published or Code Connect–mapped.
3. Default variant width hugs content (178px at default text) rather than the old library's fixed
   613px — matches this file's existing atom/molecule convention (compact Alert also hugs content);
   intended to be set to `FILL` width when instanced into a real page layout.

**Audited 2026-09-08 as part of the `(Steve)`-page sweep — no real WA equivalent to diff against**
(confirmed above: closest is `wa-callout`, already documented as structurally incompatible — WA
Callout uses `Variant`×`Appearance`×`Size` with INSTANCE_SWAP content, nothing like this
component's Title/Message/Action/Close pattern). **Documentation drift found and corrected while
auditing, unrelated to WA:** the live component actually has 10 variants — `Intent` × `Appearance`
(`Filled`/`Outlined`), confirmed directly via `compSet.children` — not the 5 (`Intent` only)
documented above and throughout this section. This wasn't caught until this pass; the `Appearance`
axis was apparently added to the live file at some point after this write-up without an update here
— same drift pattern this brief has hit before (Split Button's ID, Alert/Modal/Floating Action
Bar's undocumented existence). Not investigating further or changing the component itself (out of
scope for this pass) — flagging the discrepancy so the "5 variants, Intent only" language elsewhere
in this section is understood as stale, not currently accurate.

**Compact "Alert" component (page `905:598`, two ComponentSets `910:77` and `925:16`) and
"Floating Action Bar" (page `942:2`) also audited 2026-09-08 — no real WA equivalent for either.**
Alert: same `wa-callout` mismatch as Alert Banner above. Floating Action Bar: no matching WA
component exists at all (`search_design_system` for the term returns nothing relevant). No changes
made to either component.

**Stale To-Do item found and corrected on Floating Action Bar** while checking every page's To-Do
list for staleness: item 7 flagged that Modal (now Dialog) needed the same `spacing/N`-resolves-to-
`N×4px` fix applied to it and said to "revisit and fix Modal's spacing bindings for consistency."
That's already done — Dialog's own To-Do independently records the identical fix as completed on
2026-07-28, the same day this note was written on Floating Action Bar's page, just never
cross-referenced back. Marked resolved on the page itself.

---

### Tab component (page `3900:2` "Tabs (Steve)", ComponentSet ID `3904:183`)
**Added 2026-09-08.** Three pieces, matching WebAwesome's own three-part split: **Tab**
(ComponentSet `3904:183`, WA: `wa-tab`), **Tab Panel** (Component `3904:186`, WA:
`wa-tab-panel`), and **Tab Group** (Component `3904:203`, WA: `wa-tab-group`) — a composed
example, not its own variant set (same scope decision as Accordion's Group wrapper).

**Source:** checked `search_design_system` scoped to both project libraries first, per this
brief's standing rule. Two real candidates existed for Tab/Tab Group:
1. **Real WebAwesome kit** — `Tab` (componentKey `f29bf46e55895a85d1d3bf4505e0cfa8e6e34a66`, 3
   variants: `Active=False/Disabled=False`, `Active=True/Disabled=False`,
   `Active=False/Disabled=True` — no Active+Disabled combo modeled) and `Tab Group` (componentKey
   `716807692bb148b7148c1d2807f30bc782a6abc0`, `Placement` [Top/Bottom/Start/End] ×
   `Scrolling` [False/True]).
2. **Old Back Office Design Library** — a full BO-specific system: `tab group` (componentKey
   `40119ee6012c39d43b4b160c63e06f7eb8c37bdb`, real `Show Left Scroll`/`Show Right Scroll`
   booleans + `Group Type` [Standard/Closeable]), `Tab Elements` (componentKey
   `961065637de5f635bd8ce079f7b440f16ac165f7`, the per-tab atom, `Tab State`
   [Active/Inactive] × `Icon` boolean), and `Tab Line` (a decorative line-extension component).

Both were imported and screenshotted (reference instances kept in a "Reference only" frame on this
page, `3907:160`, per the standing never-delete-existing-nodes convention). **No dedicated
`Tab Panel`/panel component exists in either library** — confirmed absent via search before
hand-building it, per this brief's standing rule.

**Fixed 2026-09-08 (same day):** the reference area was originally built as a Figma `SECTION`
(`3900:3`) with children positioned by setting `x`/`y` *before* `appendChild` — this produced a
broken export (a `get_screenshot` of the section returned a bounding box stretched back to the
page origin, and two of the five imports visually overlapped on canvas). Rebuilt as a plain
vertical auto-layout frame instead, with each import in its own captioned `label + instance` row
(auto-layout handles spacing, no manual `x`/`y`) — matches the append-before-position rule already
documented for other absolute-positioned children in this file (see
`FIGMA-WORKFLOW-NOTES.md` §2). Re-verified clean with a screenshot before moving on.

**Decision:** built the `Tab` atom's variant axes and default color treatment from the **real WA
kit** (Active × State, State replacing WA's plain `Disabled` boolean to reuse this file's own
Default/Hover/Disabled convention already established on Radio/Switch/Accordion/Dialog — Hover is
synthesized, same as those). Did **not** port the old BO library's scroll-affordance or
Closeable-tab behavior, or its raw active-tab color — see Known Limitations below for why each was
left out rather than silently guessed.

**Structure — Tab:** horizontal auto-layout, `spacing/4` (16px) horizontal / `spacing/3` (12px)
vertical padding, `Subtitle/2` label text. Inactive default: `color/text/secondary`. Hover:
`color/bg/neutral/subtle-hover` fill on the tab itself (reused directly from Accordion's header
hover treatment). Disabled: component-level `opacity=0.6` (same convention as
Button/Split Button/Accordion/Dialog). Active: `color/text/brand` label + a 2px bottom
`color/border/brand` indicator bar (`layoutPositioning='ABSOLUTE'`, anchored bottom, hidden on all
other variants) — matches the real WA Tab Group's own default blue underline styling.

**Structure — Tab Panel:** vertical auto-layout, `spacing/4` (16px) padding all sides, `Body/1`
content text in `color/text/secondary`. No border/background of its own — matches WA's real
minimal scope (content continues visually from the tab strip above it).

**Structure — Tab Group (composed example):** vertical stack of a `Tab Row` (horizontal
auto-layout, 1px `color/border/default` bottom divider) holding 4 `Tab` instances (one
`Active=True`) + one `Tab Panel` instance below, demonstrating the pairing.

**Examples section (added 2026-09-08, frame `Tab / Examples`, `3908:160`):** three realistic
compositions beyond the base variant grid, all built from live `Tab` instances (not detached
copies, so they stay in sync with the component) — (1) an instance of the `Tab Group` component
itself (active tab first), (2) a hand-assembled row with the active tab in the third position, to
confirm the active state isn't hardcoded to "first," and (3) a row mixing a `Disabled` tab in with
`Active`/inactive ones, the combination the base variant grid doesn't show on its own. Positioned
between Documentation and To-Do, matching the order used elsewhere in this file.

**Component properties:** `Label` (TEXT, default "Tab") on the `Tab` ComponentSet, bound across
all 4 variants; `Content` (TEXT, default placeholder copy) on `Tab Panel` — same editable-instance
pattern as Accordion's `Label`/`Content` and Alert's `Message`.

**Known limitations (see the page's own To-Do section, `3905:164`, for full detail):**
1. Scroll affordance (`Show Left/Right Scroll`) from the old BO library not modeled — flag if a BO
   screen has more tabs than fit on one row.
2. Closeable tabs (old library's `Group Type=Closeable`, per-tab close icon) not modeled.
3. **Active-tab color deviates from the old library on purpose:** the old library's own
   `Tab Elements` Active variant uses a raw stroke that resolves to this file's `orange/50`
   (Warning) primitive — confirmed `accent/highlight` is actually pale yellow (`#FFFFB3`) and
   unrelated, so this wasn't an aliased "highlight" token, just a raw orange value. Used
   `color/border/brand` (blue/50) instead, matching the real WA kit's own default and this file's
   established selected-state convention. Flagging for design team confirmation rather than
   silently picking a side, in case orange was actually intentional for tabs specifically.
   **Resolved 2026-10-07 (user decision): Tabs stay blue.** Orange/50 is the checked color for
   Radio/Switch (see Open Questions), but that covers form-control checked states only. Tabs' active
   state stays on `color/border/brand` (blue/50), so the old library's orange tab-active stroke is
   deliberately not ported. No change needed in Figma.
4. Only `Placement=Top` is modeled — the real `wa-tab-group` also supports Bottom/Start/End and a
   `Scrolling` variant; out of scope here, matching this file's other Medium-only/reduced-axis
   scope decisions.
5. Component tag name (`boss-tabs` vs `boss-tab-group`) and real prop/event names unconfirmed with
   dev team.
6. Not yet published or Code Connect–mapped.
7. Focus state / focus ring not yet added (same open item as Button/Dialog).

**Re-audited 2026-09-08 as part of the `(Steve)`-page sweep — confirmed still fully compliant, no
changes needed.** Re-imported the real WA Tab fresh and diffed: `Active`/`State`
(Default/Hover/Disabled) matches WA's `Active`/`Disabled` exactly, same established
State-replaces-Disabled convention as Radio/Switch/Accordion/Dropdown Item.

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
**Added 2026-07-20, rebuilt from the real WebAwesome library same day (see below).** Sourced from
the real "Web-Awesome-3-Design-Kit-v2-0-0" org library (component key `53761025bdb44a5b9c7a4880b25
681646d038bf0`) via `importComponentSetByKeyAsync` — imported the Appearance=Default/Size=Medium
variants, detached, and rebound colors to this file's tokens. 20px circle (real WA size — the
first draft guessed 14px to match Checkbox and was wrong), 8px gap to label, 1px border
(`gray/border` unselected). A "Focus Ring" element from the kit is present but hidden
(`visible=false`), kept for future focus-state work. Disabled = 0.5 component opacity, imported
directly from the kit's own Disabled variants. Maps to `wa-radio` / `bossRadioGroup`. Real prop
mapping still inferred for `bossRadioGroup` specifically — flag before dev handoff.

**Updated 2026-09-08: Hover variant removed to match WebAwesome exactly.** Now 4 variants =
`Value` (Unselected/Selected) × `RadioState` (Default/Disabled) — down from 6. The real WA Radio
has no Hover variant at all (confirmed by re-importing componentKey `53761025...` fresh and
reading its `componentPropertyDefinitions`: only `Selected` × `Disabled`, plus a `Focused` boolean
and Appearance/Size axes this file already doesn't model). The Hover variant removed here had been
a same-day synthesized addition (darkened border/dot), not something ported from WA — removing it
was requested explicitly, per user direction to make Radio and Checkbox match WA's real state
model rather than this file's own Default/Hover/Disabled convention. No instances referenced the
removed variants (checked before deleting), so nothing else broke.

**A second, undocumented legacy "Radio" ComponentSet was found on this same page** (inside a frame
named "Radio Button", `3897:11001`, ComponentSet `3897:11002`) — an older component using its own
`Status`/`State`/`With Text` properties, never mentioned anywhere in this brief. Its 4 Hover
variants (`State=Hover`) were removed too, per user confirmation, for consistency with the
canonical Radio above — same never-delete-without-confirmation rule applied (only the Hover
variants were removed, not the whole duplicate; the duplicate itself was left in place since
consolidating/removing it entirely wasn't what was asked). While fixing the resulting layout grid,
caught and corrected a row-order bug introduced during this same edit (an early pass put `Status=On`
row before `Status=Off`, which didn't match this legacy set's own pre-existing static row labels
— "Unselected" then "Checked" — before the Hover column was removed; fixed by re-reading the
original label positions and matching row order to them, verified via screenshot).

**Selected-state color: `orange/50` is correct (resolved 2026-10-07).** Found 2026-09-08: the
Selected variant's dot and border were bound to `orange/50` (this file's Warning token), not
`blue/50` as this section previously documented. Confirmed via `boundVariables` inspection. The
user ruled 2026-10-07 that **orange/50 wins** — it is the intended checked color for form controls,
not drift. Radio now binds `color/bg/control/checked` + `color/border/control/checked` (both alias
`orange/50`, added in the 2026-10-06 token audit) instead of the primitive. Documentation that says
`blue/50` for Radio's selected state is wrong.

### Checkbox component (page `441:270` "Checkbox (Story Written)", ComponentSet ID `447:306`)
Predates the "Steve" atomic-design pass (a "Story Written" page, not sourced via the WA-first
workflow) — no full write-up exists elsewhere in this brief, so only the 2026-09-08 update is
logged here.

**Updated 2026-09-08: Hover variant removed to match WebAwesome exactly.** Now 5 variants =
`Value` (Unchecked/Checked/Indeterminate) × `CheckboxState` (Default/Disabled) — down from 8
(`Indeterminate × Disabled` was already missing before this change, unrelated to Hover). Confirmed
via a fresh import of the real WA Checkbox (componentKey `3138840ee64036e9107e11fe5c466b7cbd7e2ac9`)
that it has no Hover variant either — only `Checked`/`Indeterminate` × `Disabled`, plus a `Focused`
boolean and Size/Hint axes this file doesn't model. No instances referenced the removed variants.

**Trade-off worth flagging, not silently dropped:** this component's Hover variant wasn't
arbitrary — its own documentation recorded that it was added specifically because "the real
deployed styleguide shows a subtle border darken on Unchecked+Hover that the canonical Figma
reference itself doesn't show," i.e. it was closing a real design-vs-implementation gap against
the live app. Removing it to match WA exactly reopens that gap: the live app may still visually
darken the checkbox border on hover, and this Figma component no longer represents that. Flagging
for design team confirmation — if that live hover behavior should be preserved, it likely belongs
as a dev-side CSS rule outside the design system rather than as a Figma variant, but that's a call
for whoever owns `boss-checkbox`, not something to assume here.

### Dialog component (page `934:6` "Dialog (Steve)", Component ID `934:423` — was ComponentSet
`934:427` before the 2026-09-08 rebuild below)
No full write-up existed elsewhere in this brief before this audit (see the page-list entry above
and the earlier Modal→Dialog rename note) — logged in full here.

**Audited 2026-09-08 against the real WA Dialog per the new variant-fidelity rule (see "Reference
libraries" section above).** Re-imported the real `wa-dialog` fresh (componentKey
`4cdf6da8c1b7462e4e3ee6a2ae2f9aa854deef70`) and found a structural mismatch, not just a missing
option: **the real WA Dialog is not a ComponentSet at all — it's a single Component** with
independent boolean properties (`With Header`, `With Header Actions`, `With Footer`) plus
INSTANCE_SWAP slots (`Header Actions`, `Footer`, `Body`, `Label`). This file's Dialog modeled the
same 2×2 Header/Footer space as a **4-variant ComponentSet** instead (pick one of 4 pre-built
layouts) — functionally equivalent coverage, but a different property model than what a real
`wa-dialog` instance actually exposes.

**Converted to match, per explicit user direction:** took the "Header=with-header,
Footer=with-footer" variant (the only one with all three sections present) as the base, deleted
the other 3 variants (confirmed zero instances referenced any of the 4 first), and added two real
`addComponentProperty` BOOLEAN properties — `With Header` and `With Footer` — bound to the Header
and Footer frames' `visible` via `componentPropertyReferences`. `Title`/`Message` TEXT properties
carried over unchanged. `With Header Actions` + the INSTANCE_SWAP slots remain unmodeled — that was
already a flagged, documented gap (page's own To-Do item 1) before this pass, not something newly
discovered, and converting Header/Footer to booleans was the specific, scoped change confirmed —
not a full parity rebuild.

**Found and fixed a real bug surfaced by the conversion, not just a structural change:** the
original 4-variant design had Header→Body spacing owned entirely by `Header`'s own bottom padding
(bound to `spacing/3`, 12px). Once Header could be hidden via a boolean on the *same* Body frame
(rather than a dedicated headerless variant with its own hand-tuned padding), hiding it left Body's
content flush against the top edge with zero spacing — confirmed via test instance + screenshot,
not assumed. Fixed by relocating that 12px to Body's own top padding (`paddingTop`, bound to the
same `spacing/3` variable) and zeroing Header's bottom padding — verified the "with everything"
total height is byte-for-byte unchanged (167px, matches the original spec) and all 4 boolean
combinations render correctly via test instances (removed after verifying) before considering this
done. See [FIGMA-WORKFLOW-NOTES.md §7](FIGMA-WORKFLOW-NOTES.md#7-checking-and-fixing-variant-model-drift-against-the-real-wa-kit)
for why this kind of "spacing owned by the sibling that goes away" bug is worth checking for
whenever a variant-driven show/hide is converted to a boolean-driven one.

**Also hit and fixed a page-documentation clipping bug while updating this component's own on-canvas
To-Do text** (unrelated to the Dialog structure itself, but found in the process): the To-Do frame
uses `layoutMode='NONE'` with `clipsContent=true`, not auto-layout — appending text grew the text
node but not its parent frame, silently clipping the new content at the old bottom edge.
`get_screenshot` reported the frame's stale (too-small) dimensions and looked fine without opening
the actual image. Fixed by resizing the frame explicitly to the text's new bottom edge + margin.
Documented as a new gotcha in `FIGMA-WORKFLOW-NOTES.md` §7.

### Switch component (page `741:4` "Switch (Steve)", ComponentSet ID `775:666`)
**Added 2026-07-20, rebuilt from the real WebAwesome library same day (see below).** Sourced from
the real "Web-Awesome-3-Design-Kit-v2-0-0" org library (component key `02ffbeb3bc023ecbed752329cd
c9381c022a5860`) — imported the Size=Medium variants, detached, rebound colors. Track: 35×20px pill
(real WA size — the first draft guessed 36×20 and was close but not exact), 12px thumb at 4px
inset (first draft used 16px/2px). Off = white track + `gray/70` border/thumb. Focus Ring
preserved but hidden. Disabled = 0.5 opacity, from the kit's own Disabled variants. Maps to
`wa-switch` — flagged as "next up" before this pass. Real prop mapping unconfirmed — flag before
dev handoff.

**Updated 2026-09-08: Hover variant removed to match WebAwesome exactly.** Now 4 variants =
`Value` (Off/On) × `SwitchState` (Default/Disabled) — down from 6. Confirmed via a fresh import of
the real WA Switch (componentKey `02ffbeb3bc023ecbed752329cdc9381c022a5860`) that it has no Hover
variant either (only `Checked` × `Disabled`, plus a `Focused` boolean and Size/Hint/Required axes
already out of scope here). No instances referenced the removed variants.

**While fixing this, also corrected a factual error in the component's own documentation text**
(not the component itself): the description previously claimed "On = `blue/50` track," but the
On-state track is actually bound to `orange/50` — confirmed via `boundVariables` inspection.
**Resolved 2026-10-07: orange/50 is the intended On color** (user ruling; see Open Questions). The
track now binds `color/bg/control/checked`, which aliases `orange/50`.

**Re-audited 2026-09-08 against the real WA Switch, per the new variant-fidelity rule — found fully
compliant, no changes needed.** `Value` × `SwitchState` (Off/On × Default/Disabled) matches WA's
real `Checked` × `Disabled` axes exactly for the Medium size this file models (Small/Large are an
established, documented out-of-scope decision, not a gap). No further action taken.

### Tooltip component (page `741:5` "Tooltip (Steve)", ComponentSet ID `3925:3223` — was `769:16`
before the 2026-09-08 rebuild below)
**Added 2026-07-20, rebuilt from the real WebAwesome library same day (see below).** Originally
ported from the old Design Library's own Tooltip component (page "Tooltip", `14108:1490`, 12
placements) but hand-rebuilt from CSS research first — wrong twice (triangle-polygon arrow, then
corrected-but-still-approximated padding/radius). Final version sourced from the real
"Web-Awesome-3-Design-Kit-v2-0-0" org library (component key
`7225dad6ddab3242ed9a0d8aaf53023f172d50f0`) — imported Top/Bottom/Left/Right variants, detached,
rebound colors to `gray/tooltip-bg`. Real structure: a "Body" frame (3px corner radius — the
CSS-research draft guessed 4px) plus a separate "Arrow Placement" frame containing an 8.48px
square rotated 45° (arrow-size 6px × 0.7071 × 2, overlapping the body edge so only the tip
shows). No interaction states apply (a tooltip has no persistent state, only shows/doesn't). Maps
to `wa-tooltip`.

**Updated 2026-09-08: expanded to all 12 real WA placements + `With Arrow`, per explicit
direction to match WebAwesome exactly** (this component had no Hover to remove — the ask shifted
to closing the previously-documented "simplified from 12 to 4" gap instead). Now `Placement` has
12 options (added `Top Start`/`Top End`/`Bottom Start`/`Bottom End`/`Left Start`/`Left
End`/`Right Start`/`Right End`) plus a `With Arrow` boolean (default true, toggles the Arrow
Placement frame's visibility — verified by test instance: hiding the arrow correctly collapses
component height from 35px to 29px).

Built the 8 new variants by **reading the real WA kit's actual layout properties instead of
reverse-engineering pixel offsets**: confirmed via a fresh import that "Arrow Placement" is a
real auto-layout frame (`HORIZONTAL` for Top/Bottom, `VERTICAL` for Left/Right, 6px padding) whose
`primaryAxisAlignItems` is `CENTER`/`MIN`/`MAX` for the base/Start/End variants respectively —
confirmed this file's own existing Top/Bottom/Left/Right variants already carried the same
auto-layout structure over from their original 2026-07-20 WA import. So each new variant is just a
`clone()` of the matching base direction with `primaryAxisAlignItems` changed to `MIN`/`MAX` — no
manual arrow-position math, and Figma's auto-layout guarantees pixel-correct results regardless of
this file's wider placeholder text vs WA's own. Verified both a Top Start and a Left Start clone
visually before combining everything.

**Hit two bugs while recombining the 4 originals with the 8 new variants into one ComponentSet:**
1. `combineAsVariants` produced the malformed-property-name bug already documented in
   `FIGMA-WORKFLOW-NOTES.md` §2 — the 4 *original* variants (which had been variants of the old
   set) came out named `=Tooltip, =Top` etc., while the 8 fresh clones stayed clean. Fixed by
   renaming the 4 malformed children back to `Placement=Top` etc. directly, per that doc's own
   prescribed fix.
2. Reading `componentPropertyDefinitions` in the *same* `use_figma` call as the `combineAsVariants`
   that produced the set threw `"Component set has existing errors"` and rolled back the entire
   script (transactional rollback, not a partial failure) — moving that read to a separate,
   subsequent call succeeded once the malformed names above were fixed. Worth flagging as a timing
   quirk: don't chain a property-definition read immediately after combining variants in one script.
3. The rebuild also left the new ComponentSet as a page-level sibling of the old "Tooltip" `SECTION`
   instead of re-parented into it (the original had been pulled out during the rebuild and never
   put back) — caught via a page-layout check, not a screenshot; fixed with `section.appendChild()`
   and a section resize before it could ship looking broken.

**`Content` is not exposed as a component property** — attempted adding one, but Figma rejects
binding a TEXT property to a nested `INSTANCE`'s internal text node. Same constraint already
applies to Radio's `Label` and Switch's `Label` (neither expose a text property either, for the
same reason) — editing tooltip copy today means double-clicking into the instance directly.
Flagged as a real gap, not silently worked around: detaching the Content instance would enable a
proper `TEXT` property, but that trades away the "real WA instance, not hand-rebuilt" provenance
for an editing convenience — a call for design team, not assumed here.

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

## Token-binding audit + fix pass (2026-10-06)

**Jira:** [BOPD-1043](https://diningalliance.atlassian.net/browse/BOPD-1043) (Done). It relates to BOPD-929, which compares variable values against code, and to BOPD-1041, which tracks the code roles for the new control/checked tokens.

Every component on 29 pages was walked for: raw (unbound) colors, direct Primitive bindings
instead of semantic Color tokens, variables bound from another library, unbound padding/gap/radius,
text with no style or a legacy style, and effects with no effect style. Nested instances were
skipped (their own component owns them), and so were doc frames.

**Scope (user decision):** core 0.1 components only. **Not edited:** Datepicker (Priscilla's WIP,
~440 findings), Reporting Table (Chance reviewing, ~24), `[Deprecated] Drawer` (`54:62`), and FAB
Iterations 1–3. Already clean before the pass: Accordion, Tabs, Popover, Card, Toast.

**Decisions (user, 2026-10-06):**
- **Legacy text styles → new token styles.** Body 2→Body/2, Body 1→Body/1, Subtitle 1→Subtitle/1,
  Link→Body/2, Small Button→Caption (same Regular 12). Letter-spacing is identical. Line-height goes
  from auto to the code values (Body/2 = 20px), so Select/Input/Textarea/Radio Group etc. grew a few px.
- **Off-scale values snap to the nearest token:** gaps 2→4 (Select, Input, Radio Group), Switch gaps
  7→8 and 1.6→4, Tooltip padding 3.5→4 and 7→8, Alert Banner padding 36→32 (`spacing/8`), Checkbox
  and Drawer Body scroll-thumb radius 2→3 (`radius/s`). Every affected component was screenshotted
  and none broke. *Gotcha:* a nearest-value snap sent Dialog's 999 pill radius to `radius/xl` (16),
  because 999 is numerically nearer 16 than 9999. It was corrected to `radius/full`. Treat any
  radius ≥ 100 as "full", not as a number to snap.
- **New semantic tokens `color/bg/control/checked` + `color/border/control/checked`.** Both alias
  `orange/50` in Light and Dark. Radio and Switch now bind to them instead of the primitive.
  **Code has no matching `--boss-color-*` role yet.** Tracked in BOPD-1041.

**Rules applied:** colors with an exact semantic hex match were bound by role (text→`color/text/*`,
strokes→`color/border/*`, fills→`color/bg|surface/*`, icons→`color/icon/*`). A component-name hint
broke ties (Split Button → `color/*/button/*`). Horizontal padding on a control whose height is
bound to `height/control/X` used `padding/control/X`; everything else used `spacing/*`. Button,
Dropdown, Split Button and Badge labels have no matching text style (Medium 12/16/20), so they bind
`font-family/body` + `font-weight/*` + `font-size/*` instead. Badge was set in **Inter** Semi Bold;
it is now Roboto Medium via those variables. Split Button's Disabled variants had picked
brand-default by hex (raw brand at 60% opacity), so they were moved to the `brand-disabled` tokens
to match Button and Dropdown Trigger.

**Approximate fix counts:** ~280 color, ~550 spacing, ~600 radius, ~200 text-style swaps,
~160 text-variable binds.

**Left as-is, no token exists (deliberate translucency or no local equivalent):**
- Alert (compact, `910:77`/`925:16`): `#ffc061` warning fill on 2 layers. It came from the old
  library's `Color/Alert/warning`, and no local token has that value.
- Badge "Pulse Glow" `#23408f` @ 35%. Drawer Body scroll thumb `#000000` @ 25%.

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
  `UNPUBLISHED`. Button (`455:92`, now `3941:32`) and Split Button (`540:7`) were published but `CHANGED` (local
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
| Button | `3941:32` | `orderly-button (boss-button)` |
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

### Toast component (page `4381:162` "Toast (Steve)", ComponentSet `4384:162` "Toast Item")

**Added 2026-09-17.** First component in the build order built with no directly-named match in
either project library — `search_design_system` scoped to both found an old Back Office "toast"
component (4-value `Type`=Success/Warning/Info/Error, no Brand/Neutral, no accent-bar/progress-ring
anatomy) and the real WA kit's closest primitive is "Callout" (no toast-specific structure at all).
Per the "match WA's variant model, not just geometry" rule, went to the real `wa-toast-item` docs
(https://webawesome.com/docs/components/toast-item/) and screenshotted its live rendered examples
directly rather than building from either library match or from memory.

**5 variants** = `Variant` (Neutral **[default]**/Brand/Success/Warning/Danger) — order and default
both taken from the real component (WA defaults `variant="neutral"`), a deliberate departure from
this file's usual Brand-first convention (Alert Banner/Callout) in favor of matching the real
default state exactly.

**Structure per variant:** colored 4px accent bar (full height, left edge) + optional leading icon +
message text (fills remaining width) + always-visible close button. Icon and accent bar share the
same variant color token (`color/icon/{variant}`, falling back to `color/icon/default` for Neutral —
no `color/icon/neutral` token exists, same fallback Alert Banner uses). Close icon uses
`color/text/primary` (severity-independent), reusing Alert Banner's exact close-icon precedent
(Font Awesome 7 Pro Solid `"close"` glyph, `Med Solid Icon` text style).

**Icon glyph correction vs. Alert Banner:** the real WA rendered example shows `Warning` using a
*circle*-exclamation icon and `Danger` using a *triangle*-exclamation icon — the reverse of what
Alert Banner assigned to those two intents. Toast uses the confirmed-correct (real WA) assignment;
Alert Banner's swapped pair was not touched (out of scope for this pass, flagging only).

**Component properties:** `Icon` (BOOLEAN, default true), `Progress Ring` (BOOLEAN, default true —
a static ring drawn around the close button, proxying WA's real animated countdown ring; WA's own
default `duration` is 5000ms, i.e. ring-visible, so this default matches), `Message` (TEXT, default
"Your changes have been saved!"). No `Show`-prefixed names, per the boolean-naming rule in
`FIGMA-WORKFLOW-NOTES.md` §7. Wired via the established pattern: minted once via
`addComponentProperty` on the `ComponentSetNode`, referenced per-variant child — not re-minted per
variant. Verified with a test instance: toggled both booleans off and overrode `Message` text: all
three took effect correctly.

**Root frame:** fixed 360px width (toasts don't stretch full-width like Alert Banner does), height
hugs content so a wrapped multi-line `Message` grows the card. `radius/l` (8px, matching Dialog's
card radius), `color/surface/default` background, 1px `color/border/default` stroke, and the
existing `Elevation/Dropdown` effect style for its shadow (chosen over `Elevation/Overlay` —
Dialog's heavier modal-backdrop shadow — since a toast is a transient, non-blocking floating
element, closer in visual weight to a dropdown/tooltip popup).

**Layout technique worth reusing:** the accent bar achieves full-height-matching-content without
needing the root frame to be a fixed height — root stays `counterAxisSizingMode: 'AUTO'` (hug,
so it still grows with a multi-line message) while the accent bar child is set to
`layoutAlign = 'STRETCH'` instead of a `FILL` sizing mode. `FILL` would have required the root to
be non-hug first (the same "Hug + Fixed child" gotcha as the Input fix); `STRETCH` sidesteps that
entirely — the child matches whatever height the hug parent resolves to from its *other* children,
no fixed/two-step resize dance needed. Worth trying this first any time a full-height decorative
child (accent bars, dividers) needs to track a hug-sized sibling.

**Known limitations (see the page's own To-Do section for full detail):**
1. `Progress Ring` is a static proxy — cannot show WA's real animated countdown in a still frame.
2. No `Size` axis modeled (WA has xs/s/m/l/xl) — matches the Alert Banner precedent of skipping
   WA's size scale on non-form-control components; revisit if a dense/compact use case appears.
3. `wa-toast` itself (the stacking/positioning container — placement, default `top-end`, multi-toast
   stacking) is pure runtime behavior with no visual form of its own — intentionally not built as a
   Figma component; documented on-canvas so it isn't mistaken for a missed piece.
4. Not yet published or Code Connect–mapped.

**Actions option added 2026-10-07** ([OR-13630](https://diningalliance.atlassian.net/browse/OR-13630) "Action Toast", an edit to this component, not a new one).
- **Source decision (user):** `wa-toast-item` has no action attribute, slot or event; its docs example
  slots buttons into the default content, **below the message text**, with the close button staying on
  the right. That layout wins over the old Back Office library's inline link-style "Action" on the right
  (which also had a bold header line; **not modeled**, user decision). WA's own CSS centers the icon and
  close button vertically in a taller toast, which is what the Figma layout does.
- **Structure:** in all 5 variants the `Message` text moved into a new vertical `Body` frame
  (`spacing/2` gap) with an `Actions` row under it: `Primary Action` (Button, Brand / Filled / Small,
  label "Action") and `Secondary Action` (Button, Brand / Outlined / Small, label "Dismiss"). Both
  are exposed instances. Our Button has no Neutral variant, so WA's neutral "filled" secondary button is
  shown as Outlined (flagged on the page's To-Do item 5).
- **New component properties:** `Actions` (BOOLEAN, default false, so every existing toast is unchanged
  at 360x58) and `Secondary Action` (BOOLEAN, default true). `Message` kept its property link.
- Three example toasts (Brand, Success with one action, Danger) sit under the variant row.

---

### Popover component (page `4692:164` "Popover (Steve)", ComponentSet `4692:219` "Popover")

**Added 2026-09-25.** Unlike Toast, the real WA kit *does* have a directly-named match —
`search_design_system` scoped to both libraries found "Popover" in Web-Awesome-3-Design-Kit-v2-0-0
(component set key `bf9c977b8aaa8f46625c913668fb0d8e26fdbebb`); nothing in the old Back Office
library. Built per the import → `createInstance()` → `detachInstance()` → rebind rule, not hand-drawn.

**Variant model matches the WA kit exactly:** `Placement` (Top **[default]**/Right/Bottom/Left),
`With Arrow` (BOOLEAN, default true → Arrow `visible`), `Content` (INSTANCE_SWAP → the Body's
content instance). Kept WA's own order (Top/Right/Bottom/Left). Only 4 placements, because the WA
*Figma kit* only models 4 — WA *code* supports -start/-end (12, as Tooltip models); flagged as a
known limitation, not silently dropped. Verified via test instance: `With Arrow` off drops height
94 → 88px and stays hidden across a Placement swap; Content defaults to the local placeholder.

**Structure (unchanged from WA):** root auto-layout (`VERTICAL` for Top/Bottom, `HORIZONTAL` for
Left/Right) with `itemSpacing = -6` so the 8.48px 45°-rotated square Arrow overlaps the Body edge;
Arrow strokes only its two outward sides (`[0,0,1,1]`, rotation varies per placement). Body is
fixed 372px wide, hugs height.

**Token rebinding (WA var → this file):** `Surface/Default` → `color/surface/default` (Body + Arrow
fill); `Surface/Border` → `color/border/default` (Body + Arrow stroke); `Space/L` (24) →
`spacing/6`; `Panel/Border Radius` (12) → `radius/l` (8 — deliberate deviation, matches Toast/Dialog;
no 12px token exists); `Panel/Border Width` → hardcoded 1; `Shadow/L` effect style →
`Elevation/Dropdown` (same choice as Toast); `Tooltip/Arrow Size Diagonal` → hardcoded 8.48; the
root's `itemSpacing` was also bound to a remote WA var → unbound, hardcoded -6. Audit after the
build: zero remaining remote variable bindings, zero remote instances.

**Content slot:** WA's default slot content is its remote "Text Node" component (SF Pro 16px).
Replaced with a new local component, `Popover Content` (`4692:165`, fixed 324px = 372 − 2×24
padding, Body/2 text, `color/text/primary`), which is the INSTANCE_SWAP default — avoids depending
on a remote component (see FIGMA-WORKFLOW-NOTES.md §1). The slot instance needed
`layoutSizingVertical = 'HUG'` after `swapComponent()` — it kept WA's fixed 52px height otherwise,
leaving dead space under the text.

**Known limitations (see the page's own To-Do section):**
1. Only 4 placements (see above).
2. `radius/l` 8px vs WA's 12px — confirm or add a token.
3. Fixed 372px width (WA kit default; `--max-width` in code); distance/skidding offsets not modeled.
4. Not yet published or Code Connect–mapped.

### Card component (page `4699:249` "Card (Steve)", ComponentSet `4699:883` "Card")

**Added 2026-09-25 (OR-13618).** Built from the real WA kit Card (component set key
`82956f923890fac149b2636aceaa8782791764d2`): import → `createInstance()` → `detachInstance()` →
rebind → `createComponentFromNode()` → `combineAsVariants()`. Not hand-drawn.

**Variant model matches the WA kit exactly:** `Appearance` (Outlined **[default]**/Filled-Outlined/
Filled/Accent/Plain) × `Orientation` (Vertical **[default]**/Horizontal) = 10 variants. WA's own
property names are kept: `With Header`/`With Media`/`With Footer`/`With Actions`/`With Footer Actions`
(BOOLEAN, all default true) and `Header`/`Body`/`Footer`/`Actions`/`Footer Actions` (INSTANCE_SWAP).
Horizontal has only Media + Body (+ Actions), as in the WA kit.

**Token rebinding (WA var → this file):** `Surface/Default` → `color/surface/default` (Outlined);
`Neutral/Fill/Quiet` → `color/bg/neutral/subtle` (Filled-Outlined, Filled); `Neutral/Fill/Loud` →
`color/bg/neutral/default` (Accent, slot text overridden to `color/text/on-filled`/`color/icon/on-filled`);
Plain has no fill. `Surface/Border` → `color/border/default` (root border on Outlined/Filled-Outlined,
plus header/footer dividers). `Border Radius/L` and `Panel/Border Radius` (12) → `radius/l` (8, same
deviation as Popover). `Space/L` → `spacing/6`, `Space/M` → `spacing/4`, header vertical padding
(`Font Size/XS`, 12) → `spacing/3`. `Border Width/S` → hardcoded 1. `Shadow/S` effect → **dropped**
(no small-shadow style in this file). Audit: zero remote variable bindings, zero remote instances.

**Slots:** new local components `Card Title` (`4699:250`, Subtitle/1), `Card Content` (`4699:252`,
Body/2), `Card Action` (`4699:254`, 40×40 Font Awesome glyph `ellipsis`, `Icon Glyph` TEXT prop) are
the INSTANCE_SWAP defaults. The Footer and action slots also list this file's `Button` as a preferred
value. There's no local Icon Button yet, so `Card Action` is a stand-in.

**Build gotchas hit (see FIGMA-WORKFLOW-NOTES.md §2):** `swapComponent()` renames the instance
to the new main component's name, so later name-based lookups missed the action instances. Binding
a `mainComponent` ref also *immediately swaps* the instance to that property's default, which turned
the actions into title instances until they were fixed. Paints built with a black base color and then bound via
`setBoundVariableForPaint` rendered black on the detached WA frames until they were rebuilt with the resolved color.
The `importComponentSetByKeyAsync` call also timed out repeatedly (`LiveGraph ... timed out`) for a
few minutes, then recovered with no change.

**Audit vs WA kit + shipped `wa-card` (2026-10-01).** Diffed all 10 variants against the WA kit
programmatically and against `@awesome.me/webawesome@3.14.0` `card.styles`. Variant axes, property
names/defaults, fills, layout, alignment and media radii all match. **Fixed:** header/footer dividers
on Filled-Outlined/Filled/Accent/Plain were full 4-side boxes (the hardcoded `Border Width/S` → 1 was
applied to every side); now bottom-only on Header and top-only on Footer on every appearance, as in
both the kit and the CSS (`border-block-end` / `border-block-start`). **Slot names confirmed** against
the WA docs: Figma `Actions` = `header-actions` on Vertical but `actions` on Horizontal (the kit shares
one property for both); `Footer Actions` = `footer-actions`. Horizontal's action is bound to `With
Actions` here (the kit leaves it unbound) — kept on purpose so it can be hidden. **Radius:** shipped CSS
uses `--wa-panel-border-radius`, and RestaurantUI pins `--wa-border-radius-l` to 8px (token doc §4c), so
`radius/l` (8) is likely what the app renders. The kit's 12 is WA's unpinned default. **Padding
stays at the kit's 24/12 on purpose (decided 2026-10-01).** Popover is the base component and uses
`Space/L` → 24, so Card follows it. Known gap: card `--spacing` is `var(--wa-space-l)`, which RestaurantUI
pins to 20px (token doc §4b), so the coded card renders 20/10. Card was briefly switched to 20/10, then
reverted for consistency with Popover.

**Known limitations (see the page's own To-Do section):** no shadow (`--wa-shadow-s` applies to every
appearance except Plain in code); placeholder slot defaults and no real Icon Button (kit's is 43×43, ours
40×40, which accounts for small height diffs); WA sample image still in Media; low-contrast dividers on
Accent (same `Surface/Border` as the kit/CSS, so this is faithful); relationship to the existing
Financial Reports Card undecided; not published or Code Connect–mapped.

---

## Figma file layout conventions

- Doc frames: Roboto Medium 32px title + Body/2 description, positioned above component sets
- Grid gap: 16px between variants, 40px padding inside ComponentSet
- Column order: `Default | Hover | Disabled` (per Size row); Appearance groups ordered `Filled | Outlined | Plain | Accent`
- Row order: `Brand | Danger` (was: `brand | neutral | danger | success | warning`)
- Page naming: `[Status] Page Name` per craft standards (e.g. `[WIP] Button`)

---

## Component build order (remaining)

Moved to [COMPONENT-STATUS.md](./COMPONENT-STATUS.md) — that file is now the living status
tracker across both Figma design and RestaurantUI dev work (Complete / In Progress — Dev /
In Progress — Designer / Not Started), kept current as part of the work that moves an item
between buckets. This brief stays the historical record: why each component looks the way it
does, node/page IDs, and the drift notes below on how the build-order list itself has changed
over time.

**Drift note (2026-09-08):** the build order previously had "Modal / Dialog" as item 1, but a live
Figma pull the same day confirmed the component was already built and published (page `934:6`,
ComponentSet `934:427`) — same drift pattern flagged elsewhere in this brief (Alert/Floating
Action Bar were similarly undocumented-but-built). Removed from the remaining list. Same day, the
page/component itself was renamed "Modal (Steve)"/"Modal" → "Dialog (Steve)"/"Dialog" to match
WebAwesome's own naming (`wa-dialog`) — see the page list entry above and the Dialog page's own
To-Do item 4.

Also added 2026-09-08 per a Figma-vs-WebAwesome component gap review: Tabs, Toast, and Popover were
flagged as high-value gaps (all three show up constantly in a back-office app). All three are now
done in Figma — Popover on 2026-09-25 (see Popover component section above; page `4692:164`, first
page in the new "--- Base Components ---" section). Dev status for all three is tracked in
COMPONENT-STATUS.md.

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
- ~~Foundations page content (color swatches...) not yet populated~~ — Colors done 2026-07-17, Spacing done 2026-07-21/22 (see respective Foundations sections); type scale done 2026-10-05
- Phase 4 QA + accessibility audit pending
- ~~Radio/Switch/Tooltip unpublished, blocking Code Connect~~ — done 2026-07-22, all 6 `(Steve)` components published and Code Connect–mapped (see Publish & Code Connect audit section)
- Code Connect mappings for all 6 `(Steve)` components use documented tag names only — not verified against real `boss-*`/`orderly-*` source files in the RestaurantUI repo. Verify before dev handoff.
- ~~"Dropdown Item" (page `468:2`) is documented in text but was never built as an actual Figma component — only "Dropdown Trigger" exists~~ — done 2026-09-08, see Dropdown component section
- ~~**New 2026-09-08 — systemic orange/50-vs-blue/50 drift on selected/active states.**~~ **Resolved
  2026-10-07: orange/50 wins** (user ruling). Radio's selected dot/border and Switch's On track are
  intentionally `orange/50`; they bind the semantic `color/bg/control/checked` and
  `color/border/control/checked` tokens added in the 2026-10-06 token audit. Not drift, no fix needed in
  Figma. Remaining work: code has no matching `--boss-color-*` role yet (BOPD-1041). Tabs' active
  state stays blue (`color/border/brand`), confirmed by the user 2026-10-07. The old library's orange
  tab-active stroke was reviewed, not ported.
- ~~Radio Group's Button appearance uses brand blue while Default appearance uses orange checked.~~
  Aligned 2026-10-07: Button appearance now uses the checked tokens.

---

### Radio Group component (page `4754:162` "Radio Group (Steve)", ComponentSet `4754:381`, Radio Button `4754:176`)
**Added 2026-09-29.** Sourced from the real WA kit's Radio Group (componentKey
`ee33186e423937f509900ff1240a92c9480c5ffc`) and Radio (`53761025...`) property models, re-read fresh.
- **Radio Group** — 8 variants: `Orientation` (Vertical/Horizontal) × `Appearance` (Default/Button) ×
  `Disabled` (False/True). Properties match WA: `Label`, `Hint` (TEXT; the kit uses INSTANCE_SWAP Text
  Nodes), `With Label` (true), `With Hint` (false), `Required` (false). Each of the 3 options is an exposed
  nested instance, so the selected option and per-option Disabled are set from the properties panel.
- **Radio Button** — new local building block for `wa-radio appearance="button"`: `Selected` × `Disabled`,
  plus `Label` (TEXT) and `Focused` (BOOLEAN, Focus/Ring effect style). The existing Radio (`771:432`)
  was deliberately **not** modified (user direction: new component, don't touch Radio).
- **Default appearance instances the existing Radio**, so it inherits Radio's `orange/50` checked
  color (intended, see the Radio section). **Button appearance moved to the checked tokens
  2026-10-07** (user decision): Radio Button's two Selected variants (`4754:170`, `4754:173`, plus
  their hidden Focus Ring rects) now bind `color/bg/control/checked` fill + `color/border/control/checked`
  stroke, replacing `color/bg/brand/subtle` + `color/border/brand`. The selected button is therefore a
  solid orange fill with `color/text/primary` label (the Disabled variant renders the same at reduced
  opacity). Both appearances now agree. The page's on-canvas To-Do items 1, 3 and 4 were reworded to match.
- **Deliberate deviation:** `Size` (Small/Large) dropped, Medium only, confirmed with the user.
- Button groups use a -1 gap (collapsed borders) + `itemReverseZIndex`, with corner radii zeroed per
  position (outer corners only), matching the kit's joined-group rendering.
- An Examples section covers every section of the WA docs page (initial value, hint, radio buttons,
  disabled group / single option, orientation, required). Validation/custom validity has no visual
  state in WA (browser-native), so it isn't modeled. The on-canvas To-Do lists the open items.

---

### File Upload component (page `5012:162` "File Upload (Steve)", ComponentSet `5013:340`, File Upload Row `5013:185`)
**Added 2026-10-07.** Figma story [OR-13620](https://diningalliance.atlassian.net/browse/OR-13620). WA: `wa-file-input` (**Pro**).
- **No kit component to diff against.** `wa-file-input` is Pro and is not in the Web Awesome 3 Design
  Kit (`search_design_system` on both scoped libraries found no file input, and the standalone kit file
  has no matching page). The variant model comes from the `wa-file-input` docs page (label, hint,
  withLabel, withHint, required, disabled, dragging, size, `:state(blank)`); the geometry comes from the
  old Back Office library's File Upload (`wdwwm6VbBU89GFViEvcfkY`, page `4173:3451`: `.file upload
  container`, `.file upload summary`, restrictions text), rebuilt on this file's tokens rather than
  imported. Confirm the WA Pro license before dev starts.
- **File Upload** — 6 variants: `State` (Default / Dragging / Disabled) × `Files` (Blank / With
  Files). Properties: `Label`, `Hint` (TEXT), `With Label` (true), `With Hint` (false), `Required`
  (false), `Dropzone Text`, `Restrictions` (TEXT). The dropzone is a dashed `color/border/default`
  box (fill `color/surface/default`; Dragging uses `color/surface/secondary`; Disabled uses the
  `color/*/disabled` roles and the Disabled Button variant) holding a Font Awesome `file-invoice` glyph,
  the dropzone text, "or", a Button instance (Brand / Outlined / Medium, label "Browse Files" as a text
  override) and the restrictions caption. With Files adds a bordered list: a `color/surface/table-header`
  header plus **File Upload Row** instances.
- **File Upload Row** — new building block: `File Name` (TEXT) plus a Font Awesome `xmark` remove cell
  (`color/icon/brand`), separated by `color/border/default`.
- **Deliberate deviations from `wa-file-input`:** Medium only (`size` xs/s/l/xl dropped, per the
  Medium-only form-control decision). WA's two booleans `dragging` and `disabled` are collapsed into one
  `State` axis because they can never both be true. Per-file size and image thumbnail (WA `file-size`,
  `file-thumbnail` parts) are not modeled; the list follows the old library (name + remove).
- **Validation errors:** `wa-file-input` has `:state(user-invalid)` but no visual of its own, so errors
  use an Alert Banner (Danger, Outlined) under the dropzone, as in the old library (see Examples). The
  old library's separate `.file upload error alert` component was not ported.
- **Off-scale values snapped (token audit rule):** dropzone padding and gap 40 and 32 → `spacing/8`
  (32); the restrictions caption 10px → `Caption` (12, uppercase). The Dragging fill is
  `color/surface/secondary` (gray/95), a little darker than the old library's near-white hover.
- Not yet done: Code Connect mapping (RestaurantUI wrapper not yet identified), Jira story status.

---

### BOSS Table component (page `5027:162` "BOSS Table (Steve)", ComponentSet `5034:1377`)
**Started 2026-10-07.** Figma story [OR-13629](https://diningalliance.atlassian.net/browse/OR-13629). WA: `wa-data-grid` (**Pro**, marked Experimental). WebAwesome Pro
3.11 already ships in RestaurantUI (`dist/components/data-grid` copied by `angular.json`), but nothing
uses `wa-data-grid` yet.

**Goal (user decision):** one table for every use, switching between list screens and financial reports,
that can do everything the current tables do. Decisions 2026-10-07: build a new component from the
Reporting Table (Chance) components and edit those afterwards; design toward `wa-data-grid`; the switch is
`Size` = **Standard** / **Report**.

**What the code actually has (research 2026-10-07, `orderly` repo):**
- `boss-table` (`RestaurantUI/src/app/components/bossTable/`, about 93 files) is built on **TanStack
  Table**, not ag-Grid. ag-Grid (Community 34.3) survives only in the deprecated `orderly-table` wrapper
  (6 screens).
- Financial statements (P&L, Balance Sheet, Cash Flow, Budget, Custom) use a separate native-`<table>` kit in
  `pages/reports/financialReports/shared/`. The Reporting Table page is mapped to this kit.
- `boss-table` features in use: money/right-aligned columns, row selection (incl. disabled with tooltip),
  expand + detail panel, nested tables inside rows, tree sub-rows, footer totals (17 screens), pagination
  (default 100 rows, no page-size picker), column hiding and pinning, header sub-text / info tooltip /
  group header, global search, CSV export, row actions, kebab menus, and **inline editing** (Input, Select,
  Date, Checkbox, Switch, Combobox; about 17 finance entry screens). Column filter UI exists but no screen
  turns it on. No loading/empty/error states, no keyboard navigation, no column resize.

**`wa-data-grid` gaps for BOSS (need a dev conversation):** no inline editing; no headers spanning
columns (every report groups $ and % under a period); no subtotal or ghost rows mid-table (only group
aggregates and column footers).

**Built:**
- **BOSS Table** (`5034:1377`): `Size` (Standard / Report) × `State` (Default / Loading / Empty /
  No Results). Booleans `Toolbar` (false), `Footer` (true), `Pagination` (false). 918px wide. Standard is
  built from the new Table Row; Report is built from the Reporting Table's `Column Header Row` and
  `GL Row` instances (one period group, title cell FILL, same settings as Chance's P&L example). The
  Reporting Table components were **not edited**.
- Standard building blocks (section `5029:266`):
  - **Table Header Cell** (`5029:267`): Type Text (Align Left/Right/Center) / Checkbox / Expand / Empty.
    Properties Label, Sub Text Value (TEXT), Sub Text, Sort, Info, Filter, Column Menu (BOOLEAN). Sort is an
    exposed instance of the Reporting Table's `Sort`. Min height 33px.
  - **Table Cell** (`5029:268`): 17 types: Text (3 alignments), Text + Sub Text, Money, Percent, Link,
    No Value, Tag, Checkbox, Collapsed, Expanded, Actions, More, Input, Select, Switch. Form controls are
    exposed instances of the real Checkbox, Tag, Input, Single Select and Switch. Min height 43px.
  - **Table Row** (`5031:451`): Type Header / Default / Parent / Child / Footer / Detail × State Default /
    Hover / Selected. Cells overlap by -1px like the Reporting Table; the Supplier column fills.
  - **Table Toolbar** (`5033:354`): Search, Bulk Actions, Columns, Export booleans.
  - **Table Pager** (`5033:380`): row count, first/prev/"Page X of Y"/next/last, optional Page Size.
  - **Table State Panel** (`5033:408`): Loading / Empty / No Results (the grid's loading, empty and
    no-results slots).

**Second pass, same day (user decisions 2026-10-07):** "go with your choices, only use gray for the
header, allow inline editing and links to drawers or other pages, fix multi-period alignment, do
everything the Reporting Table asks for." Done:
- **Colors:** gray only in header rows. Hover = `color/surface/table-hover` (#edf6fb) in both sizes;
  Selected = `color/bg/brand/subtle-hover` (blue/90, #dee2ee). Not `color/bg/brand/subtle`: despite the
  name it resolves to blue/95 = #f8f8fa, which reads as gray. BOSS Table is 1145px wide (was 918) so three
  periods fit.
- **Table Cell:** new `Link` axis (No / Yes) on Text, Text + Sub Text, Money, Percent, with `Link Icon`
  + `Link Icon Glyph` properties (default `arrow-up-right-from-square`, for links to another page); the
  old `Type=Link` variant became `Type=Text, Link=Yes`. New editors `Type=Date` (Input with calendar icon)
  and `Type=Combobox` (Combobox / Field). `Focused` on checkbox / chevron cells. Now 24 variants.
- **Table Header Cell:** `Resize Handle` (2px `color/border/focus` bar) and `Focused` (2px focus ring).
- **Reporting Table components (Chance's, edited with authorization):**
  - GL Row Total / Subtotal rows used an **orphaned** `Combo Cell/Subtotal` instance (main no longer
    exists) that was 3px wider and not wired to Second / Third Group, so multi-period tables could not
    line up. Swapped to `Combo Cell State=Subtotal`, reordered, and wired like the other rows. Combo Cell
    Total Line / Subtotal states normalized from 190 to 187px.
  - Title cells: `minWidth` 439 / 80 / 103 → **300** everywhere (code's `max(20vw, 300px)`).
  - Header Cell Types: `Filter`, `Column Menu` (glyphs copied from Priscilla's Data Grid page),
    `Resize Handle`, `Focused`. Read Only Cell: `Type=Checkbox`, `Focused`. GL Row: `Selectable`,
    `Variance`, `Type=Collapsed Total`. Column Header Row: `Selectable`, `Variance`. All default off.
    Period groups 2 and 3 are wrapped in `group-2` / `group-3` frames; an empty hidden
    `group-1 (empty, unused)` frame remains in each (left rather than deleted).
  - Hover examples were bound to the old remote library's `Color/Table/row-active` (30 fills) and Editable
    Cell Active to `color/surface/row-active`: all rebound to `color/surface/table-hover`.
  - README updated with an "UPDATED 2026-10-07" section and the new hover token.
- **Examples section** (`5048:1621`): pinned columns + horizontal scroll (Report, every option on,
  half-checked parent), header interactions (focus, filter + column menu, tooltip, resize, both sizes),
  links to a drawer / page, inline editing (Standard editors + Report Combo Cell Input).

**Cells merged into one set (2026-10-07, user request).** `Table Cell` (`5029:268`, 39 variants) and
`Table Header Cell` (`5029:267`, 11 variants) now have a `Size` axis (Standard / Report).
- Method: the Reporting Table's Read Only Cell, Editable Cell and Header Cell Types variants were
  **cloned** into the BOSS sets as `Size=Report` (not moved: moving would empty and auto-delete Chance's
  sets). Every direct instance (177) was swapped to the clones and every instance on the archived page
  (757 incl. nested) had its settings re-applied; 0 errors. Chance's P&L example rendered pixel-identical
  before and after.
- Mapping: Text / Dollar→Money / Percent / Total each get Link = No / Yes (replacing the Static + Link
  boolean pair); Empty, No Value, Collapsed, Expanded, Checkbox; Editable and Editable (Active) with new
  `Value`, `Typed Value`, `Cursor` properties; new `Tag` boolean. Header: Title→Type=Text (label and date
  now drive the `Label` / `Sub Text Value` properties), Checkbox, Empty, Collapsed, Expanded; Date→`Sub
  Text`. Standard header `Type=Expand` was renamed `Type=Expanded` to match.
- Not merged yet: the Reporting Table's rows (GL Row, Combo Cell, GL Parent / Ghost / Child, Column Header
  Row) stay on the archived page, now built from the merged cells. The original cell sets stay too: 31
  instances still point at them (18 in Priscilla's archived examples, 13 inside orphaned components that
  are no longer in the document tree). Delete them only after those are dealt with.
- Gotcha: overrides on an instance nested inside a swapped cell (the checkbox inside the Selection Cell)
  are lost on swap; the pinned example's half-checked / checked rows had to be re-set.

**Rows merged too (2026-10-07, user request).** `Table Row` (`5031:451`) now has `Size` (Standard / Report)
and four shared booleans: `Second Group`, `Third Group`, `Selectable`, `Variance` (all default false; the old
Column Header Row defaulted Second/Third to true, so instances got their values re-applied).
- Report types: Header (was Column Header Row), Default (No Children), Parent (Children), Ghost, Child,
  Subtotal, Total, Collapsed Total. New: Hover (`color/surface/table-hover`) and Selected
  (`color/bg/brand/subtle-hover`, row checkbox checked) for Report Default / Parent / Child, matching Standard.
- Same clone-and-swap method: 140 direct instances (111 archived page, 29 BOSS page) swapped, 0 errors,
  0 instances of the old GL Row / Column Header Row left. Before/after screenshots of Chance's P&L and
  budget examples, the BOSS Report table, the pinned example and the header example are pixel-identical.
- One regression found and fixed: expanded parent rows in Chance's P&L / hover examples lost their "blank
  values" overrides (they lived on cells nested inside the row, from the cell merge). Hidden again on the 16
  affected rows.
- Still used from the archived page, inside the merged pieces: Combo Cell ($ + % pair), GL Parent / Ghost
  Row / GL Child (title indentation) and Sort.

**Last pieces moved (2026-10-07).** New sets in BOSS Table / Building Blocks: **Table Cell Pair**
(`5071:3268`, was Combo Cell, same 7 states), **Table Tree Cell** (`5071:3354`, GL Child's State × Depth plus
GL Ghost Row as `State=Ghost`, Depth 1-4) and **Table Sort** (`5071:3365`, was Sort). 382 instances switched
(218 archived page, 164 BOSS page), 0 errors, 0 overrides needed restoring; before/after screenshots of six
views (P&L, budget, hover examples, BOSS Report table, pinned and header examples) are pixel-identical.
Method worth reusing: snapshot each instance's full subtree by **instance sublayer IDs** (`I<instance>;<main
child>;...`, built from the main component tree, which reaches hidden layers that `instance.children`
omits), swap, then restore visibility / text / nested main / fill wherever they differ.
BOSS Table no longer depends on the archived page. The originals there are unused except by Priscilla's
archived Data Grid page (6) and orphaned components no longer in the document (9). GL Parent was not moved
(only Priscilla's page uses it).

**Still open:**
Detail panel background has no token matching code (#f8faff); dev conversation on `wa-data-grid` gaps
(inline editing, spanning headers, subtotal rows).

