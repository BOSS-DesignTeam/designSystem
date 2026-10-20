# Component gap report: Style Guide v2 vs WebAwesome vs Figma 0.1 vs old guide and library

Recompiled 2026-10-20 from the qe1 style guide (first written 2026-10-19 from qe2). The to-do list built from this report is the "Sync audit" section of `COMPONENT-STATUS.md`.

## Sources and how each was verified

| Source | What it is | Verified by |
|---|---|---|
| **Style guide v2 (current)** | qe1 `#/styleGuideV2`, saved as `styleguideV2/Back Office.html` (24 components + the Popup utility) | Live read of the saved page's sidebar (links, status, tier) |
| **Style guide v2, qe2 pages** | `styleguideV2/components/document-viewer.html` and `document-strip.html`, saved from qe2 | Live read of the saved pages |
| **WebAwesome** | webawesome.com/docs/components index | Live fetch 2026-10-19 |
| **Figma 0.1 (new)** | file `B5j3nfocmShiBwqwy9dNXg`, "Back Office Design System 0.1" | Live read of all page names (about 70) on 2026-10-20, plus the component sets on 8 pages. Other pages' contents were **not** opened, so a component hiding inside another page would be missed. |
| **Old Figma library** | "Back Office Design Library", file `wdwwm6VbBU89GFViEvcfkY` | Live read: all page names, plus component names on 5 pages (Final Components, Base, Buttons & Button Groups, Navigation, Table) on 2026-10-20. Not every page was opened. |
| **Old style guide** | legacy v1 `#/styleGuide` | Read from the orderly master snapshot (Oct 2, `3657a07ecec`). Not re-read from a live environment. |

Counts are scoped to the source named. "No page" means no page of that name in that source, not "does not exist anywhere".

## 1. qe1 and qe2 disagree

The two saved v2 style guides come from different builds (qe1 `main-OZLZUUIK.js`, qe2 `main-HBQSRVNM.js`):

- **Only on qe1:** Tabs.
- **Only on qe2:** Document Viewer and Document Strip.
- Everything else matches: 23 components plus Popup, with the same status and tier labels.

The qe1 file was supplied as the more up-to-date one. So Document Viewer and Document Strip may be unmerged work, which would mean BOPD-1566's "both already ship" holds only on qe2. This needs checking before treating either as shipped.

## 2. Style guide v2 (qe1) vs Figma 0.1

**In v2, no Figma page (2):** Copy Button and Report Tree. The Organizational Tree page holds only Tree Item and Tree; the archived Reporting Table page was not searched.

**In both (22):** Badge, Breadcrumb, Button, Callout, Checkbox, Combobox, Dialog, Divider, Dropdown, Input, Radio, Select, Spinner, Split Button, Switch, Tabs, Tag, Textarea, Toggle, Tooltip, Tree, and Details (Figma name: Accordion, inferred from the WA Details base).

**In Figma, not in the qe1 v2 guide:**
- *Designed in 0.1, no v2 page:* Card, Toast, Drawer, Popover, BOSS Table, Floating Action Bar, File Upload, Progress Bar, Quantity Selector, Icon Button, Split Panel, Skeleton, Empty State, Search Bar, Filter Drawer, Date Input, Money Input, Numeric Set Input, Address, Form, Field Message, Checklist Item and Status Row, Icons, Animations. Radio Group is covered by the v2 Radio page (alias).
- *First pass built 2026-10-20, qe2 only in code:* Document Viewer and Document Strip (draft, unpublished).

## 3. WebAwesome vs v2 and Figma

**WA component, in Figma, no v2 page:** Card, Popover, Toast, Drawer, Progress Bar, Number Input (Quantity Selector), Split Panel, Skeleton, Date Input and Date Picker, File Input, Data Grid (BOSS Table). Tab Group moved out of this list: v2 has Tabs now.

**WA component, in neither v2 nor Figma:**
- Likely relevant: Avatar, Carousel, Scroller, Button Group (deprioritized to last), Progress Ring (back of the line), Page (story filed: BOPD-877), Pagination (exists only as Table Pager), Stepper, Slider, Rating, Tag Input, Time Input, OTP Input, Checkbox Group, Color Picker.
- Probably not relevant: charts, QR Code, Video, Video Playlist, Zoomable Frame, Markdown, Comparison, Animated Image, and the observer, formatter and include utilities.

**v2 components with no WA match:** Report Tree, plus Document Viewer and Document Strip (qe2). Popup is a utility that wraps `wa-popup`.

