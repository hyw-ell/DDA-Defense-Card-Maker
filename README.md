# Defense Card Generator

A static, no-backend site that draws form input onto a fixed 360×430
template and lets the user download the result as a PNG. Built to be
hosted on GitHub Pages.

## File structure

```
index.html      the form + canvas markup
style.css       layout/styling, theme variables, Poppins @font-face
script.js       all drawing logic, DEFENSES data, LAYOUT config
assets/
  template.png            non-fusion background
  fusion-template.png     fusion background
  manifest.json           auto-generated list of icon asset filenames
  asset-01.png ...        <-- your ~40-45 icon images go here
  fonts/
    Poppins-Regular.ttf   <-- add your real font files here
    Poppins-bold.ttf
.github/workflows/build-manifest.yml   keeps manifest.json in sync automatically
```

## 1. Add your files

1. Replace `assets/template.png` and `assets/fusion-template.png` with your
   real 360×430 templates. Both should have a transparent window over the
   icon box (top-left, 67×67 by default) so the icon shows through — the
   icon is drawn *underneath* the template, not on top of it.
2. Drop your ~40-45 icon images into `assets/`. The GitHub Action
   (`.github/workflows/build-manifest.yml`) auto-regenerates
   `assets/manifest.json` whenever files in `assets/` change, so the
   dropdown always matches what's actually in the folder.
3. Add your real font files to `assets/fonts/` named exactly
   `Poppins-Regular.ttf` and `Poppins-bold.ttf` (case-sensitive — GitHub
   Pages is a case-sensitive filesystem). If they're not there yet, the
   card just falls back to Arial; nothing breaks.

## 2. Fill in your real defense data

Open `script.js` and find the `DEFENSES` object near the top:

```js
const DEFENSES = {
  "Defense A": { hero: "Hero Alpha", mana: 150, du: 4, icon: "asset-01.png" },
  "Defense B": { hero: "Hero Beta", mana: 200, du: 6, icon: "asset-02.png" },
  "Defense C": { hero: "Hero Gamma", mana: 120, du: 3, icon: "asset-03.png", targetingPriority: "N/A" },
  ...
};
```

Replace these with your real defenses. Selecting a defense in the form
auto-fills **Mana**, **DU**, **Hero**, the **icon**, and — if you add a
`targetingPriority` key — **Targeting Priority** (otherwise it resets to
the default, "Special"). All of those fields stay normal, editable inputs
after the auto-fill; nothing is locked.

Hero options are built automatically from the unique `hero` values across
all your defenses — you don't need to list heroes separately.

## 3. Positioning the fields

Everything about where things are drawn lives in the `LAYOUT` object near
the top of `script.js` (position, font, color per field).

To reposition:

1. Open the site (locally or via GitHub Pages).
2. Check **"Show position grid"** under the form — overlays a labeled
   ruler on the preview (never included in the downloaded image).
3. Click anywhere on the preview — the coordinates print below the canvas.
4. Edit the corresponding `x` / `y` values in `LAYOUT`, save, refresh.

## Field reference

| Field | Type | Notes |
|---|---|---|
| Level | dropdown | 1–5, Max. Defaults to 1. |
| Defense | dropdown | Drives auto-fill (see above). Defaults to unselected. |
| Fusion | toggle | Defaults on. On = `fusion-template.png`, off = `template.png`. |
| Mana | text | Auto-filled, blank by default, editable. |
| DU | text | Auto-filled, blank by default, editable. |
| Hero | dropdown | Auto-filled, **required** — blocks download if empty. |
| Targeting Priority | dropdown | Air / Special / Fodder / Strong / Any / N/A. Defaults to Special; some defenses auto-fill N/A. |
| Fusion Requirement | text + suggestions | Required, Optional, Highly Recommended, Recommended, or type your own. |
| Rune Requirement | text + suggestions | Same as above, plus "Don't use". |
| Power / Range / Def. Rate / Fortify | text | Positive integers only (non-digits stripped live). Displayed as-is up to 9999; above that, abbreviated as e.g. `12k` (values won't exceed 30000 per spec). No comma separators. |
| Def. Damage | text | Percentage, up to 3 decimal places (extra digits stripped live). Displayed as `+ 12.345%`. |
| Icon asset | dropdown | Pulled from `assets/manifest.json`. Auto-set by Defense, but still a normal dropdown you can override manually. |

## 4. Light/dark mode

Defaults to dark. The toggle button (top right) flips a `data-theme`
attribute on `<html>` and remembers the choice in `localStorage`. Colors
live in the `:root` / `[data-theme="light"]` blocks at the top of
`style.css`. This only affects the site's own UI — the generated card
image is unaffected.

## 5. Run it locally

Because the page `fetch`es `manifest.json`, opening `index.html` directly
via `file://` won't work in most browsers. Serve it with any static server:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## 6. Deploy on GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages** → Source: **Deploy from a branch** → pick your
   branch (e.g. `main`) and root folder (`/`).
3. Save — live at `https://<username>.github.io/<repo>/` within a minute.

No build step, no server, no dependencies.
