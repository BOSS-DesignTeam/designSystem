# RestaurantUI Design Token System — Source of Truth for Figma

**Purpose:** Code is the source of truth. This document extracts the live RestaurantUI token system so UX can align the Figma library to it (not the other way around).

**Scope:** RestaurantUI only. AdminUi is a separate (later) migration target and is out of scope here.

**Generated:** 2026-06-17, from the `thorn/OR-12186` working tree.

> **For UX — you need no repo/git access to use this.** Every token value, component option, and standard is written out in full below. File paths (e.g. `_colors.scss`) appear only as engineering provenance so a developer can find the same value in code; you never need to open them. To see any of this rendered live, use the style-guide URLs in §8.

---

## 0. Read this first — the layered token model

Our tokens live in **three layers**. Figma should mirror **layer 2** (the semantic names), and treat layer 1 as the underlying primitive fills.

| Layer | Where it lives | What it is | Example |
|---|---|---|---|
| 1. Primitive swatches | `app/sass/_colors.scss` (`$brand-*`), `BrandColors.ts` | Raw hex. No meaning. | `$brand-darker-blue: #23408f` |
| 2. Semantic roles (WebAwesome) | `app/sass/external/_webawesome.scss` | Brand / danger / success / warning / neutral, each a **tint scale** keyed at **50** | `--wa-color-blue-50: #23408f` |
| 3. Consumers | `boss-*` wrappers, `.btn`, ag-Grid theme | Read layer 2, never raw hex | `wa-button variant="brand"` |

### Two gotchas that will bite Figma if missed

1. **The WebAwesome tint scale is INVERTED vs Material/Shoelace.**
   In WA, **higher number = lighter**, **lower number = darker/more saturated**. The key (most-used) tint is **50**.
   - `--wa-color-blue-95` = `#f8f8fa` (almost white)
   - `--wa-color-blue-50` = `#23408f` (the primary button fill)  ← key
   - `--wa-color-blue-30` = `#002790` (darkest)

   If Figma variables follow Material's "50 = lightest, 900 = darkest" convention, every reference will be backwards. The OR-11839 migration guide flags this explicitly: `--sl-color-primary-500` maps to `--wa-color-brand-50`.

2. **`warning` is orange, not yellow.** WebAwesome's default `warning` role maps to yellow. We remap it to our orange (`#fa9016`) in code. Figma's warning swatch should be orange.

---

## 1. What WebAwesome is, and why these tokens exist (OR-11839 context)

**WebAwesome** is the successor to Shoelace (Shoelace 2). It is a library of framework-agnostic Web Components (`<wa-button>`, `<wa-input>`, `<wa-select>`, `<wa-combobox>`, etc.) themed entirely through CSS custom properties (`--wa-*`). We are on the **Pro** tier (purchased), which unlocks `<wa-combobox>` and `<wa-toast>`.

**OR-11839 ("Webawesome Migration Fun")** is the epic that removes Shoelace and replaces every primitive with a WebAwesome equivalent, fronted by Orderly-owned **`boss-*` wrapper components**, by **2026-12-31**. Key points relevant to UX:

- It is a "Ship of Theseus" migration: Shoelace and WebAwesome **coexist** during the transition, which is why many tokens are deliberately pinned to match the old Shoelace values (so a `wa-*` control sits pixel-identical next to a surviving `sl-*` one).
- **`boss-*`** is the Orderly wrapper namespace. Consuming pages talk to `boss-button`, `boss-input`, `boss-select`, `boss-combobox`, etc. — never raw `wa-*`. This is the layer UX component specs should target.
- **Variant rename:** `variant="primary"` becomes `variant="brand"` on buttons/tags/etc. (See the variant map in §7.)
- **OR-11841** (a Phase-1 sub-ticket) owns the theme tokens + the style-guide tokens page. This document is effectively the spec for that.
- WebAwesome AI docs: https://webawesome.com/docs/ai • Migration guide: https://webawesome.com/docs/resources/migrating-from-shoelace

---

## 2. Color tokens

### 2a. Semantic roles — THE table Figma should mirror

