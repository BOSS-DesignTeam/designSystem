# BOPD-42 Period close: decisions

Updated 2026-11-18. First compiled 2026-10-15 from the "Decisions to confirm", "Open" and "Open questions" notes in
`COMPONENT-STATUS.md`, for the old epic file `zbs8jTlxXJzIXwFhJE0G8b`. That file is superseded. The designs now live in
**Period Close – Designs** (`EqTRvuzLa6XppX82bd613h`), which the ticket links, and each story's Figma page is named
below. Tick a line when it is decided and update the page.

Sources for this update, and how each was checked:
- The BOPD-42 description, read live on 2026-11-18. It was last edited at 14:45 ET that day.
- Tim Thornburgh's answers on BOPD-42, read live on 2026-11-18. They are comments 1128430, 1128431, 1128433 and
  1128434, posted 2026-11-17.
- The Figma review comments applied on 2026-11-17 and 2026-11-18. These come from the session notes; the Figma file
  wasn't re-read today.
- Whether each 10-15 item is settled or superseded is my reading of the ticket text, so it is inference. Items marked
  **Confirm** need someone to agree.

The design stories BOPD-1110 to BOPD-1119 are still listed in the epic, but a Jira search on 2026-11-18 didn't return
them. Their current titles weren't checked.

## Changed in the ticket since the designs were drawn

The ticket was rewritten between 11-11 and 11-18. I compared today's text with the copy read on 11-11. The designs
still use the old wording.

- [x] **"Soft close" is now "closing".** AP and the GL are each open, closing or closed. Relabelled 2026-11-18 in
      round-5 sections on 9 pages (copies of the latest version of each frame), and in place in the two prototypes so
      their links still work. The buttons say "Start closing AP" and so on, and the badges say "AP: Closing".
- [x] **Permission names are final:**
      - Manage period close (`ManagePeriodClose`). Holders are called closers.
      - Post during AP closing (`PostDuringAPClosing`).
      - Post during GL closing (`PostDuringGLClosing`).

      Copy that said "AP soft close holder" or "soft close permission" now uses these names (same round 5).
- **Permissions are granted through roles.** On 11-11 the ticket said they weren't tied to roles. No existing role
  includes them by default, and internal admins have all three. This is a note only.
- **The bulk GL date change has three options:** each invoice's date, the last day of a period, or one chosen date.
  This matches Tim's answer on "Last day of P3" below.
- **"Move posting" is in scope.** The "Not included yet" item about changing how unapprove and edit write to the
  ledger now makes an exception for it (BOPD-1363).

## Decided since 10-15

### Tim's answers (BOPD-42 comments, 2026-11-17)

- [x] **Calendar changes are blocked** (BOPD-1099, design story BOPD-1119).
      - A change is rejected if it would move the boundaries of any period that is closing, closed or reopened at any
        location in the group. The message names the locations and periods.
      - The override needs no new permission. Internal admins have every permission and can override with a required
        reason.
      - The override is logged for each location. It sets the changed-after-close flag on the affected periods and on
        every later closed period.

      Drawn 11-17 on the Financial calendar guardrails page, section 79:2863.
- [x] **Move posting is in scope** (BOPD-1363, design story BOPD-1115). For an approved invoice, it reverses the GL
      posting and reposts it on the new date without editing the invoice. In bulk, it uses the same preview, the same
      period rules, and the same changed/skipped summary.
- [x] **"Last day of P3" stays, labelled with the real period and date,** for example "Last day of P3 (Mar 31)". It
      defaults to the period selected in the filter (BOPD-1363). Drawn 11-17 on the AP bulk GL date change page,
      section 79:1502.
- [x] **A location without AP shows "Not Applicable"** in the group view's AP column. It doesn't say "Not used", and
      the column isn't hidden. It doesn't block the close (BOPD-309). Drawn 11-17 on the Close dashboard – Group page,
      section 79:674.
