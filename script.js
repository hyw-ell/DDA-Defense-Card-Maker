/* ============================================================
   LAYOUT CONFIG
   ------------------------------------------------------------
   This is the ONLY place you should need to edit to reposition
   things. Every value is in canvas pixels (canvas is 360x430,
   matching the template). Turn on the "Show position grid"
   checkbox in the form to see a labeled ruler while you tune
   these numbers, and click anywhere on the preview to read off
   the exact x/y of that spot in the small text under the canvas.

   font strings use "Poppins" first, falling back to Arial if the
   real font files haven't been added to assets/fonts/ yet.
   ============================================================ */

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 430;

const TEMPLATE_SRC = "assets/template.png";
const FUSED_TEMPLATE_SRC = "assets/fused-template.png";
const MANIFEST_SRC = "assets/manifest.json";

const FONT_REGULAR = "Poppins, Arial, sans-serif";
const FONT_BOLD = "Poppins, Arial, sans-serif"; // weight is set separately, see draw calls

const LAYOUT = {
  icon: {
    // drawn UNDERNEATH the template — the template should have a
    // transparent window over this box for it to show through.
    x: 15, y: 15, width: 67, height: 67
  },
  defenseName: {
    x: 95, y: 34,
    font: `bold 20px ${FONT_BOLD}`,
    color: "#111111",
    align: "left"
  },
  level: {
    x: 95, y: 54,
    font: `13px ${FONT_REGULAR}`,
    color: "#444444",
    align: "left"
  },
  hero: {
    x: 95, y: 72,
    font: `bold 13px ${FONT_BOLD}`,
    color: "#444444", // fallback color if the hero isn't in HERO_COLORS below
    align: "left"
  },
  mana: {
    x: 95, y: 90,
    font: `13px ${FONT_REGULAR}`,
    color: "#444444",
    align: "left"
  },
  du: {
    x: 230, y: 90,
    font: `13px ${FONT_REGULAR}`,
    color: "#444444",
    align: "left"
  },
  fusionReq: {
    x: 15, y: 200,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left"
  },
  runeReq: {
    x: 15, y: 218,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left"
  },
  targeting: {
    x: 15, y: 236,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left"
  },
  // 4 stats laid out in a row near the bottom. No labels are drawn here —
  // the template already has "Power" / "Range" / etc. printed on it; this
  // just places the value on top of each.
  statRow: {
    y: 388,
    valueFont: `bold 15px ${FONT_BOLD}`,
    valueColor: "#111111",
    columns: [
      { key: "power", x: 20 },
      { key: "range", x: 110 },
      { key: "defrate", x: 200 },
      { key: "fortify", x: 290 }
    ]
  },
  defDamage: {
    x: 15, y: 412,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left"
  }
};

/* ============================================================
   HERO COLORS
   ------------------------------------------------------------
   The Hero value is drawn in a color specific to that hero. Add
   an entry here for each hero name used in DEFENSES below; any
   hero without an entry falls back to LAYOUT.hero.color.
   ============================================================ */

const HERO_COLORS = {
  "Hero Alpha": "#d97757",
  "Hero Beta": "#3a5a78",
  "Hero Gamma": "#7a9e5b",
  "Hero Delta": "#c9a227",
  "Hero Epsilon": "#8a5a9e"
};

/* ============================================================
   DEFENSE DATA
   ------------------------------------------------------------
   Selecting a Defense auto-fills Mana, DU, Hero, and (if set)
   Targeting Priority. Every one of those fields stays editable
   afterwards — this just fills in a starting value. Defenses
   that omit "targetingPriority" leave the field at its default
   ("Special") when selected.

   Replace this with your real defense list. "icon" refers to a
   filename in assets/ (also listed in assets/manifest.json).
   ============================================================ */

const DEFENSES = {
  "Defense A": { hero: "Hero Alpha", mana: 150, du: 4, icon: "asset-01.png" },
  "Defense B": { hero: "Hero Beta", mana: 200, du: 6, icon: "asset-02.png" },
  "Defense C": { hero: "Hero Gamma", mana: 120, du: 3, icon: "asset-03.png", targetingPriority: "N/A" },
  "Defense D": { hero: "Hero Delta", mana: 250, du: 8, icon: "asset-04.png" },
  "Defense E": { hero: "Hero Epsilon", mana: 180, du: 5, icon: "asset-05.png", targetingPriority: "N/A" }
};

const DEFAULT_TARGETING = "Special";

/* ============================================================
   STATE + ELEMENTS
   ============================================================ */

const canvas = document.getElementById("card-canvas");
const ctx = canvas.getContext("2d");
const themeToggle = document.getElementById("theme-toggle");