Source: `app/sass/external/_webawesome.scss` (the `.wa-palette-orderly` block). These are the named tints actually defined; gaps between them are filled by WebAwesome's `color-mix()` derivations at runtime, so Figma only needs these anchor stops.

**Brand (blue)** — primary actions, brand fill, links
| Token | Hex | Primitive | Role |
|---|---|---|---|
| `--wa-color-blue-95` | `#f8f8fa` | `$brand-lightest-blue` | lightest tint / hover bg |
| `--wa-color-blue-90` | `#dee2ee` | `$brand-lighter-blue` | light tint |
| `--wa-color-blue-70` | `#49a4da` | `$brand-active-blue` | active / **link color** |
| `--wa-color-blue-60` | `#0071ce` | `$brand-blue` | accent blue |
| `--wa-color-blue-50` | `#23408f` | `$brand-darker-blue` | **KEY — primary button fill** |
| `--wa-color-blue-30` | `#002790` | `$brand-hover-blue` | darkest / pressed |

**Danger (red)**
| Token | Hex | Primitive |
|---|---|---|
| `--wa-color-red-90` | `#fed0d0` | `$brand-warn-light` |
| `--wa-color-red-50` | `#fa1616` | `$brand-warn` (**KEY**) |
| `--wa-color-red-40` | `#e60c0c` | `$brand-warn-hover` |
| `--wa-color-red-30` | `#9a261c` | `$brand-darker-warn` |

**Success (green)**
| Token | Hex | Primitive |
|---|---|---|
| `--wa-color-green-90` | `#e1e9d0` | `$brand-light-green` |
| `--wa-color-green-50` | `#00a95d` | `$brand-green` (**KEY**) |
| `--wa-color-green-40` | `#688f16` | `$alert-green` |