- [x] **Closed-period dialog defaults** (BOPD-1355):
      - Closers default to "Post just this change to the closed period".
      - Non-closers see only "Post to the current period" and Cancel. The date is the first day of the period by
        default, or today, or a chosen date.

      Drawn 11-17 on the Dialogs page, section 79:2570.

### Design decisions from Figma review comments (2026-11-17 and 2026-11-18)

- [x] **Badges are Outlined,** not Accent or Filled ("do away with primary colors"). This replaces the 10-13 note under
      BOPD-1110.
- [x] **Status columns in tables are plain text,** with no badges or icons.
      - The cell shows the status as the badge read it, without an "AP:" prefix.
      - A secondary status, such as "Changed after close", goes in supporting text.
- [x] **Check results beside the Override button are plain labels** (Failing, Passing, Overridden), not badges.
- [x] **Tables use the DS 0.1 BOSS Flexible table,** matching the OR11160 tables: a 48px Report-density header and 43px
      Standard rows. Every page was converted on 11-18.
- [x] **Period Close sits under General Ledger in the Accounting nav.** The order is Period Close, Transactions, General
      Ledger, Trial Balance, Starting Balances.
- [x] **The page background is the usual white** (`color/surface/default`).
- [x] **The calendar's "Override and save" is a Brand button,** not Danger.
- [x] **Reports show changes as plain text, not badges,** and change amounts link to the transactions.
- [x] **The "Moved from P3" badges are gone** from the GL transactions list.

## Still open

### New since 10-15

- [ ] **P3 end date.** The designs assume P3 ends on 03/31/2027, with P2 running 02/01 to 02/28. If the real calendar
      is 4-4-5 or another week-based calendar, the dates differ and the screens need re-dating.
- [ ] **AP prototype, row B drawer copy.** Row B is the closer or "Post during AP closing" path. I wrote this copy
      myself, because the file only had the version for someone without the permission.
- [ ] **Bulk prototype selection is assumed:**
      - After Change GL date, only the skipped invoice stays selected.
      - After Move posting, the selection clears.
- [ ] **Two places where I interpreted Tim's answers:** the calendar override callout wording, and closed-period dialog
      6 defaulting to "First day of P4".
- [ ] **Green success text fails contrast.** `color/text/success` is 3.07:1 on white, below WCAG 2.1 AA, and the
      library needs a darker value.
      - It still fails on "Nothing blocking", "Ended 03/31/2027" and the filled "Passing" badges.
      - Fix these before handoff.
      - The gap is recorded in the Brief's accessibility known gaps.
- [ ] **DS 0.1 table gaps:**
      - There is no select-all header cell. A Content Cell stands in for it.
      - The cell fill hides the Selected row state.
- [ ] **BOPD-1355 and BOPD-1363 haven't been read in full.** Tim's answers quote them.

### Cross-cutting (from the 10-15 list)

- [x] **Who can sign off AP and Payroll: superseded.** There is no sign-off per module. Closers control every lock.
      Payroll has no check, only an info card with the last payroll distribution. (BOPD-1111, 1115, 1116)
- [ ] **Shared bank accounts: mostly settled by the ticket.**
      - Accounts can be shared only between locations with the same FEIN.
      - When one location closes, the others can still approve the reconciliation report.
      - A location reopens only its own period, and Bank Rec entries on a shared account are single-location.

      Still open: whether the same-FEIN rule is enforced today (engineering, BOPD-308). (BOPD-1111, 1116)
- [ ] **Confirm: reasons have no minimum length.** The ticket requires a free-text reason for corrections, reopens and
      check overrides, and Tim's answer adds the calendar override. None of these states a minimum. The 10-character
      minimum for reopen (BOPD-1113) has no basis in the ticket.
- [x] **Post-period-end adjustment: superseded by the changed-after-close flag.** The flag is informational and the
      period stays closed. It links to the post-close changes report. Only closers clear it, and clearing is logged.
      (BOPD-1114, 1117)