## 4. Old style guide vs v2

**Now covered in v2:** Button, Select, Input, Dialog, Tooltip, Radio, Switch, Textarea, Toggle, Tree, Split Button, Spinner, Popup. `tab-bar` is probably superseded by the new Tabs page (confirm).

**Still only in the old guide, no v2 page, no Figma page:** `boss-header-info`, `boss-list-item`, `boss-page-content`, `action-select`, `boss-button-group`, the two multi-unit selectors, `boss-toast-action-bar`, `more-options-menu` (Figma has the Icon Button + More Menu pattern).

**Still only in the old guide, no v2 page, designed in Figma:** `quantity-selector`, `file-uploader`, `boss-selectable-split-view`, `boss-progress-bar`, `boss-progress-ring`, `financial-calendar-range` and the datepicker (Date Input), `boss-drawer`, `filter-drawer`, `search-bar`, `empty-state`, `boss-address`.

## 5. Old Figma library vs Figma 0.1

Matching is by page and component name only. A component may have been rebuilt in 0.1 under a name I didn't recognise.

**In the old library, no page in 0.1 (needs a decision: rebuild, replace, or drop):**
- **Navigation**: Back Office Navigation, Global Settings Nav, Sub Nav, Restaurant Picker, module and nav icons. 24 components on that page alone, the largest gap.
- **Page Header / Page Heading** and **Top Bar** (code: `boss-page-content`, `boss-header-info`)
- **Menu** and **Menu / COA-GL**
- **Audit / History Log**
- **Financial Reporting Card**
- **Multi Unit Selector**
- **List** (code: `boss-list-item`)
- **Price Range Picker** and **Password Input**
- Smaller pieces: Island, Disclosure Button, button "decision group" and "view details" variants, Scrollbar, Ordering Add Item, Accounting Tags / Bank Account Use
- Documentation pages with no 0.1 equivalent: Negative Numbers, Selection Bar, Panel Slide Out, Voice of the Product, Layout, Search, Dialogs, Loading Screens (partly covered by Spinner and Skeleton)

**In the old library and carried into 0.1, usually renamed:**

| Old library | Figma 0.1 |
|---|---|
| Alert / Alert Banner | Callout |
| Tab Group | Tabs (now also in the v2 guide) |
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

**Old-library names that look like leftovers:** `.old fields/*`, `.Old TI`, `.checkbox - outdated`, `.*Old* Drawer`, "Do Not Publish", "archive", "Elements" (30 children). Cleanup candidates, not migration.

## 6. Discrepancies to fix in the docs

- `COMPONENT-STATUS.md` listed Switch, Tooltip, Dialog and Spinner as unmerged or in QE, and Tabs as having no v2 page. All five are on the qe1 v2 guide (Switch, Tooltip, Dialog and Spinner also on qe2). Fixed in this pass; Jira statuses were not rechecked.
- Report Tree and Copy Button were not tracked anywhere. Document Viewer and Document Strip are qe2-only (section 1).
- Figma page order: "Toast (Steve)" and "Datepicker (Priscilla)" sit below the Archive divider without an archived label. "Tabs (Steve)" sits in "Dev Picked Up" although v2 now documents it.
- `manifest.json` lists 14 components. The qe1 v2 guide has 24 plus Popup, so 11 entries are missing.
- The v2 Patterns, UX Standards and Tokens groups exist, but the saved page doesn't show their entries.

## 7. Suggested priority

1. Find out why qe1 and qe2 differ and whether Document Viewer, Document Strip and Tabs are merged (section 1).
2. Figma designs for Copy Button and Report Tree, the two v2 components with no design.
3. v2 doc pages for the components that are designed but undocumented, starting with Card, Toast, Drawer and Popover (already registered in the WA imports).
4. Add a Neutral + Outlined variant to Button and Icon Button, which the Document Viewer toolbar is waiting on (see the Button review in `COMPONENT-STATUS.md`).
5. Decide which of Avatar, Carousel, Scroller, Pagination, Stepper, Slider and Rating the product needs. None is tracked today.
6. Decide the fate of the old-guide-only custom components (header-info, list-item, page-content, action-select, multi-unit selectors, toast-action-bar).
7. Decide what happens to the old library's Navigation, Page Header, Menu, Audit/History Log and Financial Reporting Card. These look like core product chrome (the code has matching components) and have no home in 0.1 yet.
8. Open the old library pages I skipped before treating section 5 as complete.