**Warning (orange — remapped from WA's default yellow)**
| Token | Hex | Primitive |
|---|---|---|
| `--wa-color-orange-95` | `#FFF2DF` | `$alert-light-orange` |
| `--wa-color-orange-90` | `#fee9d0` | `$brand-light-orange` |
| `--wa-color-orange-70` | `#ffc061` | `$alert-orange` |
| `--wa-color-orange-50` | `#fa9016` | `$brand-orange` (**KEY**) |
| `--wa-color-orange-40` | `#f08100` | `$brand-darker-orange` |

(`--wa-color-warning-*` aliases all point at the matching `--wa-color-orange-*`.)

**Neutral (gray)** — text, borders, backgrounds, disabled
| Token | Hex | Primitive |
|---|---|---|
| `--wa-color-gray-95` | `#e8e8ee` | `$brand-lightest-grey` |
| `--wa-color-gray-90` | `#e5e5e5` | `$brand-light-grey-background` |
| `--wa-color-gray-80` | `#cfd1d9` | `$brand-lighter-grey` |
| `--wa-color-gray-70` | `#9a9aa3` | `$brand-light-grey` |
| `--wa-color-gray-60` | `#8d8d90` | `$brand-dark-silver-grey` (disabled/inactive) |
| `--wa-color-gray-50` | `#5f6272` | `$brand-darker-grey` (**KEY** — secondary text) |
| `--wa-color-gray-40` | `#5e5e5e` | `$brand-medium-grey` |
| `--wa-color-gray-30` | `#484848` | `$brand-grey` |
| `--wa-color-gray-10` | `#18191D` | `$content-text-icons-body-primary` (body text) |

### 2b. Full primitive palette (`$brand-*`)

Source: `app/sass/_colors.scss`. Also mirrored as TS constants in `BrandColors.ts` for use in component code. This is the complete underlying swatch set; most are surfaced through layer 2 above.

**Blues**
| Variable | Hex |
|---|---|
| `$brand-light-bluish-grey` | `#f2f5fd` |
| `$brand-lightest-blue` | `#f8f8fa` |
| `$brand-lighter-blue` | `#dee2ee` |
| `$brand-active-blue` | `#49a4da` |
| `$brand-blue` | `#0071ce` |
| `$brand-darker-blue` | `#23408f` |
| `$brand-hover-blue` | `#002790` |
| `$brand-secondary-hover-blue` | `#C8CFE3` |

**Reds / warning**
| Variable | Hex |
|---|---|
| `$brand-warn` | `#fa1616` |
| `$brand-warn-hover` | `#e60c0c` |
| `$brand-darker-warn` | `#9a261c` |
| `$brand-warn-light` | `#fed0d0` |

**Oranges**
| Variable | Hex |
|---|---|
| `$brand-light-orange` | `#fee9d0` |
| `$brand-orange` | `#fa9016` |
| `$brand-darker-orange` | `#f08100` |
| `$alert-orange` | `#ffc061` |
| `$alert-light-orange` | `#FFF2DF` |

**Greens**
| Variable | Hex |
|---|---|
| `$brand-light-green` | `#e1e9d0` |
| `$brand-green` | `#00a95d` |
| `$alert-green` | `#688f16` |

**Greys / neutrals**
| Variable | Hex |
|---|---|
| `$brand-lightest-grey` | `#e8e8ee` |
| `$brand-lighter-grey` | `#cfd1d9` |
| `$brand-light-grey` | `#9a9aa3` |
| `$brand-medium-grey` | `#5e5e5e` |
| `$brand-grey` | `#484848` |
| `$brand-dark-grey` | `#d3d8e0` |
| `$brand-dark-silver-grey` | `#8d8d90` |
| `$brand-darker-grey` | `#5f6272` |
| `$brand-grey-background` | `#e1e1e1` |
| `$brand-light-grey-background` | `#e5e5e5` |
| `$brand-border-primary` | `#d3d8e0` (alias of `$brand-dark-grey`) |
| `$brand-dark-silver-grey-header-text` | `#868995` |
| `$brand-active-state-grey` | `#f0f0f0` |
| `$spec-dark-gray` | `#060d21` |

**Text / icon semantic**
| Variable | Hex |
|---|---|
| `$content-text-icons-body-primary` | `#18191D` |
| `$content-text-icons-body-secondary` | `#5F6272` |

**Surfaces**
| Variable | Hex |
|---|---|
| `$brand-white` | `#ffffff` |
| `$brand-black` | `#000000` |
| `$brand-highlight` | `#ffffb3` |
| `$drawer-background` | `#fcfdff` |
| `$table-background-grey` | `#f8faff` |
| `$table-header-background` | `#F7F7F8` |
| `$table-background-hover` | `#EDF6FB` |
| `$ag-grid-row-highlight` | `#FEF1E3` |
| `$system-blue` | `#698ff8` |
| `$markup-magenta` | `#E8178A` |

**Marketing / legacy** (used by marketing surfaces, not the app shell — flag for UX as "legacy, do not extend"):
`$marketing-blue #336699`, `$marketing-red #b33431`, `$marketing-dark-red #8a322b`, `$marketing-orange #d77138`, `$marketing-dark-orange #b44e15`, `$marketing-lighter-grey #ebebeb`, `$marketing-light-grey #999999`, `$marketing-dark-grey #555555`.

---

## 3. Typography

**Font family:** `Roboto, sans-serif` everywhere (`--wa-font-family-body`, `--sl-font-sans`, ag-Grid). This matches the old Figma library.

### 3a. Type scale (named classes — `app/sass/_text.scss`)

| Class | Size | Weight | Letter-spacing | Use |
|---|---|---|---|---|
| `.heading1` | 2.125rem (34px) | 400 | 0.085px | Page display heading |
| `.heading3` | 1.25rem (20px) | 500 | 0.03px | Subheading |
| `.subtitle1` | 1rem (16px) | 500 | 0.024px | Subtitle |
| `.subtitle2` | 0.875rem (14px) | 500 | 0.021px | Small subtitle |
| `.body1` | 1rem (16px) | 400 | 0.08px | Body |
| `.body2` | 0.875rem (14px) | 400 | 0.035px | Small body |
| `.caption` | 0.75rem (12px) | 400 | 0.048px | Caption / **form labels** |
| `.column-header` | 12px | 500 | 0.15px | Table header (UPPERCASE) |

Icon-text classes (FontAwesome sizing): `.xsml-thin-icon`/`.xsml-solid-icon` 10px, `.sml-thin-icon`/`.sml-reg-icon` 14px, `.med-thin-icon` 16px, `.lg-reg-icon`/`.lg-thin-icon` 22px.

> **Deprecated:** `.h1`–`.h8` (em-based) are explicitly marked "deprecated, to be replaced once UX tokens are finished." Do **not** model these in Figma — they are the thing this work replaces.

### 3b. WebAwesome font-size scale (`_webawesome.scss`)

Pinned to Shoelace's values during coexistence (WA's native scale is offset by one step):