- [ ] **Who can reopen, approve or re-date: mostly settled.**
      - Reopening and correcting are for closers only.
      - "Post during AP closing" holders move AP items with the bulk GL date change.
      - The closed-period dialog shows only the options the user may use.
      - There is no approval queue (see BOPD-1114).

      Still open: whether other screens hide or disable an action the user lacks permission for. (BOPD-1113, 1114,
      1115)
- [x] **Notifications: settled.** Alerts appear on the close dashboard, and there is no separate notification system.
      (BOPD-1114)

### BOPD-1110 States and messaging pattern (page: State pattern)
- [ ] Tooltip on a disabled control: dev check needed
- [ ] Callout limited to one action; 993px default width
- [ ] Dev review of the copy (BOPD-304 error / hold table)
- Decided 2026-10-13: callout banners keep status colours, and the Badge End icon stays.
- Changed 2026-11-17: badges are Outlined, not colourless, and table statuses are plain text (see above).

### BOPD-1111 Close dashboard: location view (page: Close dashboard – Location)
- See cross-cutting: sign-off is superseded, and shared bank accounts are mostly settled.

### BOPD-1112 Close dashboard: group view (page: Close dashboard – Group)
- [ ] Which period a row shows: the oldest period not yet closed, or one fiscal period. The ticket doesn't say.
- [ ] Do users see only the locations where they are a closer?
- [ ] Do Closed locations (formerly Sealed) hide once nothing urgent is left?

### BOPD-1113 Reopen, needs review, re-verify (page: Dialogs)
- [ ] Reason minimum of 10 characters. See cross-cutting.
- [ ] **Confirm dropped:** the two-step flow for a non-latest period. Periods close in any order and reopen on their
      own, and automatic reopening of later periods is out of scope.
- [x] **Superseded:** re-verify with a confirm checkbox. The ticket has no needs-review or re-verify state; the
      changed-after-close flag replaces it.
- [ ] No button, rather than a disabled one, without the permission. This is settled for the closed-period dialog,
      which shows only the options the user may use. It's still open for other screens.
- Deferred, and confirmed by the ticket's "Not included yet": automatic reopening of later periods.

### BOPD-1114 Closer approval queue and notifications
- [x] **Mostly superseded.** The ticket has no closer approval queue and no notifications.
      - Unapproved transactions block the close.
      - Integration postings and recurring journal entries arrive unapproved in the first open period, with a
        dashboard alert.
      - A separate reviewer and approval levels are "Not included yet".

      These 10-15 items fall away unless the story still covers a queue: the nav count and whether it updates live,
      single and bulk approve, closers approving their own items, re-dating rules, waiting time, one queue per location
      and period, Bank Rec and Inventory pending types, and a notice to the item's owner.

### BOPD-1115 AP screens (pages: AP screens, AP bulk GL date change)
- [ ] The banner is Warning only for a closer while AP is closing, and Neutral otherwise.
- [x] **Superseded:** a non-closer edits only their own pending items. There is no pending state. While AP is closing,
      other users' new AP items get the first open AP date.
- [x] **Settled:** image upload when AP is closed. Attachments can be added in any period, including a closed one.
- [x] **Superseded:** Mark AP ready. There is no "ready" step. Closers start closing and close the period, and
      unapproved transactions block the close.
- [x] **Superseded:** aging includes pending items. There is no pending state.
- [ ] **Confirm:** voiding once AP is closed goes through the closed-period dialog. In a closed period, only closers
      make changes, one confirmed correction at a time, and everyone else needs a reopen. Reallocating AP payments in a
      closed period is "Not included yet".
- [ ] **Reword, still open:** a payment run that includes invoices dated in an AP period that is closing or closed.
      The 10-15 question was about pending invoices.
- [x] **Settled:** only closers can reopen a period.
- [ ] Screens not in the story list

