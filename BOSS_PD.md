# UX/UI Design Context & Directives for Claude
**Back Office — Design System & Craft Standards**
*Last updated: June 2026 · Incorporates Craft Standards Design Summit callouts*

---

## 1. Product & Domain Context

- **Product Name:** Back Office — restaurant management software for independent operators who need more than generic accounting and operations tools, with self-service support.
- **Target Audience:** Foodservice and restaurant operators across the United States and Canada — from independent single-location operators to large franchise networks and multi-concept enterprise groups.
- **Core Value Proposition:** bepbackoffice.com offers an all-in-one, industry-specific platform combining restaurant software with expert bookkeeping to reduce costs and boost profitability. The solution empowers operators by automating administrative tasks, managing inventory, and providing actionable insights through integration with 75+ POS systems.
- **Business Goal:** Empower restaurant operators by centralizing and automating daily administrative, financial, and operational tasks to drive greater efficiency and profitability.

---

## 2. UX Heuristics & Design Psychology

When designing, identify the user problem and business goal first — then justify your design decisions against these principles.

- **Cognitive Load:** Keep interfaces clean. Reveal information progressively; do not overwhelm the user.
- **Fitts's Law:** Make primary interactive elements (CTAs, primary buttons) large, easily reachable, and prominent.
- **Hick's Law:** Minimize user choices. Keep navigation and settings screens simplified and grouped by category.
- **Nielsen's 10 Usability Heuristics:** Always provide clear system status, match the real world, and give users easy "emergency exits" (e.g., undo actions).

---

## 3. Anti-Patterns & Forbidden Elements

Strictly avoid the following to maintain a high-quality experience:

- **Mystery Navigation:** Never hide core functionality behind obscure icons or gestures without labels.
- **Text Walls:** Break up dense information into scannable chunks, cards, or lists.
- **Distractive Elements:** Avoid heavy carousels, flashing banners, and auto-playing media unless explicitly required.
- **Dark Patterns:** No hidden fees, forced continuity, or tricky UX patterns.
- **Gratuitous Color:** Reserve brand/accent color for the single primary action on a screen (e.g. one CTA button). Secondary navigation — tabs, segmented controls, avatars, progress indicators — should default to a black/grayscale treatment, not the brand hue. Elsewhere, color must carry real semantic meaning (status, health score, trend direction, error/warning counts); don't add color for decoration alone.

---

## 4. Design Tokens

> **All values below are the canonical tokens used today.** OR-11841 will bind these to `--wa-color-*` CSS variables. Until then, the SCSS variable name (`$brand-blue`, etc.) is what's referenced in code. Designers should design against the hex values and the *semantic name* — engineers will pick up the right variable.

### 4.1 Colors

#### Brand — blues

| Variable | Hex | Usage |
|---|---|---|
| `$brand-light-bluish-grey` | `#f2f5fd` | Subtle panel tint |
| `$brand-lightest-blue` | `#f8f8fa` | Lightest surface (also `$brand-lightest-blue-background`) |
| `$brand-lighter-blue` | `#dee2ee` | Hover surface, secondary borders |
| `$brand-active-blue` | `#49a4da` | Active / focus accent |
| `$brand-blue` | `#0071ce` | Legacy/alternate accent — links, marketing; **not** used for Button component fills (see `$brand-darker-blue`) |
| `$brand-darker-blue` | `#23408f` | **Primary button fill** (Brand/Filled/Default state). Also used for headers (700 in Material palette) |
| `$brand-hover-blue` | `#002790` | Pressed / hover on primary |
| `$brand-secondary-hover-blue` | `#C8CFE3` | Secondary hover |

> **Resolved 2026-07-13:** `$brand-blue` and `$brand-darker-blue` previously had overlapping "buttons" usage notes. Confirmed `$brand-darker-blue` (`#23408f`) is the Button component's Brand/Filled/Default fill — matches the BO Design Library's Buttons & Button Groups reference exactly. `$brand-blue` (`#0071ce`) is not used there.

