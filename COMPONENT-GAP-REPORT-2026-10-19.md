# Component gap report: Style Guide v2 vs WebAwesome vs Figma 0.1 vs old style guide

Date: 2026-10-19

## Sources and how each was verified

| Source | What it is | Verified by |
|---|---|---|
| **Style Guide v2 (current)** | qe2 `#/styleGuideV2` saved as `styleguideV2/Back Office.html` (25 component pages + 1 utility) | Live read of the saved page's sidebar (links, status, tier) |
| **WebAwesome** | webawesome.com/docs/components index | Live fetch 2026-10-19 |
| **Figma 0.1 (new)** | file `B5j3nfocmShiBwqwy9dNXg`, "Back Office Design System 0.1" | Live read: all page names (about 70), plus the component sets inside the Organizational Tree and BOSS Table pages. Other pages' contents were **not** opened, so a component hiding inside another page would be missed. |
| **Old style guide** | legacy v1 `#/styleGuide` (componentShowcase, directive guide, playgrounds) | Read from the orderly master snapshot (Oct 2, `3657a07ecec`). Not re-read from qe2, so it may have changed. |

Counts below are scoped to the source named. "No page" means no page of that name in the source, not "does not exist anywhere".

## 1. Style Guide v2 vs Figma 0.1

**In v2, no Figma page (4):**
- Copy Button (v2: experimental, minimal)
- Document Viewer (v2: experimental, standard)
- Document Strip (v2: experimental, minimal)
- Report Tree (v2: experimental, minimal). The Organizational Tree page holds only Tree Item and Tree. The archived Reporting Table page was not searched.

These four are the newest v2 pages and none has a design.

**In v2 and in Figma (21):** Badge, Breadcrumb, Button, Callout, Checkbox, Combobox, Dialog, Divider, Dropdown, Input, Radio, Select, Spinner, Split Button, Switch, Tag, Textarea, Toggle, Tooltip, Tree, and Details (Figma name: Accordion, inferred from the WA Details base).

**In Figma, no v2 page (designed, not documented):**
- Tabs, Card, Popover, Toast, Drawer, Accordion/Details naming
- BOSS Table, Floating Action Bar, File Upload
- Progress Bar, Quantity Selector, Icon Button, Split Panel, Skeleton, Empty State
- Search Bar, Filter Drawer, Date Input, Money Input, Numeric Set Input, Address, Form
- Field Message, Checklist, Icons, Animations
- Radio Group is covered by the v2 Radio page (alias).

## 2. WebAwesome vs v2 and Figma

**WA component, in Figma, no v2 page:** Tab Group, Card, Popover, Toast, Drawer, Progress Bar, Number Input (Quantity Selector), Split Panel, Skeleton, Date Input / Date Picker, File Input, Data Grid (BOSS Table).

**WA component, in neither v2 nor Figma:**
- Likely relevant: Avatar, Carousel, Scroller, Button Group (deprioritized to last), Progress Ring (back of the line), Page (story filed: BOPD-877), Pagination (exists only as Table Pager), Stepper, Slider, Rating, Tag Input, Time Input, OTP Input, Checkbox Group, Color Picker.
- Probably not relevant: charts, QR Code, Video, Video Playlist, Zoomable Frame, Markdown, Comparison, Animated Image, and the observer / formatter / include utilities.

**v2 has no WA match:** Report Tree, Document Viewer, Document Strip. Treat them as custom. Popup is a utility that wraps `wa-popup`.

## 3. Old style guide vs v2

**Now covered in v2:** orderly-button, orderly-select, orderly-input, orderly-dialog / confirm-modal (Dialog), boss-tooltip, boss-radiogroup, boss-switch, boss-textarea, boss-toggle, boss-tree, orderly-split-button, loading-spinner (Spinner), bossPopover directive (Popup).

**Still in the old guide, no v2 page, no Figma page:**
- `boss-header-info`, `boss-list-item`, `tab-bar`, `boss-page-content`
- `action-select`
- `boss-button-group`
- `boss-multi-unit-division-selector` and `boss-multi-unit-rooftop-selector`
- `boss-toast-action-bar`
- `more-options-menu` (Figma has the Icon Button + More Menu pattern)

**Still in the old guide, no v2 page, but designed in Figma:**
- `quantity-selector`, `file-uploader`, `boss-selectable-split-view`
- `boss-progress-bar`, `boss-progress-ring`
- `financial-calendar-range` and the datepicker (Date Input)
- `boss-drawer`, `filter-drawer`, `search-bar`, `empty-state`, `boss-address`

## 4. Discrepancies to fix in the docs

- `COMPONENT-STATUS.md` still lists Switch, Tooltip and Dialog as "Code Review, not yet merged" and Spinner as "Testing (QE)". All four are in v2 on qe2 now.
- `COMPONENT-STATUS.md` does not mention Report Tree, Copy Button, Document Strip or Document Viewer.
- Figma page order: "Toast (Steve)" and "Datepicker (Priscilla)" sit below the "--- Archive ---" divider but are not labelled [Archived].
- The v2 Patterns, UX Standards and Tokens groups exist, but the saved page doesn't show their entries.

## 5. Suggested priority

1. Figma designs for the four new v2 components (Copy Button, Document Viewer, Document Strip, Report Tree).
2. v2 doc pages for the designed-but-undocumented components, starting with Tabs, Card, Toast, Drawer and Popover (all already registered in the WA imports).
3. Decide which of Avatar, Carousel, Scroller, Pagination, Stepper, Slider and Rating the product needs. Today none is tracked anywhere.
4. Decide the fate of the old-guide-only custom components (header-info, list-item, tab-bar, page-content, action-select, multi-unit selectors, toast-action-bar).
