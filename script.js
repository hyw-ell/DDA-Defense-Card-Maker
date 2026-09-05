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
const FUSION_TEMPLATE_SRC = "assets/fusion-template.png";
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
    align: "left",
    prefix: "Level: "
  },
  hero: {
    x: 95, y: 72,
    font: `13px ${FONT_REGULAR}`,
    color: "#444444",
    align: "left",
    prefix: "Hero: "
  },
  mana: {
    x: 95, y: 90,
    font: `13px ${FONT_REGULAR}`,
    color: "#444444",
    align: "left",
    prefix: "Mana: "
  },
  du: {
    x: 230, y: 90,
    font: `13px ${FONT_REGULAR}`,
    color: "#444444",
    align: "left",
    prefix: "DU: "
  },
  fusionReq: {
    x: 15, y: 200,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left",
    prefix: "Fusion: "
  },
  runeReq: {
    x: 15, y: 218,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left",
    prefix: "Rune: "
  },
  targeting: {
    x: 15, y: 236,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left",
    prefix: "Targeting: "
  },
  // 4 stats laid out in a row near the bottom
  statRow: {
    y: 388,
    labelFont: `10px ${FONT_REGULAR}`,
    valueFont: `bold 15px ${FONT_BOLD}`,
    labelColor: "#888888",
    valueColor: "#111111",
    columns: [
      { key: "power", x: 20, label: "POWER" },
      { key: "range", x: 110, label: "RANGE" },
      { key: "defrate", x: 200, label: "DEF. RATE" },
      { key: "fortify", x: 290, label: "FORTIFY" }
    ]
  },
  defDamage: {
    x: 15, y: 412,
    font: `12px ${FONT_REGULAR}`,
    color: "#555555",
    align: "left",
    prefix: "Def. Damage: "
  }
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
const coordReadout = document.getElementById("coord-readout");
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
  asset: document.getElementById("f-asset"),
  grid: document.getElementById("f-grid")
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
    templateImages.fusion = await loadImage(FUSION_TEMPLATE_SRC);
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

  canvas.addEventListener("click", (evt) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((evt.clientX - rect.left) * scaleX);
    const y = Math.round((evt.clientY - rect.top) * scaleY);
    coordReadout.textContent = `x: ${x}, y: ${y}`;
  });
}

/* ============================================================
   DRAWING HELPERS
   ============================================================ */

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "rgba(217, 119, 87, 0.35)";
  ctx.fillStyle = "rgba(217, 119, 87, 0.9)";
  ctx.font = "9px monospace";
  ctx.lineWidth = 1;

  for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
    if (x % 40 === 0) ctx.fillText(String(x), x + 2, 10);
  }
  for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
    if (y % 40 === 0) ctx.fillText(String(y), 2, y - 2);
  }
  ctx.restore();
}

/* ============================================================
   MAIN RENDER
   ============================================================ */

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
  // show through.
  const templateImg = els.fusion.checked ? templateImages.fusion : templateImages.normal;
  if (templateImg) {
    ctx.drawImage(templateImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    ctx.fillStyle = "rgba(238,238,238,0.6)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#999999";
    ctx.font = "12px Arial";
    ctx.fillText(
      els.fusion.checked ? "assets/fusion-template.png not found" : "assets/template.png not found",
      20, 20
    );
  }

  // 3. Defense name (title)
  const dn = LAYOUT.defenseName;
  ctx.fillStyle = dn.color;
  ctx.font = dn.font;
  ctx.textAlign = dn.align;
  ctx.fillText(els.defense.value || "— Defense —", dn.x, dn.y);

  // 4. Level
  drawLabeledText(LAYOUT.level, els.level.value);

  // 5. Hero
  drawLabeledText(LAYOUT.hero, els.hero.value);

  // 6. Mana
  drawLabeledText(LAYOUT.mana, els.mana.value);

  // 7. DU
  drawLabeledText(LAYOUT.du, els.du.value);

  // 8. Fusion Requirement
  drawLabeledText(LAYOUT.fusionReq, els.fusionReq.value);

  // 9. Rune Requirement
  drawLabeledText(LAYOUT.runeReq, els.runeReq.value);

  // 10. Targeting Priority
  drawLabeledText(LAYOUT.targeting, els.targeting.value);

  // 11. Stat row: Power, Range, Def. Rate, Fortify
  const sr = LAYOUT.statRow;
  sr.columns.forEach(col => {
    const rawValue = els[col.key].value;
    ctx.fillStyle = sr.labelColor;
    ctx.font = sr.labelFont;
    ctx.textAlign = "left";
    ctx.fillText(col.label, col.x, sr.y - 14);

    ctx.fillStyle = sr.valueColor;
    ctx.font = sr.valueFont;
    ctx.fillText(formatStatNumber(rawValue), col.x, sr.y);
  });

  // 12. Def. Damage
  drawLabeledText(LAYOUT.defDamage, formatDefDamage(els.defdamage.value), true);

  // Optional position grid overlay (never included in the downloaded PNG)
  if (els.grid.checked) drawGrid();
}

// Draws a prefix + value pair using a LAYOUT entry's font/color/position.
// Pass preFormatted=true if `value` is already the exact string to show
// (skips prepending LAYOUT's own prefix a second time isn't an issue here
// since defDamage's prefix is still applied below).
function drawLabeledText(layout, value, preFormatted) {
  ctx.fillStyle = layout.color;
  ctx.font = layout.font;
  ctx.textAlign = layout.align;
  const text = preFormatted ? layout.prefix + value : layout.prefix + (value || "—");
  ctx.fillText(text, layout.x, layout.y);
}

/* ============================================================
   DOWNLOAD
   ============================================================ */

function downloadImage() {
  if (!els.hero.value) {
    alert("Please select a Hero before downloading (Hero is required).");
    return;
  }

  const wasGridOn = els.grid.checked;
  if (wasGridOn) {
    els.grid.checked = false;
    render();
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (els.defense.value || "card").replace(/\s+/g, "_") + ".png";
    a.click();
    URL.revokeObjectURL(url);

    if (wasGridOn) {
      els.grid.checked = true;
      render();
    }
  }, "image/png");
}

init();