| Token | rem | px |
|---|---|---|
| `--wa-font-size-2xs` | 0.625 | 10 |
| `--wa-font-size-xs` | 0.75 | 12 |
| `--wa-font-size-s` | 0.875 | 14 |
| `--wa-font-size-m` | 1 | 16 |
| `--wa-font-size-l` | 1.25 | 20 |
| `--wa-font-size-xl` | 1.5 | 24 |
| `--wa-font-size-2xl` | 2.25 | 36 |

### 3c. Form-control label standard (important, app-wide)

Every `wa-*` form control label is pinned to one fixed style regardless of control size:
**Roboto, 12px (`--wa-font-size-xs`), weight normal, letter-spacing 0.4px, 4px gap above the field.** This is the "Caption" token. UX should spec form labels this way universally (not scaling with control size).

---

## 4. Spacing & radius

### 4a. Spacing scale (`app/sass/_sizing.scss` + `Sizings.ts`)

Note the "friends" nicknames — they are the real variable names in code.

| Variable | px | Alias |
|---|---|---|
| `$bbfe` | 4 | (= `$borderRadius`) |
| `$bf` | 8 | `$spacingSmall` |
| `$superFriends` | 12 | |
| `$closeFriends` | 16 | `$spacingMedium` |
| `$closerThanIshFriends` | 20 | |
| `$closeishFriends` | 24 | `$spacingLarge` |
| `$friends` | 32 | `$spacingXL` |
| `$okayFriends` | 48 | |
| `$acq` | 64 | |
| `$dist-acq` | 72 | |
| `$stranger` | 128 | |

### 4b. WebAwesome space scale (used for WA component-internal gaps)

| Token | rem | px |
|---|---|---|
| `--wa-space-3xs` | 0.125 | 2 |
| `--wa-space-2xs` | 0.25 | 4 |
| `--wa-space-xs` | 0.5 | 8 |
| `--wa-space-s` | 0.75 | 12 |
| `--wa-space-m` | 1 | 16 |
| `--wa-space-l` | 1.25 | 20 |
| `--wa-space-xl` | 1.75 | 28 |
| `--wa-space-2xl` | 2.25 | 36 |
| `--wa-space-3xl` | 3 | 48 |

### 4c. Border radius

`$borderRadius` = **4px** (the app default). WebAwesome radius scale (pinned to Shoelace):

| Token | rem | px |
|---|---|---|
| `--wa-border-radius-s` | 0.1875 | 3 |
| `--wa-border-radius-m` | 0.25 | 4 |
| `--wa-border-radius-l` | 0.5 | 8 |
| `--wa-border-radius-xl` | 1 | 16 |

---

## 5. Form-control sizing

All `wa-button / wa-input / wa-select / wa-combobox / wa-textarea` read height + inline padding from pinned per-size tokens (`_webawesome.scss`):

| Size attr | Height | Inline padding |
|---|---|---|
| `xs` | 26px | 8px |
| `s` / `small` | 32px | 12px |
| `m` / `medium` (and no size) | 32px | 14px |
| `l` / `large` | 50px | 20px |
| `xl` | 64px | 24px |

> **`boss-*` wrapper standard:** default `size='m'` and `width:100%` (full-width). UX can assume form controls are full-bleed within their container at 32px tall unless a page says otherwise.

---

## 6. Z-index scale (`app/sass/_variables.scss`)

For UX awareness of stacking order (overlays, drawers, dialogs, toasts):

