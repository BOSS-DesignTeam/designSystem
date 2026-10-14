# Period close epic (BOPD-42): handoff

Written 2026-10-14, end of day. Pick up from "Next steps" at the bottom. Everything below was checked against the Figma file or Jira during the session unless it says otherwise.

## Where everything is

| What | Where |
|---|---|
| Epic design file | "BOPD-42 Period close", key `zbs8jTlxXJzIXwFhJE0G8b` (Buyers Edge Platform org plan) |
| Design system file | key `B5j3nfocmShiBwqwy9dNXg` (Back Office Design System 0.1) |
| Jira | cloudId `5ab67c95-bdac-4466-931d-f5aa3c8f435b` (diningalliance.atlassian.net). The buyersedgeplatform hostname is not granted. Use a JQL search (`key = BOPD-1114`); `getJiraIssue` once hung |
| Per-story notes | The last frame of every story page is a "notes and gaps" frame: coverage, decisions to confirm, open questions, component gaps, what dev should take |
| Repo docs | `COMPONENT-STATUS.md` (entry per story, BOPD-1110 to 1119), `FIGMA-WORKFLOW-NOTES.md` (sections 12 to 14b are this epic's lessons), this file |

### Pages in the epic file

| Page | Node id | Story |
|---|---|---|
| Cover | `0:1` | Ticket list, statuses updated 2026-10-14 (does not list the assembled page) |
| BOPD-1110 Period close states and messaging pattern | `12:2` | Local copies of Period Status Badge (`12:240`) and Locked Marker (`12:255`) |
| BOPD-1111 Close dashboard: location view | `1:47` | Seven states; v1 row kept for comparison, v2 row is current |
| BOPD-1112 Close dashboard: group view | `23:2` | Holds the local `Table Cell Content` (`23:3525`) used by every table |
| BOPD-1113 Reopen, needs review, re-verify | `30:2` | |
| BOPD-1114 Closer approval queue and notifications | `35:713` | Frames 1 to 9 |
| BOPD-1115 AP screens | `49:2` | Frames 1 to 11 |
| BOPD-1116 Payroll, Sales, Bank Rec, Inventory | `53:2` | Frames 1 to 8 |
| BOPD-1117 Journal entries | `58:2` | Frames 1 to 5 |
| BOPD-1118 Period close reports | `62:2` | Frames 1 to 6 |
| BOPD-1119 Financial calendar guardrails | `66:2` | Frames 1 to 3 |
| Assembled page: Period close, location view | `71:2` | Full page `71:3`; annotated copy `76:1647` with numbered regions; legend `76:2519` |

The assembled page is the location close dashboard in soft close with every blocker at once: nav count, header and banner, module readiness with sign-off, seal checks, pending summary, queue preview, earlier periods (needs review, reopened, sealed), reports and period history. Numbers on the annotated copy map each region to the story that designed it. It is a composition of the stories' designs, not a new design: where a story's frame and this page differ, the story's frame wins.

## State of the work

- **All ten design stories are drawn** (BOPD-1110 to 1119). Nothing has been published, transitioned in Jira, committed, or reviewed by dev or product.
- **Verification level:** every frame was checked by screenshot after the last change. Component behaviour was read live from the library, not from the brief. Business rules come from the Jira stories BOPD-303, 304 to 311, 1099 to 1103 and 1114 to 1119 as read on 2026-10-14.
- **Not verified:** the screen inventory for Payroll, Sales and Inventory (BOPD-1116). Only Bank Rec was read from a saved page (`Back Office_Bankrec.html`); the rest is inferred from the navigation and GL transaction types and is labelled "Inferred" on the page. Dev has not confirmed it, which that story's acceptance criteria require.
- **Figures** in the screens are examples. The BOPD-1118 trial balance balances and its version 1 to version 2 change ties to the changes report.

## The fix pass (the user said: build everything, then fix at the end)

This touches many components, so run it on Opus (CLAUDE.md: file-wide work across many components).

### Library components to fix (design system file)

| Component | Problem found | Seen in |
|---|---|---|
| Table Cell Content (local copy on the BOPD-1112 page) | Slot keeps a placeholder text to delete on every use; slot width goes stale after the cell width changes (toggle FIXED then FILL). Needs to go into the library as a Table Cell type (Type=Content already exists in the DS Table Cell set, but the epic file still uses the local copy until Table Row is republished) | every table |
| Table Row (Standard) | Fixed 7-cell template; nested cells only accept Fill; Text + Sub Text cell is 50px against 43px | 1114, 1117, assembled page |
| Table Row (Report) | Built for the profit and loss report; three groups of a Pair and a 94px variance cell; the Variance property controls all variance cells; header labels truncate near 14 characters; rows cannot hold a Badge | 1118 |
| Table Toolbar | One bulk-action button ("Mark as Paid") | 1114 |
| Dialog | Footer buttons ship with a star icon and no label property; title does not wrap; no scroll area | all dialogs |
| Field Message | Text does not wrap (instance override works) | 1114, 1115 |
| Empty State | Subheading does not wrap; inner wrapper is 516px wide and clips | 1114 |
| Status Row | Action slot ships two placeholder buttons; title truncates near 28 characters; detail does not grow the row | 1115, 1116 |
| Checklist Item | With Link shows a placeholder that overlaps, no text property | 1115 |
| Callout | Neutral icon is a gear; one action only | everywhere |
| Button | Disabled state has no Tooltip | 1115 to 1117 |
| Date Input and Date Calendar | No period state; no message of its own. A period-aware date picker is the dependency named in BOPD-1117 | 1117 |
| Badge | No Source or kind variant (Neutral Filled-Outlined plus an icon used) | 1114, 1117 |
| Textarea | No label, value, help or error properties | 1113, 1119 |
| Single Select with Listbox | Shows four options and sits on top of its own field | 1114 |

### Publishing (manual in Figma)

- Changed or new in the DS file and not yet published: Checklist Item, Status Row, Card, Table Row (carries Table Cell and Table Header Cell).
- Period Status Badge and Locked Marker live only in the epic file (moved there 2026-10-14 by decision). Do not republish them to the DS file.
- After publishing, the epic file's overrides and local copies can be removed.

## Decisions waiting on product and dev

About 40, listed on each story's notes frame. The ones that change the most:

1. **Notification approach (BOPD-1114):** nav count, queue and module filter now, email digest later. Has not been reviewed with dev and product, which the story requires.
2. **Mark ready blocked while items are pending** (AP, Payroll, Sales fallback): approval is off once a module is signed off, so pending items could never be approved.
3. **Image upload while AP is signed off:** BOPD-311 says it is always allowed; BOPD-309 blocks all new AP transactions once marked ready.
4. **Bulk approve:** no cap, with a confirmation showing count, total and blocked items.
5. **Post-period-end adjustment label on every module,** not only journal entries (BOPD-1102 says JEs).
6. **Closers may re-date POS imports?** Accounting may want to forbid it.
7. **Bank Rec report approve and unapprove** in soft close open to everyone.
8. **GL date picker blocks sealed dates,** BOPD-1102 only asks it to indicate the state.
9. **Calendar override as its own permission,** and what happens to entries in a soft close period whose dates fall outside it after the change.

Open questions with no answer in the stories: who can sign off AP, Payroll and Sales (no permission named in BOPD-306, 307, 309); who may see the reports (BOPD-1118); real screens in Payroll, Sales and Inventory; shared bank accounts (BOPD-308); the 53-week year has no screen (BOPD-1099).

## Not done

- No Jira transitions, comments or new stories. Dev follow-up stories for the fixes above do not exist yet.
- Nothing committed to git. Modified and untracked at the end of the session: `COMPONENT-STATUS.md`, `FIGMA-WORKFLOW-NOTES.md`, this file, and the earlier `BOSS-Design-System-Project-Brief.md`, `CLAUDE.md`, saved HTML pages.
- `BOSS-Design-System-Project-Brief.md` and `manifest.json` were not updated for the new components or states. The brief lags the file in places (it did on Button appearance names).
- Code Connect not touched.
- The old v1 BOPD-1111 row and the archived Alert page were kept, not deleted.

## Build gotchas (so tomorrow does not rediscover them)

Full recipes are in `FIGMA-WORKFLOW-NOTES.md` sections 14 and 14b. The ones that cost the most time:

- Table Row: edit cells by index first, hide columns last, set Fill after hiding; hidden nodes drop out of `children`.
- Report rows: never hide a variance cell with `.visible`; it switches off all of them.
- Table Cell Content slot: toggle its sizing FIXED then FILL after any width change.
- A script that throws rolls back fully; throw on purpose at the end of a probe.
- Nodes appended into a Card slot get new ids; find them again through the stage frame.
- Use real instances, check `get_libraries` first, read variant options live (CLAUDE.md and memory).

## Next steps, in order

1. **Review the assembled page** (`71:2`) with the user and fix whatever reads wrong. It is the best single thing to put in front of product and dev.
2. **Send the BOPD-1116 screen inventory to dev** to confirm or correct. Until then that story is not done by its own criteria.
3. **Run the notification approach and the nine decisions above past product and dev;** record the answers on the notes frames.
4. **Do the library fix pass** in the DS file (table above), then ask the user to publish, then remove the epic file's local copies and overrides.
5. **Update the brief and `manifest.json`** for what changed (Table Cell Content type, Status Row, Checklist Item, Card slot, Dialog slot, state badges), then offer the doc edits as the user prefers.
6. **Create the dev stories** for the component fixes and for each screen group, and move the nine Jira design stories as the user decides.
7. Commit the doc changes when the user asks.
