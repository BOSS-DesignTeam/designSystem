# Component Build Order

Living checklist of Figma design-system components: what's done, what's left. Full historical
build detail (Figma node/page IDs, per-component decisions, drift notes) stays in
[BOSS-Design-System-Project-Brief.md](./BOSS-Design-System-Project-Brief.md) — this file is just
the checklist, and should stay short enough to scan in a few seconds.

## Done

- Button, Split Button, Input, Select, Badge/Tag, Checkbox, Divider
- Radio, Switch, Tooltip (2026-07-20, via the Atomic Design pass)
- Dropdown Trigger + Dropdown Item (page `468:2`, Dropdown Item added 2026-09-08)
- Accordion (2026-07-30)
- Alert Banner (2026-08-14) — no native `wa-alert` tag exists in the real WA kit; closest
  primitive is `wa-callout`, unconfirmed for dev handoff
- Dialog (page `934:6`, ComponentSet `934:427`) — renamed from Modal 2026-09-08 to match
  WebAwesome's own naming (`wa-dialog`)
- Tabs (2026-09-08) — Tab / Tab Panel / Tab Group, page `3900:2`
- Toast (2026-09-17) — Toast Item, page `4381:162`

All 6 "(Steve)" components are published with Code Connect mappings applied — see the brief's
Publish & Code Connect audit section for which ones and the details.

## Remaining

1. **Popover** — WA: `wa-popover`

Added 2026-09-08 per a Figma-vs-WebAwesome component gap review, alongside Tabs and Toast (both
now done above) — all three flagged as high-value gaps since they show up constantly in a
back-office app.