| Token | Value |
|---|---|
| `$z-index-nav-max` | 25 |
| `$z-index-standard` | 1050 |
| `$z-index-action-bar` | 10000 |
| `$z-index-drawer` | 10001 |
| `$z-index-dialog` / `$z-index-component-overlays` | 10101 |
| `$z-index-system-error-dialog` | 10102 |
| `$z-index-zoom-placeholder` | 10151 |
| `$z-index-toast-alert` | 10201 |
| `$app-top-level` | 11201 |

Layout dimensions: `$nav-sidebar-width` 200px, `$invoicenav-width` 250px, `$page-title-bar-height` 50px.

---

## 7. Component variant taxonomy (buttons)

The old Figma button matrix is Primary / Secondary / Tertiary-Flat / Danger / Link. In code (post-migration WebAwesome variants + `boss-button`), the mapping is:

| Old Figma name | Code variant | Fill |
|---|---|---|
| Primary | `brand` | `--wa-color-blue-50` (`#23408f`), white text |
| Secondary | `brand` outlined / `appearance="outlined"` | `#23408f` border, transparent fill |
| Tertiary / Flat | `neutral` plain / flat appearance | no fill |
| Danger | `danger` | `--wa-color-red-50` (`#fa1616`) |
| Link Button | link styling, color `--wa-color-blue-70` (`#49a4da`) | text only |

Sizes: Small / Medium / Large in Figma map to the form-control sizes in §5 (`s`/`m`/`l` → 32/32/50px). The migration also defines split buttons, decision-group buttons, view-details, and a WIP disclosure button (Priscilla, 6/12/26) — these are composites built from the base button.

---

## 8. Where to see all of this rendered live (no git needed)

RestaurantUI is hash-routed, so the style guide is reachable by URL in any running instance. Replace `<HOST>` with the dev server (`http://localhost:4000`) or the deployed RestaurantUI host. You can also reach it in-app via the account menu → **Style Guide V2**.

| Page | URL |
|---|---|
| Component catalog (landing) | `<HOST>/#/styleGuideV2/components` |
| Badge | `<HOST>/#/styleGuideV2/components/badge` |
| Button | `<HOST>/#/styleGuideV2/components/button` |
| Checkbox | `<HOST>/#/styleGuideV2/components/checkbox` |
| Combobox | `<HOST>/#/styleGuideV2/components/combobox` |
| Divider | `<HOST>/#/styleGuideV2/components/divider` |
| Input | `<HOST>/#/styleGuideV2/components/input` |
| Select | `<HOST>/#/styleGuideV2/components/select` |
| Split Button | `<HOST>/#/styleGuideV2/components/split-button` |
| UX Standards | `<HOST>/#/styleGuideV2/uxStandards` |
| Tokens (stub — this doc is its content, OR-11841) | `<HOST>/#/styleGuideV2/tokens` |
| Legacy v1 style guide (broad showcase) | `<HOST>/#/styleGuide` |

The v2 guide is the **parity oracle**: it is the surface QA and devs compare against Figma. Every component below renders there with a live playground.

---

## 9. Component catalog & APIs (exact Figma variant names)

These are the documented `boss-*` / `orderly-*` components and their real option sets. The string values are exact — use them verbatim as Figma variant property values so design and code share vocabulary.

### Shared enums (use these everywhere they appear)

- **Intent / color variant:** `brand` · `neutral` · `success` · `warning` · `danger`
  (maps to the color roles in §2a: brand→blue-50, neutral→gray, success→green-50, warning→orange-50, danger→red-50.)
- **Form-control size:** `xs` · `s` · `m` · `l` · `xl` → heights **26 / 32 / 32 / 50 / 64 px** (see §5).
  **Default = `m` (32px) and full-width** is the house standard for inputs/selects/comboboxes.
  ⚠ The in-app doc pages currently *label* some defaults as `xs`; that text is stale — the components actually default to `m`. Treat `m` as the baseline; the `xs` labels are a code-doc cleanup item, not a design decision.

### Button (`orderly-button` → `wa-button`)

