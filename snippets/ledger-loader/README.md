# Ledger Loader

A loading animation for the accounting side of Back Office, and the companion to
[Prep Loader](../prep-loader/README.md). It shows a leather desk blotter from above. A document slides in,
a pen fills it in, a rubber stamp marks it, and it slides off for the next one. Canvas only, no dependencies,
about 300px wide by default.

| Caption | Document | Pen | Stamp |
|---|---|---|---|
| Counting inventory | Walk-in count sheet | Writes the counts | COUNTED |
| Uploading invoices | Harbor Produce invoice | (scan beam + upload progress) | RECEIVED |
| Matching invoices to POs | 3-way match, PO vs invoice | Links each line, ticks it, underlines $0.00 variance | MATCHED |
| Reconciling the bank | October bank rec | Ticks each cleared item, double-underlines $0.00 difference | RECONCILED |
| Posting journal entries | JE-1042 month-end accruals | Writes debits, credits and balanced totals | POSTED |
| Closing the month | October 2026 calendar | Strikes through each week, circles the 31st | CLOSED |

Open `demo.html` in a browser to see it.

## Use

```html
<link rel="stylesheet" href="ledger-loader.css">

<div class="ledger-loader" data-ledger-loader role="status" aria-live="polite">
  <canvas></canvas>
  <p class="ledger-loader__title">Getting things ready</p>
  <p class="ledger-loader__step" data-ledger-loader-step></p>
</div>

<script src="ledger-loader.js"></script>
```

- **Size:** set `--ledger-loader-width` (default `300px`) on the loader or any parent.
- **Title:** edit the text in `.ledger-loader__title`. Leave out the `data-ledger-loader-step` line if you don't want the step caption.
- **Loader added after page load:** call `LedgerLoader.mount(el)`. It returns `{ destroy }`.
- **Stopping:** stops by itself when the element is removed from the page, and pauses while offscreen. Call `destroy()` to stop it yourself.
- **Reduced motion:** shows a still frame of the stamped inventory count.

## Notes

- Document text is drawn small (about 4–7px at 300px wide). It's there for texture, and only the headings and stamps are meant to be read.
- The handwriting uses the system's handwriting font (Segoe Print, Bradley Hand, Chalkboard SE) and falls back to `cursive`.
- Vendor, account numbers and amounts are made up. The invoice total, the JE debits and credits and the bank rec items are internally consistent.
- Not yet a design system component: no Figma counterpart, no `orderly-` / `boss-` tag, not in `manifest.json`.
