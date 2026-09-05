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

## Transparency

The canvas has a transparent background by default; the checkerboard you
see in the preview is a CSS background behind the canvas (in `style.css`)
purely for visualizing transparency — it is never part of the exported
PNG. Any part of your template PNG that's transparent stays transparent
in the downloaded image.

## Text drawn on the card

Only values the user actually supplied are drawn onto the card — if a
field is empty, nothing is drawn for it, so your template's own baked-in
labels ("Power", "Fusion", "Def. Damage", etc.) show through untouched.
**Targeting Priority** is the one exception: since it always has a real
selected value (never blank), it's always drawn. **Level** works the same
way, since it also can't be blank.

## Hero colors

Each hero's name is drawn in its own color via the `HERO_COLORS` object
near the top of `script.js`:

```js
const HERO_COLORS = {
  "Hero Alpha": "#d97757",
  "Hero Beta": "#3a5a78",
  ...
};
```

Add an entry for every hero used in `DEFENSES`. Any hero without an entry
falls back to `LAYOUT.hero.color`.

## 3. Positioning the fields

Everything about where things are drawn lives in the `LAYOUT` object near
the top of `script.js` (position, font, color per field). Edit the `x` / `y`
values there, save, and refresh to see the change.

## Form layout

The form is grouped into three sections, in order, plus a collapsible
"Additional Options" section for fields you won't normally touch:

1. **Defense** (required) and **Fusion** toggle
2. **Fusion Requirement**, **Rune Requirement**, **Targeting Priority** — all required
3. **Power**, **Range**, **Def. Rate**, **Fortify**, **Def. Damage** — all optional

**Additional Options** (collapsed by default): Level, Mana, DU, Hero,
Defense Icon.

## Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| Defense | dropdown | Yes | Drives auto-fill of Mana, DU, Hero, Defense Icon, Targeting Priority. |
| Fusion | toggle | — | Defaults on. On = `fusion-template.png`, off = `template.png`. |
| Fusion Requirement | text + suggestions | Yes | Required, Optional, Highly Recommended, Recommended, or type your own. |
| Rune Requirement | text + suggestions | Yes | Same as above, plus "Don't use". |
| Targeting Priority | dropdown | Yes | Air / Special / Fodder / Strong / Any / N/A. Defaults to Special; some defenses auto-fill N/A. |
| Power / Range / Def. Rate / Fortify | text | No | Positive integers only (non-digits stripped live). Displayed as-is up to 9999; above that, abbreviated as e.g. `12k` (values won't exceed 30000 per spec). No comma separators. |
| Def. Damage | text | No | Percentage, up to 3 decimal places (extra digits stripped live). Displayed as `+ 12.345%`. |
| Level *(Additional Options)* | dropdown | — | 1–5, Max. Defaults to 1. |
| Mana *(Additional Options)* | text | — | Auto-filled, blank by default, editable. |
| DU *(Additional Options)* | text | — | Auto-filled, blank by default, editable. |
| Hero *(Additional Options)* | dropdown | No | Auto-filled by Defense, still editable/overridable. |
| Defense Icon *(Additional Options)* | dropdown | — | Pulled from `assets/manifest.json`. Auto-set by Defense, still overridable. |

Downloading checks that Defense, Fusion Requirement, Rune Requirement, and
Targeting Priority are filled in, and shows an alert naming anything
missing rather than silently failing.

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