#### Neutrals — grays

| Variable | Hex | Usage |
|---|---|---|
| `$brand-black` | `#000000` | Body text base |
| `$brand-white` | `#ffffff` | Surface, button text on dark |
| `$brand-lightest-grey` | `#e8e8ee` | Subtle dividers |
| `$brand-lighter-grey` | `#cfd1d9` | Disabled surfaces |
| `$brand-light-grey` | `#9a9aa3` | Muted text |
| `$brand-medium-grey` | `#5e5e5e` | Secondary text |
| `$brand-grey` | `#484848` | Default text |
| `$brand-darker-grey` | `#5f6272` | Text grey (also `$brand-darker-grey-text-grey`) |
| `$brand-dark-grey` | `#d3d8e0` | Borders (also `$brand-border-primary`, `$brand-dark-grey-border-grey`) |
| `$brand-dark-silver-grey` | `#8d8d90` | Inactive (also `$brand-inactive`) |
| `$brand-dark-silver-grey-header-text` | `#868995` | Table header text |
| `$brand-grey-background` | `#e1e1e1` | Subtle background |
| `$brand-light-grey-background` | `#e5e5e5` | Light background |
| `$brand-active-state-grey` | `#f0f0f0` | Active row / selected list item |
| `$spec-dark-gray` | `#060d21` | Highest-contrast text |
| `$content-text-icons-body-primary` | `#18191D` | Body text primary |
| `$content-text-icons-body-secondary` | `#5F6272` | Body text secondary |

#### Status — semantic

| Variable | Hex | Usage |
|---|---|---|
| `$brand-warn` | `#fa1616` | Error / destructive |
| `$brand-warn-hover` | `#e60c0c` | Error hover |
| `$brand-darker-warn` | `#9a261c` | Error pressed |
| `$brand-warn-light` | `#fed0d0` | Error background |
| `$brand-green` | `#00a95d` | Success |
| `$brand-light-green` | `#e1e9d0` | Success background |
| `$brand-orange` | `#fa9016` | Warning / accent |
| `$brand-light-orange` | `#fee9d0` | Warning background |
| `$brand-darker-orange` | `#f08100` | Warning hover |
| `$brand-highlight` | `#ffffb3` | Yellow highlight (search match) |
| `$alert-green` | `#688f16` | Alert success |
| `$alert-orange` | `#ffc061` | Alert warning |
| `$alert-light-orange` | `#FFF2DF` | Alert warning background |
| `$system-blue` | `#698ff8` | Informational link (also `.moreLinkColor`) |

#### Surfaces — domain-specific

| Variable | Hex | Usage |
|---|---|---|
| `$drawer-background` | `#fcfdff` | Drawer / side panel base |
| `$table-background-grey` | `#f8faff` | Table zebra row |
| `$table-header-background` | `#F7F7F8` | Table header row |
| `$table-background-hover` | `#EDF6FB` | Table row hover |
| `$ag-grid-row-highlight` | `#FEF1E3` | AG-Grid highlighted row |

#### Marketing (legacy landing pages)

| Variable | Hex |
|---|---|
| `$marketing-blue` | `#336699` |
| `$marketing-red` | `#b33431` |
| `$marketing-dark-red` | `#8a322b` |
| `$marketing-orange` | `#d77138` |
| `$marketing-dark-orange` | `#b44e15` |
| `$marketing-lighter-grey` | `#ebebeb` |
| `$marketing-light-grey` | `#999999` |
| `$marketing-dark-grey` | `#555555` |
| `$markup-magenta` | `#E8178A` |

### 4.2 Spacing Scale

Orderly's spacing scale uses a social-distance metaphor naming convention. **Use the semantic alias** (`$spacingMedium`, `$spacingLarge`) when designing; metaphor names are legacy.