| Property | Values | Default |
|---|---|---|
| `variant` | `brand` · `neutral` · `success` · `warning` · `danger` (legacy shims `primary`/`default`/`text` still accepted, deprecated) | `default`→ treat as `neutral`/`brand` |
| `size` | `xs` · `s` · `m` · `l` · `xl` (legacy `small`/`medium`/`large`/`icon` shimmed) | `medium` (→ `m`) |
| `outlineButton` | boolean (outlined appearance) | false |
| `pillButton` | boolean (fully rounded) | false |
| `circleButton` | boolean (icon-only round) | false |
| `caret` | boolean (dropdown caret) | false |
| `loading` | boolean (spinner) | false |
| `disabled` | boolean | false |

**When to use (verbatim):** "Reach for orderly-button for any action trigger: form submits, drawer opens, toolbar actions, link-style text actions, icon-only utility buttons. Don't use orderly-button for non-action navigation that should look like body text (use a plain anchor), or for toggle controls (use a switch / radio / checkbox)."
Maps to the old Figma button matrix per §7 (Primary→brand, Secondary→brand outlined, Tertiary/Flat→neutral plain, Danger→danger, Link→text/blue-70).

### Split Button (`orderly-split-button`)

| Property | Values | Default |
|---|---|---|
| `variant` | `brand` · `neutral` · `success` · `warning` · `danger` | `brand` |
| `size` | `xs` · `s` · `m` · `l` · `xl` | `medium` (→ `m`) |
| `dropdownPlacement` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` · `right` · `right-start` · `right-end` · `left` · `left-start` · `left-end` | `bottom-end` |
| `disabled` | boolean | false |

**When to use (verbatim):** "Reach for orderly-split-button when there's one dominant action plus a few closely-related variants of it — Save / Save as / Save all… The main button does the common thing; the caret reveals the rest. Don't use it for unrelated actions, or when there's no clear primary (use a plain dropdown)."

### Input (`boss-input` → `wa-input`)

| Property | Values | Default |
|---|---|---|
| `type` | `text` · `number` · `email` · `password` · `search` · `tel` · `url` · `date` · `datetime-local` · `time` · `positiveIntegers` · `positiveAndNegativeIntegers` · `positiveDecimals` · `positiveAndNegativeDecimals` | `text` |
| `size` | `xs` · `s` · `m` · `l` · `xl` | `m` |
| `appearance` | `filled` · `outlined` · `filled-outlined` | `outlined` |
| `pill` | boolean | false |
| `withClear` | boolean (clear ✕) | false |
| `required` / `disabled` / `readonlyInput` / `isInvalid` | boolean | false |
| `textAlignRight` | boolean | false |
| `passwordToggle` | boolean (show/hide eye) | false |

### Select (`boss-select` / `boss-multi-select` → `wa-select`)

| Property | Values | Default |
|---|---|---|
| `size` | `xs` · `s` · `m` · `l` · `xl` | `m` |
| `appearance` | `filled` · `outlined` · `filled-outlined` | `outlined` |
| `placement` | `top` · `bottom` | `bottom` |
| `pill` | boolean | false |
| `withClear` | boolean | **true** |
| `required` / `disabled` | boolean | false |

### Combobox (`boss-combobox` / `boss-multi-combobox` → `wa-combobox`, Pro)

| Property | Values | Default |
|---|---|---|
| `size` | `xs` · `s` · `m` · `l` · `xl` | `m` |
| `placement` | `top` · `bottom` | `bottom` |
| `multiple` | boolean (tags) | false |
| `allowCreate` | boolean ("Create <input>" option) | false |
| `maxOptionsVisible` | number (collapse tags after N; 0 = unlimited) | 0 |
| `withClear` | boolean | **true** |
| `disabled` | boolean | false |

### Badge (`boss-badge` → `wa-badge`)

| Property | Values | Default |
|---|---|---|
| `variant` | `brand` · `neutral` · `success` · `warning` · `danger` | `neutral` |
| `pill` | boolean | false |
| `attention` | `none` · `pulse` · `bounce` | `none` |

### Checkbox (`boss-checkbox` → `wa-checkbox`)

States: `isChecked`, `isDisabled`, `isIndeterminate` (all boolean). Note ag-Grid checkboxes render orange (`#fa9016`) per the table theme.

