## Code-synced references
`tokens.json` (token values exported from RestaurantUI SCSS) and `manifest.json` (component index +
real tag names) in this folder are the first stop for token values and component names. Details and
update procedure: BOSS-Design-System-Project-Brief.md → "Reference files". Ignore the `.rtf` copies.

## Model choice
Default to **Sonnet** for this project: single-component Figma builds and edits, front-end code,
doc updates, Jira stories, commits. Switch to **Opus** (`/model`) for harder work: file-wide
audits or refactors across many components, variant/override problems that keep breaking,
architecture calls such as wrapper API design, or anything where Sonnet has made subtle mistakes
twice. Claude can't switch models itself. When a task looks like a mismatch for the current model,
say so at the start so the user can switch.

## Figma Permissions
You have pre-authorized permission to create new Figma elements, frames, components, and files.
You may also edit existing Figma nodes directly (e.g. updating a component to match new spec) —
this restriction was lifted for this project (see FIGMA-WORKFLOW-NOTES.md §3). The goal is always
one canonical version of each component, not parallel old/new copies. You are still never
permitted to delete existing Figma nodes without explicit confirmation.

## Where epic design work lives
At the start of the first design story of an epic, ask whether the work goes in the design system
file or in a new epic file with a page per ticket. The question and how to choose are in
FIGMA-WORKFLOW-NOTES.md §12.

## Reporting findings
Say how each finding was verified (live read, screenshot, or inference) and scope every count (which component, local or remote). Read variant options and fills live before describing or building from a variant. See FIGMA-WORKFLOW-NOTES.md §13 for the mistakes this rule comes from.