| Variable | Value | Semantic alias |
|---|---|---|
| `$bbfe` | `4px` | (`$borderRadius`) |
| `$bf` | `8px` | `$spacingSmall` |
| `$superFriends` | `12px` | — |
| `$closeFriends` | `16px` | `$spacingMedium` |
| `$closerThanIshFriends` | `20px` | — |
| `$closeishFriends` | `24px` | `$spacingLarge` |
| `$friends` | `32px` | `$spacingXL` |
| `$okayFriends` | `48px` | — |
| `$acq` | `64px` | — |
| `$dist-acq` | `72px` | — |
| `$stranger` | `128px` | — |

### 4.3 Typography

Primary type stack: **Roboto** (with `Roboto-Medium` for buttons). Sans-serif fallback.

| Token | Size |
|---|---|
| `$font-large-size` | `16px` |
| `$font-medium-size` | `14px` |
| `$font-small-size` | `12px` |

Common usage patterns observed in the codebase:

- **Page titles:** `22px` / `900` weight
- **Section headers:** `20px` / `500` weight
- **Body text:** `14px` / `400`
- **Button labels:** `0.875rem` (~14px) / `500` / `Roboto-Medium`
- **Captions / sub-text:** `14px` with secondary grey

### 4.4 Layout & Elevation

| Token | Value |
|---|---|
| `$borderRadius` | `4px` |
| `$nav-sidebar-width` | `12.5rem` |
| `$invoicenav-width` | `250px` |
| `$page-title-bar-height` | `50px` |

**Z-index layers** (high → low):

```
app-top-level             (system errors, blocking modals)
z-index-toast-alert       (toasts)
z-index-system-error-dialog
z-index-dialog            (modal dialogs)
z-index-drawer            (slide-in drawers)  ── 10001
z-index-action-bar        ── 10000
z-index-standard          ── 1050
z-index-nav-max           ── 25
```

Designers laying out an overlay should specify which "tier" it belongs to (toast / dialog / drawer / action-bar / standard) rather than picking a number.

---

## 5. Interaction & Handoff Guidelines

When asked to build or refine flows:

- Map out the entire user journey (e.g., Cart Review → Shipping → Payment → Confirmation) before providing pixel specifications.
- Consider and document edge cases (empty states, loading states, error handling) in your proposed solutions.
- Annotate designs with intended behavior: hover states, active states, focus rings for accessibility.
- Ensure all text and interactive elements pass WCAG AA accessibility standards (minimum 4.5:1 contrast ratio).

### Dev Handoff Best Practices *(Craft Standards Summit)*

These practices were aligned on across the 7+ product teams and should be followed for all dev-ready files:

- **Meet with devs before handing off** — do not drop a file without a sync.
- **Designer walks through the design** — no "pin and walk away." Designers run through their own designs in the handoff meeting; PMs do not narrate on the designer's behalf.
- **Handoff file state** — see Section 6 for what "Dev Hand Off" looks like in Figma vs. "Review Ready."

---

## 6. Figma File Organization Standards *(Craft Standards Summit)*

*Task Force owners: Sara, Priscilla, Liz (facilitated by Rosa Genert)*

### Naming Conventions (bare minimum)

- Use consistent, descriptive layer names — no "Frame 42" or "Group 7" in delivered files.
- Component names should match their token/code counterpart where one exists.
- Page naming convention: `[Status] Page Name` — e.g., `[WIP] Checkout Flow`, `[Review Ready] Invoice Detail`, `[Handoff] Order History`.

### File States

| State | Definition |
|---|---|
| **WIP** | Active exploration; not ready for review |
| **Review Ready** | Design is complete, annotated, edge cases documented, ready for PM/stakeholder/dev review |
| **Dev Handoff** | Specs finalized, redlines/tokens applied, assets exported, handoff meeting scheduled |

> **Open questions to resolve (Task Force):** What does "Review Ready" look like in Figma specifically? What does "Dev Hand Off" look like in Figma specifically? These definitions should be codified and added here once the Task Force aligns.

### Preparing a File for PM / Dev / Stakeholder Review