### Divider (`boss-divider` → `wa-divider`)

`orientation`: `horizontal` · `vertical` (default `vertical`); plus numeric `heightPx` / `widthPx` / `spacingPx`.

### Drawer (`boss-drawer`, still on `sl-drawer` — not yet migrated)

| Property | Values | Default | Notes |
|---|---|---|---|
| `placement` | `start` · `end` · `top` · `bottom` | `end` | |
| `size` | `small` · `medium` · `large` | `medium` | **width differs from form-control sizes — see below** |
| `type` | `primary` · `stacked` | `primary` | primary = first-level; stacked = drawer-over-drawer |
| `contained` | boolean (constrain to parent vs viewport) | false | |
| `removeMargin` | boolean (full-bleed content) | false | |
| `preventClickOutside` | boolean (block click-to-close for unsaved state) | false | |

**Drawer width by size** (note: `small/medium/large`, NOT the `xs..xl` form scale):
- Primary: small = `320px`, medium = `60vw`, large = `95vw`
- Stacked: small = `320px`, medium = `55vw`, large = `90vw`

**When to use (verbatim):** "Use bossDrawer when a workflow needs a focused secondary surface without leaving the current page… Choose primary for first-level drawers and stacked when one drawer opens over another. For full-page workflows use route navigation; for ephemeral confirmation use a modal or toast."

