# Image Generator

A static, no-backend site that draws form input (text + a chosen asset image)
onto a fixed 360×430 template and lets the user download the result as a PNG.
Built to be hosted on GitHub Pages.

## File structure

```
index.html      the form + canvas markup
style.css       layout/styling
script.js       all drawing logic + field layout config (LAYOUT object)
assets/
  template.png       <-- add your 360x430 template here
  manifest.json       auto-generated list of asset filenames
  asset-01.png ...    <-- add your ~40-45 asset images here
.github/workflows/build-manifest.yml   keeps manifest.json in sync automatically
```

## 1. Add your files

1. Drop your template image into `assets/template.png` (must be named exactly
   that, or change `TEMPLATE_SRC` at the top of `script.js`).
2. Drop your ~40-45 asset images into the `assets/` folder, any names you like.
3. Push to GitHub. The included GitHub Action
   (`.github/workflows/build-manifest.yml`) automatically regenerates
   `assets/manifest.json` any time files in `assets/` change, so the dropdown
   in the form always matches what's actually in the folder — you never have
   to edit that file by hand.

   If you'd rather not use the Action, you can just hand-edit
   `assets/manifest.json` yourself — it's just a JSON array of filenames.

## 2. Positioning the fields

Everything about where things are drawn lives in one place: the `LAYOUT`
object near the top of `script.js`. Each field has its own x/y (and for
text, font/color/alignment; for the asset image, a bounding box it's scaled
to fit inside).

To reposition:

1. Open the site (locally or via GitHub Pages).
2. Check **"Show position grid"** under the form — this overlays a labeled
   ruler on the preview (never included in the downloaded image).
3. Click anywhere on the preview image — the coordinates of that spot are
   printed just below the canvas.
4. Edit the corresponding `x` / `y` values in `LAYOUT` in `script.js`, save,
   and refresh.

There are currently 10 fields wired up as placeholders (category tag, title,
subtitle, asset image, a stat bar, description, ID, date, footer note, and an
accent color used by the stat bar). Rename the labels in `index.html` and
adjust positions/fonts in `script.js` — the logic for each field type (plain
text, wrapped text, image-fit, colored bar) is already written, so most of
your editing will just be numbers.

## 3. Run it locally

Because the page `fetch`es `manifest.json`, opening `index.html` directly
via `file://` won't work in most browsers (fetch is blocked for local files).
Serve it with any static server, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## 4. Deploy on GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**,
   pick your branch (e.g. `main`) and root folder (`/`).
4. Save — your site will be live at `https://<username>.github.io/<repo>/`
   within a minute or two.

No build step, no server, no dependencies.