const els = {
  level: document.getElementById("f-level"),
  defense: document.getElementById("f-defense"),
  fusion: document.getElementById("f-fusion"),
  mana: document.getElementById("f-mana"),
  du: document.getElementById("f-du"),
  hero: document.getElementById("f-hero"),
  targeting: document.getElementById("f-targeting"),
  fusionReq: document.getElementById("f-fusion-req"),
  runeReq: document.getElementById("f-rune-req"),
  power: document.getElementById("f-power"),
  range: document.getElementById("f-range"),
  defrate: document.getElementById("f-defrate"),
  fortify: document.getElementById("f-fortify"),
  defdamage: document.getElementById("f-defdamage"),
  asset: document.getElementById("f-asset")
};

let templateImages = { normal: null, fusion: null };
let assetImgCache = {}; // filename -> loaded HTMLImageElement

/* ============================================================
   THEME (light/dark)
   ============================================================ */

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function updateThemeButton() {
  const theme = currentTheme();
  themeToggle.textContent = theme === "dark" ? "☀︎" : "☾";
  themeToggle.setAttribute("aria-pressed", theme === "light");
}

function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeButton();
}

/* ============================================================
   FONT LOADING (Poppins)
   ------------------------------------------------------------
   Loaded via the Font Loading API so the canvas can use it as
   soon as it's ready. If the files aren't in assets/fonts/ yet,
   this just warns and the canvas falls back to Arial.
   ============================================================ */

async function loadFonts() {
  try {
    const regular = new FontFace("Poppins", "url(assets/fonts/Poppins-Regular.ttf)", { weight: "400", style: "normal" });
    const bold = new FontFace("Poppins", "url(assets/fonts/Poppins-bold.ttf)", { weight: "700", style: "normal" });
    const [loadedRegular, loadedBold] = await Promise.all([regular.load(), bold.load()]);
    document.fonts.add(loadedRegular);
    document.fonts.add(loadedBold);
  } catch (e) {
    console.warn("Poppins font files not found in assets/fonts/ — falling back to Arial until they're added.", e);
  }
}

/* ============================================================
   NUMBER / PERCENTAGE FORMATTING
   ============================================================ */

// Positive integers only. Anything over 9999 is abbreviated with "k"
// (e.g. 12345 -> "12k"). No comma separators. Values won't exceed
// 30000 per spec, so no further abbreviation is needed.
function formatStatNumber(raw) {
  const n = Math.max(0, parseInt(raw, 10) || 0);
  if (n > 9999) return Math.floor(n / 1000) + "k";
  return String(n);
}

// Strips a text input down to digits only, live, as the user types.
function sanitizeIntegerInput(el) {
  const cleaned = el.value.replace(/[^0-9]/g, "");
  el.value = cleaned;
}

// Percentage with a leading "+ " and exactly 3 decimal places,
// e.g. 12.345 -> "+ 12.345%".
function formatDefDamage(raw) {
  const n = Math.max(0, parseFloat(raw) || 0);
  return `+ ${n.toFixed(3)}%`;
}

// Restricts a text input, live, to digits with up to 3 decimal places.
function sanitizeDecimalInput(el) {
  let cleaned = el.value.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
    const [intPart, decPart] = cleaned.split(".");
    cleaned = intPart + "." + decPart.slice(0, 3);
  }
  el.value = cleaned;
}

/* ============================================================
   INIT
   ============================================================ */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load " + src));
    img.src = src;
  });
}

function populateDefenseAndHeroOptions() {
  const defenseNames = Object.keys(DEFENSES);
  els.defense.innerHTML =
    `<option value="" selected>-- Select Defense --</option>` +
    defenseNames.map(name => `<option value="${name}">${name}</option>`).join("");

  const heroNames = [...new Set(defenseNames.map(name => DEFENSES[name].hero))];
  els.hero.innerHTML =
    `<option value="" selected>-- Select Hero --</option>` +
    heroNames.map(h => `<option value="${h}">${h}</option>`).join("");
}

async function init() {
  updateThemeButton();
  themeToggle.addEventListener("click", toggleTheme);

  await loadFonts();
  populateDefenseAndHeroOptions();

  // Load both template variants up front so toggling Fusion is instant.
  try {
    templateImages.normal = await loadImage(TEMPLATE_SRC);
  } catch (e) {
    console.warn(e.message);
  }
  try {
    templateImages.fusion = await loadImage(FUSED_TEMPLATE_SRC);
  } catch (e) {
    console.warn(e.message);
  }

  try {
    const res = await fetch(MANIFEST_SRC, { cache: "no-store" });
    const list = await res.json();
    els.asset.innerHTML = list
      .map(name => `<option value="${name}">${name}</option>`)
      .join("");
  } catch (e) {
    console.warn("Could not load assets/manifest.json", e);
    els.asset.innerHTML = `<option value="">(no assets found)</option>`;
  }

  attachListeners();
  render();
}