Other composites that exist (custom, not single WA wrappers — listed so Figma knows they're real components): `bossTable`, `bossForm`, `bossAddress`, `bossList`, `bossEmptyState`, `bossMoneyInput`, `bossMultiUnitSelector`, `bossRadioGroup`, `bossTextArea`, `bossTree`, `bossTupleInput`, `bossPageContent`, `bossHeaderInfo`.

---

## 10. UX Standards (full text — apply to every page/component)

> Source: the live UX Standards page (`<HOST>/#/styleGuideV2/uxStandards`). Page/component-specific requirements override these defaults, but the override should be documented with the feature.

**Page refresh behavior** — Refreshing should keep the user in the same context (same page focused). Tabs stay focused. Drawers may clear or close depending on the workflow (behavior must be defined per workflow). Minimize user frustration.

**Text fields** — Each field is tested for: minimum length; maximum length; permissible character types (letters, numbers, which special chars, spaces/tabs, leading/trailing whitespace); every control character ``@ # * / \ ( ) [ ] { } | ` ~ % ' " ; : < > - = + ? !`` tested individually; **emojis are not allowed**. String validation must use the `StringValidator` system — never inline regex, `pattern=`, `.match()`, or manual length checks.

**Dropdowns** — A dropdown with a single element auto-selects it. A non-required dropdown must include a **"None"** option so the user can undo a selection/filter.

**Calendar selectors** — Define how far into the future/past a date can be picked; if range buttons exist, the resulting ranges must match the buttons and the financial calendar; the calendar must update when the financial calendar changes.

**Click areas** — If a table row has only one clickable button/link, the entire row is clickable for that action. In a list with checkboxes/radios, clicking the text toggles the associated control.

**Search — four behaviors used on the site:**
- **Exact Match** — entries containing the exact word/phrase (the vast majority of search bars).
- **Or Match, best-match sorting** — entries containing at least one word, sorted best-match first (exact match on top). Used by **General Ledger**.
- **Or Match, no clear sorting** — entries containing at least one word, no apparent sort. Used by **Reports > Ingredient Pricing**.
- **Or Match, inconsistent alphabetical sorting** — at least one word, not best-match; sometimes alphabetical, sometimes only one search word's results. Used by **Reports > Local Market Pricing**. (e.g. "chicken beef" → all beef then chicken; "dairy beef" → beef only.)

**Page navigation:**
- *Tabbing:* all interactive elements reachable by Tab in a logical order (generally left→right, top→bottom); Shift+Tab goes backward; no keyboard traps; non-interactive elements can be skipped.
- *Enter:* one button on the page/drawer → Enter clicks it; multiple buttons with one CTA → Enter clicks the CTA; multiple equal-appearance CTAs with none emphasized → Enter clicks nothing.
- *Arrow keys:* must be defined per page and per table.
- *Ten-key (Num Lock off):* 8=Up, 2=Down, 4=Left, 6=Right, 7=Home, 1=End, 9=Page Up, 3=Page Down.

**Figma comparison checklist** (how a page is verified against design) — match window sizes, then check: exact wording of all text; component placement incl. margins/padding; colors; border width/color/radius; icons; font style/size/weight; interactions and flow. QA also flags inconsistent grammar/punctuation or confusing language.

---

## 11. ⚠️ Flags — where the old Figma library diverges from code

I sampled the **Buttons & Button Groups** canvas of the linked Figma library (node `5125-6582`) against the code. Findings:

1. **The values you sampled actually MATCH.** Primary `#23408f`, danger `#fa1616`, link `#49a4da`, white button text, Roboto 16px, spacing 8/16, radius 4 — all identical to code. So this is not a wholesale color mismatch; the divergence is structural.

2. **Naming taxonomy is a third, incompatible scheme.** Figma uses paths like `Color/Component Background/Button/primary-resting`, `Color/Content [Text & Icons]/button-primary`, `Color/Border/secondary-resting`, `Color/Alert/error`, `Color/Content [Text & Icons]/link-primary`. Code uses (a) `$brand-*` primitives and (b) the WebAwesome `--wa-color-{hue}-{tint}` semantic scale. **Recommendation:** retire the Figma per-component color paths and re-base Figma variables on the WebAwesome semantic model in §2a (hue + tint, key = 50). Keep component-level aliases only as references pointing at those.

3. **Tint-scale direction.** If/when Figma adds full tint ramps, they must follow WA's inverted convention (95 = lightest, 50 = key, lower = darker). See §0.

4. **`warning` must be orange (`#fa9016`), not yellow.** (§0, §2a.)

5. **Incompleteness.** The Figma library defines only a handful of variables (a few button colors, one "Medium Button" font, small/medium/radius spacing). It is missing: the full grey ramp, greens, oranges, the full 11-step spacing scale, the full type scale, form-control sizing, and z-index. The §2–§6 tables are the complete set.

6. **Variant naming.** Figma "Primary" = code `brand`. Plan the rename in component names/variants so design and code share vocabulary (§7).

7. **Link color is the 70 tint, not brand.** Links use `--wa-color-blue-70` (`#49a4da` / active-blue), distinct from the `blue-50` primary fill. Make sure Figma doesn't collapse these into one "primary blue."

8. **Deprecated type styles in code.** `.h1`–`.h8` are flagged for removal pending UX tokens — don't reverse-engineer them into Figma.

> I only audited the Buttons canvas in detail. If you want, I can sweep the rest of the Figma library (colors page, typography page, other components) variable-by-variable and produce a full per-token reconciliation table.

---

## 12. Engineering source-file map (repo access only — UX can ignore)

This table is for developers cross-checking values against code. UX does not need it — every value above is already written out in full.

| File | Owns |
|---|---|
| `RestaurantUI/src/app/sass/_colors.scss` | Primitive `$brand-*` palette + Material `$dark-blue-palette` |
| `RestaurantUI/src/app/sass/BrandColors.ts` | TS mirror of the palette (for component code) |
| `RestaurantUI/src/app/sass/external/_webawesome.scss` | **Semantic WA mapping, font/space/radius scales, form-control sizing + label standard** |
| `RestaurantUI/src/app/sass/external/_shoelace.scss` | Legacy Shoelace theme (coexisting, being retired) |
| `RestaurantUI/src/app/sass/_text.scss` | Type scale classes |
| `RestaurantUI/src/app/sass/_sizing.scss` + `Sizings.ts` | Spacing scale + radius |
| `RestaurantUI/src/app/sass/_variables.scss` | Z-index + layout dimensions |
| `RestaurantUI/src/styles.scss` | Global entry; Material theme; ag-Grid + Shoelace + WebAwesome wiring |
| `RestaurantUI/src/webawesome-imports.ts` | WebAwesome component registration |
| `RestaurantUI/src/app/pages/style-guide-v2/` | Living style guide (tokens page = OR-11841) |
