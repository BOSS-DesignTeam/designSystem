# Component gap report: Style Guide v2 vs WebAwesome vs Figma 0.1 vs old style guide

Date: 2026-10-19

## Sources and how each was verified

| Source | What it is | Verified by |
|---|---|---|
| **Style Guide v2 (current)** | qe2 `#/styleGuideV2` saved as `styleguideV2/Back Office.html` (25 component pages + 1 utility) | Live read of the saved page's sidebar (links, status, tier) |
| **WebAwesome** | webawesome.com/docs/components index | Live fetch 2026-10-19 |
| **Figma 0.1 (new)** | file `B5j3nfocmShiBwqwy9dNXg`, "Back Office Design System 0.1" | Live read: all page names (about 70), plus the component sets inside the Organizational Tree and BOSS Table pages. Other pages' contents were **not** opened, so a component hiding inside another page would be missed. |
| **Old Figma library** | "Back Office Design Library", file `wdwwm6VbBU89GFViEvcfkY` | Live read: all page names, plus component names on 5 pages (Final Components, Base, Buttons & Button Groups, Navigation, Table). The other pages were **not** opened, so the list in section 4 may be missing items. |
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

## 4. Old Figma library vs Figma 0.1

Matching is by page and component name only. A component may have been rebuilt in 0.1 under a name I didn't recognise.

**In the old library, no page in 0.1 (needs a decision: rebuild, replace, or drop):**
- **Navigation**: Back Office Navigation, Global Settings Nav, Sub Nav, Restaurant Picker, module and nav icons. 24 components on that page alone, the largest gap.
- **Page Header / Page Heading** and **Top Bar** (code: `boss-page-content`, `boss-header-info`)
- **Menu** and **Menu / COA-GL**
- **Audit / History Log**
- **Financial Reporting Card**
- **Multi Unit Selector** (code: `boss-multi-unit-division-selector`, `boss-multi-unit-rooftop-selector`)
- **List** (code: `boss-list-item`)
- **Price Range Picker** and **Password Input**
- Smaller pieces: Island, Disclosure Button, button "decision group" and "view details" variants, Scrollbar, Ordering Add Item, Accounting Tags / Bank Account Use
- Documentation pages with no 0.1 equivalent: Negative Numbers, Selection Bar, Panel Slide Out, Voice of the Product, Layout, Search, Dialogs, Loading Screens (partly covered by Spinner and Skeleton)

**In the old library and carried into 0.1, usually renamed:**

| Old library | Figma 0.1 |
|---|---|
| Alert / Alert Banner | Callout |
| Tab Group | Tabs |
| Toasts | Toast |
| Datepicker, Date Range Picker | Date Input |
| Paginator, Table Pagination | Table Pager |
| Table, Report Table | BOSS Table |
| Toggle Button | Toggle |
| Dropdown Select | Select |
| Form (for Drawer) | Form |
| Button, Split Button | Button, Split Button |
| Checkbox, Radio, Switch, Input, Tooltip, Dialog | same names |
| File Upload, Empty State, Floating Action Bar, Drawer | same names |

**Old-library names that look like leftovers:** `.old fields/*`, `.Old TI`, `.checkbox - outdated`, `.*Old* Drawer`, "Do Not Publish", "archive", "Elements" (30 children). They look like candidates for cleanup, not migration.

## 5. Discrepancies to fix in the docs

- `COMPONENT-STATUS.md` still lists Switch, Tooltip and Dialog as "Code Review, not yet merged" and Spinner as "Testing (QE)". All four are in v2 on qe2 now.
- `COMPONENT-STATUS.md` does not mention Report Tree, Copy Button, Document Strip or Document Viewer.
- Figma page order: "Toast (Steve)" and "Datepicker (Priscilla)" sit below the "--- Archive ---" divider but are not labelled [Archived].
- The v2 Patterns, UX Standards and Tokens groups exist, but the saved page doesn't show their entries.

## 6. Suggested priority

1. Figma designs for the four new v2 components (Copy Button, Document Viewer, Document Strip, Report Tree).
2. v2 doc pages for the designed-but-undocumented components, starting with Tabs, Card, Toast, Drawer and Popover (all already registered in the WA imports).
3. Decide which of Avatar, Carousel, Scroller, Pagination, Stepper, Slider and Rating the product needs. Today none is tracked anywhere.
4. Decide the fate of the old-guide-only custom components (header-info, list-item, tab-bar, page-content, action-select, multi-unit selectors, toast-action-bar).
5. Decide what happens to the old Figma library's Navigation, Page Header, Menu, Audit/History Log and Financial Reporting Card. These look like core product chrome (the code has matching components) and have no home in 0.1 yet. Navigation is the biggest.
6. Open the old library pages I skipped before treating section 4 as complete.