function attachListeners() {
  Object.values(els).forEach(el => {
    el.addEventListener("input", render);
  });

  // Integer-only fields
  [els.power, els.range, els.defrate, els.fortify].forEach(el => {
    el.addEventListener("input", () => sanitizeIntegerInput(el));
  });

  // Percentage field (up to 3 decimals)
  els.defdamage.addEventListener("input", () => sanitizeDecimalInput(els.defdamage));

  // Defense dropdown: auto-fills Mana, DU, Hero, Targeting Priority,
  // and the icon — every one of those stays editable afterwards.
  els.defense.addEventListener("change", () => {
    const config = DEFENSES[els.defense.value];
    if (!config) return; // "-- Select Defense --" chosen: leave fields as-is
    els.mana.value = config.mana ?? "";
    els.du.value = config.du ?? "";
    els.hero.value = config.hero ?? "";
    els.targeting.value = config.targetingPriority || DEFAULT_TARGETING;
    if (config.icon) els.asset.value = config.icon;
    render();
  });

  document.getElementById("download-btn").addEventListener("click", downloadImage);
}

/* ============================================================
   DRAWING HELPERS
   ============================================================ */

/* ============================================================
   MAIN RENDER
   ============================================================ */

// Draws `value` at a LAYOUT position/font/color, but only if it's
// actually non-empty — fields with no user input draw nothing, since
// the template already has its own static labels/icons baked in.
function drawIfPresent(layout, value, colorOverride) {
  if (value === null || value === undefined || String(value).trim() === "") return;
  ctx.fillStyle = colorOverride || layout.color;
  ctx.font = layout.font;
  ctx.textAlign = layout.align;
  ctx.fillText(String(value), layout.x, layout.y);
}

async function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 1. Icon — drawn FIRST, underneath the template.
  const iconBox = LAYOUT.icon;
  const chosenAsset = els.asset.value;
  if (chosenAsset) {
    let img = assetImgCache[chosenAsset];
    if (!img) {
      try {
        img = await loadImage("assets/" + chosenAsset);
        assetImgCache[chosenAsset] = img;
      } catch (e) {
        console.warn(e.message);
      }
    }
    if (img) {
      const scale = Math.min(iconBox.width / img.width, iconBox.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const dx = iconBox.x + (iconBox.width - w) / 2;
      const dy = iconBox.y + (iconBox.height - h) / 2;
      ctx.drawImage(img, dx, dy, w, h);
    }
  }

  // 2. Template — drawn on top of the icon. The template image
  // should have a transparent window over the icon box for it to
  // show through. Any part of the template that's transparent stays
  // transparent in the exported PNG too.
  const templateImg = els.fusion.checked ? templateImages.fusion : templateImages.normal;
  if (templateImg) {
    ctx.drawImage(templateImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    ctx.fillStyle = "#999999";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
      els.fusion.checked ? "assets/fused-template.png not found" : "assets/template.png not found",
      20, 20
    );
  }

  // 3. Defense name (title) — only drawn once a defense is actually selected.
  drawIfPresent(LAYOUT.defenseName, els.defense.value);

  // 4. Level — always has a real value (no blank state), so it always draws.
  drawIfPresent(LAYOUT.level, els.level.value);

  // 5. Hero — colored per-hero via HERO_COLORS, falls back to LAYOUT.hero.color.
  drawIfPresent(LAYOUT.hero, els.hero.value, HERO_COLORS[els.hero.value]);

  // 6. Mana
  drawIfPresent(LAYOUT.mana, els.mana.value);

  // 7. DU
  drawIfPresent(LAYOUT.du, els.du.value);

  // 8. Fusion Requirement
  drawIfPresent(LAYOUT.fusionReq, els.fusionReq.value);

  // 9. Rune Requirement
  drawIfPresent(LAYOUT.runeReq, els.runeReq.value);

  // 10. Targeting Priority — exception to the "skip if empty" rule; this
  // field always has a selection and is always drawn.
  drawIfPresent(LAYOUT.targeting, els.targeting.value);

  // 11. Stat row: Power, Range, Def. Rate, Fortify — no labels drawn
  // (the template already has those printed), and nothing drawn at all
  // if the user hasn't entered a value for that stat.
  const sr = LAYOUT.statRow;
  sr.columns.forEach(col => {
    const rawValue = els[col.key].value;
    if (rawValue.trim() === "") return;
    ctx.fillStyle = sr.valueColor;
    ctx.font = sr.valueFont;
    ctx.textAlign = "left";
    ctx.fillText(formatStatNumber(rawValue), col.x, sr.y);
  });

  // 12. Def. Damage
  if (els.defdamage.value.trim() !== "") {
    drawIfPresent(LAYOUT.defDamage, formatDefDamage(els.defdamage.value));
  }
}

/* ============================================================
   DOWNLOAD
   ============================================================ */

function downloadImage() {
  const missing = [];
  if (!els.defense.value) missing.push("Defense");
  if (!els.fusionReq.value.trim()) missing.push("Fusion Requirement");
  if (!els.runeReq.value.trim()) missing.push("Rune Requirement");
  if (!els.targeting.value) missing.push("Targeting Priority");

  if (missing.length) {
    alert("Please fill in the following required field(s) before downloading:\n" + missing.join(", "));
    return;
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (els.defense.value || "card").replace(/\s+/g, "_") + ".png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

init();