### BOPD-1116 Payroll, Sales, Bank Rec, Inventory (page: Sales, Bank Rec, Inventory)
- [x] **Settled:** states per module. There are no per-module closes; everything that isn't AP follows the GL.
      Per-module closes are "Not included yet".
- [ ] **Partly settled:** report approve and unapprove while the GL is closing.
      - Sales: approve, unapprove and saving a draft are limited to "Post during GL closing" holders and closers.
      - Bank Rec: approving a reconciliation report doesn't write to the ledger on its own, and the ticket doesn't say
        who may approve one while the GL is closing.
      - Once the period is closed, any Bank Rec change to the location's own books needs a reopen.
- [ ] Locked report label and the Reopen path
- [x] **Superseded:** Payroll and Sales mark ready while entries are pending. There is no "ready" step.
- [x] **Superseded:** the Payroll dialog wording about the provider. Payroll has no check. A late payroll posting
      arrives unapproved in the first open period, with an alert.
- [ ] Real screens. The Sales $0 day and the blocked Bank Rec entry were drawn on 11-13. Payroll and Inventory are
      still state sheets (from the 10-15 note, not re-checked).

### BOPD-1117 Journal entries (page: Journal entry screens)
- [x] **Settled:** dates in a closing or closed period.
      - While the GL is closing, someone without "Post during GL closing" can't save a journal entry in that period
        and is offered the first open date. Holders and closers can save it.
      - A closed period takes only a closer's correction.
- [x] **Superseded:** held entries in a closed period. Recurring entries and integration postings arrive unapproved
      in the first open period, so nothing is held in a closed one.
- [x] **Settled:** system year-end entries show no actions. They are created by the system and kept up to date
      automatically. Drawn 11-13 with a "System entry" badge and no checkbox.
- [ ] Label filter besides Status
- [ ] **Confirm:** the UI name of the year-end entries. The ticket says "year-end closing entries (Income Summary and
      Retained Earnings)", and the design says "System entry".
- [ ] Approver shown in the list or only in the detail
- Dependency: no period-aware date picker exists (frame 1 is a workaround)

### BOPD-1118 Period close reports (page: Reports)
The ticket defines three reports: First-close snapshot, Close activity report, and Post-close changes report.
- [ ] Entry points. Partly settled: the changed-after-close flag links to the post-close changes report. The menu and
      history entry points are still open.
- [x] **Superseded:** version numbering (1a and 1b). There are no versions, and trial balance versions are "Not
      included yet". Year end has before-closing and after-closing views.
- [ ] Sign convention
- [x] **Superseded:** compare opens latest against previous. The snapshot is compared with current balances.
- [ ] Re-run label and net effect. Year-end re-runs are an engineering follow-up (BOPD-1103).
- [ ] The post-close changes report (formerly the adjustments report) covers every location the user can see
- [ ] Who may see the reports
- [ ] Drill-down to what changed is now in the ticket for the snapshot. Check that it's drawn.
- [ ] Not drawn: the empty state for periods closed before snapshots shipped (from the 10-15 note, not re-checked).

### BOPD-1119 Financial calendar guardrails (page: Financial calendar guardrails)
- [x] **Settled:** block when any location is closing, closed or reopened in the range (Tim's answer above).
- [x] **Settled:** the override is not its own permission. Internal admins override with a reason.
- [ ] Reason minimum length. See cross-cutting.
- [ ] Closing periods listed as keeping their state
- [ ] 53-week years have no screen
- [ ] Entries in a closing period that fall outside it after the change

## Design work left (not decisions)

- Earlier sections and the original frames still say "soft close". They're kept as history; the round-5 sections are
  current.
- The old App sidebar is still on the AP, GL, Sales and Reports screens. The dashboards use the new nav.
- The pagination footers in the converted tables are still hand-built.
- The answered Figma comments still need resolving in Figma.