- Remove or hide exploratory frames not relevant to the review.
- Add a cover page or section label identifying what is being reviewed and what decisions are needed.
- Prototype links should be functional and tested before sharing.
- Annotate any non-obvious interactions or edge cases inline.

---

## 7. Component Governance *(Craft Standards Summit)*

*Component Task Force: Ross, Tyler, Priscilla*

The summit surfaced a need for cross-team alignment on component standards across 7+ products. Until formal governance is published, follow these working principles:

### Global vs. Local Components

- **Global components** live in the shared design system library and are maintained by the Component Task Force. Do not fork a global component without flagging it — open a discussion with the task force first.
- **Local components** are product-specific variants scoped to a single product file. Label them clearly (e.g., prefix with `[Local]`) so they are not accidentally promoted to the library.

### Building Components

- Build against the existing token set (Section 4). Do not introduce raw hex values or hardcoded spacing in new components.
- Document the intended states: default, hover, focus, active, disabled, error.
- If a global component nearly fits but not quite, document what is missing and bring it to the Component Task Force rather than creating a one-off.

### Maintaining Components

- When updating a component, communicate changes to all teams consuming it before publishing.
- Deprecate, do not delete — mark old variants as `[Deprecated]` with a migration note.

---

## 8. Design Critique Best Practices *(Craft Standards Summit)*

### Setting the Stage

Before presenting in a critique:

- State what stage the work is at (exploration, refinement, near-final).
- Identify what kind of feedback you need (directional, visual polish, edge cases, accessibility).
- Provide just enough context — who the user is, what they're trying to do, and what problem the design solves.

### Running the Critique

- Designer presents; critique is not a requirements review.
- Focus feedback on the user problem, not personal preference. Ground critique in the UX principles in Section 2.
- Time-box: no single design should dominate the session; use a facilitator if needed.

### Best Practices

- Take notes during the critique and capture action items before the session ends.
- Close with a decision or a clear next step — not just "good conversation."
- Follow up with a revised version or a documented rationale if a suggestion is not incorporated.

---

## 9. Claude Integration Guidelines *(Craft Standards Summit)*

Claude can support the design team across component building, file prep, critique documentation, and research synthesis. To get the best output, follow these principles.

### Be Extremely Specific

> *"Getting Claude set up — accounting for the text, the color, making sure it's pulling the right variables — be very specific."* — Craft Standards Summit

When prompting Claude for UI generation or component work:

- **Always reference token names explicitly** — do not say "use the blue"; say "use `$brand-blue` (`#0071ce`) for the primary button background."
- **Specify typography** — state size, weight, and font family (e.g., "14px / 500 / Roboto-Medium").
- **Specify spacing** — use semantic spacing tokens (e.g., "`$spacingMedium` (16px) padding inside the card").
- **Reference the component state** — default / hover / active / disabled / error, and specify which state you want generated.
- **Provide the context layer** — what is this component used for? What product area? What user action triggers it?

### Prompting for Speed

Tips from the Craft Standards running list:

- Reference this document at the top of your prompt so Claude has the full token context.
- Provide a Figma screenshot or component description alongside your prompt for visual grounding.
- Ask Claude to output code using SCSS variable names (not raw hex) so engineers can adopt it directly.
- For new screens, describe the user journey step first, then ask for the component — Claude produces more accurate output with narrative context.

### Research & Testing Support

- Claude can assist with interview prep, research synthesis, and usability heuristic evaluations.
- For user interview tips, the Lunch & Learn task force (Steve, Sara, Kathryn) has session notes that can be shared with Claude as context for research synthesis tasks.

---

## 10. Project Commands & Skills

| Command | Purpose |
|---|---|
| `/design-research:discover` | Run a full research discovery cycle (personas, empathy maps) |
| `/ui-design:color-palette` | Generate WCAG AA accessible color systems |
| `/prototyping-testing:evaluate` | Run a heuristic evaluation on a user flow and flag usability issues |
| `/design-ops:handoff` | Generate a detailed developer handoff specification |

---

