# Prep Loader

A loading animation for Back Office pages: a chef's knife slices carrots, cucumber, tomatoes,
red onion and lemons on a maple cutting board. The caption under it names the current item
("Slicing carrots", "Shaving red onion"…). Canvas only, no dependencies, about 300px wide by default.

Open `demo.html` in a browser to see it.

## Files

| File | What it is |
|---|---|
| `prep-loader.js` | Drawing and animation. Auto-mounts on every `[data-prep-loader]` element. |
| `prep-loader.css` | Layout and sizing. Text inherits the page's font and colour. |
| `prep-loader.html` | The markup to paste into a page. |
| `demo.html` | A standalone page showing the loader. |

## Use

```html
<link rel="stylesheet" href="prep-loader.css">

<div class="prep-loader" data-prep-loader role="status" aria-live="polite">
  <canvas></canvas>
  <p class="prep-loader__title">Getting things ready</p>
  <p class="prep-loader__step" data-prep-loader-step></p>
</div>

<script src="prep-loader.js"></script>
```

- **Size:** set `--prep-loader-width` (default `300px`) on the loader or any parent. The board keeps its proportions.
- **Title:** edit the text in `.prep-loader__title`. Leave out the `data-prep-loader-step` line if you don't want the item caption.
- **Loader added after page load:** call `PrepLoader.mount(el)`. It returns `{ destroy }`.
- **Stopping:** the animation stops by itself when the element is removed from the page, and pauses while it's offscreen. Call `destroy()` to stop it yourself.
- **Reduced motion:** if the viewer has reduced motion turned on, it shows a still frame partway through the carrots.

## Notes

- The board, food and knife colours are fixed (they're illustrations, not UI), so they don't use design tokens. The board has its own shadow and sits on light or dark surfaces.
- Not yet a design system component: there's no Figma counterpart, no `orderly-` / `boss-` tag, and it isn't in `manifest.json`.
