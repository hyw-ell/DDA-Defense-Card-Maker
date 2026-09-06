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
const FONT_BOLD = "Poppins-Bold, Arial, sans-serif";
const FONT_SEMIBOLD = "Poppins-SemiBold, Arial, sans-serif";

const LAYOUT = {
  icon: {
    // drawn UNDERNEATH the template — the template should have a
    // transparent window over this box for it to show through.
    x: 42, y: 68, width: 67, height: 67
  },
  defenseName: {
    x: 121, y: 105,
    font: `24px ${FONT_BOLD}`,
    color: "#ffffff",
    align: "left"
  },
  level: {
    x: 60, y: 40,
    font: `21px ${FONT_BOLD}`,
    color: "#ffffff",
    align: "left"
  },
  hero: {
    x: 121, y: 80,
    font: `17px ${FONT_BOLD}`,
    color: "#444444", // fallback color if the hero isn't in HERO_COLORS below
    align: "left"
  },
  mana: {
    x: 265, y: 40,
    font: `21px ${FONT_BOLD}`,
    color: "#ffffff",
    align: "right"
  },
  du: {
    x: 303, y: 40,
    font: `21px ${FONT_BOLD}`,
    color: "#ffffff",
    align: "left"
  },
  fusionReq: {
    x: 39, y: 197,
    font: `21px ${FONT_SEMIBOLD}`,
    color: "#fb21ff",
    align: "left"
  },
  runeReq: {
    x: 39, y: 255,
    font: `21px ${FONT_SEMIBOLD}`,
    color: "#1cdfda",
    align: "left"
  },
  targeting: {
    x: 39, y: 316,
    font: `21px ${FONT_SEMIBOLD}`,
    color: "#fb683c",
    align: "left"
  },
  // 4 stats laid out in a row near the bottom. No labels are drawn here —
  // the template already has "Power" / "Range" / etc. printed on it; this
  // just places the value on top of each.
  defStats: {
    valueFont: `16px ${FONT_REGULAR}`,
    valueColor: "#ffffff",
    entries: [
      { key: "power", x: 175, y: 351 },
      { key: "range", x: 320, y: 351 },
      { key: "defrate", x: 175, y: 377 },
      { key: "fortify", x: 320, y: 377 }
    ]
  },
  defDamage: {
    x: 275, y: 402,
    font: `16px ${FONT_SEMIBOLD}`,
    color: "#0a66d1",
    align: "right"
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
  "Apprentice": "#187cb4",
  "Huntress": "#047f3e",
  "Monk": "#e26625",
  "Squire": "#a51111",
  "Series EV-A": "#64378d",
  "Warden": "#04b49f",
  "Summoner": "#5e5379",
  "Guardian": "#eea629",
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
  "Magic Missile Tower": { hero: "Apprentice", mana: 40, du: 2, icon: "Defense_MagicMissileTower.png" },
  "Elemental Blockade": { hero: "Apprentice", mana: 20, du: 1, icon: "Defense_ArcaneBarrier.png", targetingPriority: "N/A" },
  "Flameburst Tower": { hero: "Apprentice", mana: 80, du: 4, icon: "Defense_FireballTower.png" },
  "Lightning Tower": { hero: "Apprentice", mana: 120, du: 6, icon: "Defense_LightningTower.png" },
  "Deadly Striker Tower": { hero: "Apprentice", mana: 150, du: 8, icon: "Defense_StrikerTower.png" },

  "Explosive Trap": { hero: "Huntress", mana: 40, du: 3, icon: "Defense_ProximityTrap.png", targetingPriority: "N/A" },
  "Poison Trap": { hero: "Huntress", mana: 30, du: 3, icon: "Defense_GasTrap.png", targetingPriority: "N/A" },
  "Inferno Trap": { hero: "Huntress", mana: 60, du: 4, icon: "Defense_InfernoTrap.png", targetingPriority: "N/A" },
  "Poison Dart Tower": { hero: "Huntress", mana: 60, du: 3, icon: "Defense_PoisonDart.png" },
  "Thunder Spike Trap": { hero: "Huntress", mana: 80, du: 3, icon: "Defense_EtherialSpikeTrap.png", targetingPriority: "N/A" },

  "Ensnare Aura": { hero: "Monk", mana: 30, du: 3, icon: "Defense_EnsnareAura.png", targetingPriority: "N/A" },
  "Electric Aura": { hero: "Monk", mana: 50, du: 5, icon: "Defense_ElectricAura.png", targetingPriority: "N/A" },
  "Healing Aura": { hero: "Monk", mana: 40, du: 2, icon: "Defense_HealingAura.png", targetingPriority: "N/A" },
  "Strength Drain Aura": { hero: "Monk", mana: 60, du: 4, icon: "Defense_StrengthDrainAura.png", targetingPriority: "N/A" },
  "Enrage Aura": { hero: "Monk", mana: 100, du: 5, icon: "Defense_EnrageAura.png", targetingPriority: "N/A" },
  
  "Spiked Blockade": { hero: "Squire", mana: 30, du: 2, icon: "Defense_SpikyBlockade.png", targetingPriority: "N/A" },
  "Sniper Cannon": { hero: "Squire", mana: 80, du: 4, icon: "Defense_SniperCannonTower_Icon.png" },
  "Bowling Ball Tower": { hero: "Squire", mana: 70, du: 4, icon: "Defense_BowlingBallTower.png" },
  "Harpoon Tower": { hero: "Squire", mana: 80, du: 5, icon: "Defense_HarpoonTower.png" },
  "Slice N' Dice Blockade": { hero: "Squire", mana: 100, du: 4, icon: "Defense_SliceNDiceTower.png", targetingPriority: "N/A" },

  "Proton Beam": { hero: "Series EV-A", mana: 4, du: 2, icon: "Defense_ProtonBeam.png", targetingPriority: "N/A" },
  "Reflect Field": { hero: "Series EV-A", mana: 20, du: 1, icon: "Defense_ReflectionBeam.png", targetingPriority: "N/A" },
  "Blocking Reflect Field": { hero: "Series EV-A", mana: 20, du: 1, icon: "Defense_PhysicalBeam.png", targetingPriority: "N/A" },
  "Heat Cannon": { hero: "Series EV-A", mana: 70, du: 5, icon: "Defense_HeatCannon.png" },
  "Plasma Defense System": { hero: "Series EV-A", mana: 150, du: 8, icon: "Defense_PlasmaDefenseSystem.png" },
  "Overclock Beam": { hero: "Series EV-A", mana: 70, du: 3, icon: "Defense_TowerBuffBeam.png", targetingPriority: "N/A" },

  "Roots Of Purity": { hero: "Warden", mana: 20, du: 1, icon: "Defense_Roots_Of_Purity.png", targetingPriority: "N/A" },
  "Shroomy Geyser": { hero: "Warden", mana: 60, du: 1, icon: "Defense_Shroom_Pit.png" },
  "Wisp Den": { hero: "Warden", mana: 50, du: 3, icon: "Defense_Wisp_Den.png" },
  "Beaming Blossom": { hero: "Warden", mana: 70, du: 4, icon: "Defense_Beaming_Blossom.png" },
  "Sludge Launcher": { hero: "Warden", mana: 100, du: 5, icon: "Defense_Sludge_Launcher.png" },

  "Archer Minion": { hero: "Summoner", mana: 60, du: 2, icon: "Defense_Archer_Tower.png" },
  "Spider Minion": { hero: "Summoner", mana: 70, du: 3, icon: "Defense_Spider_Tower.png" },
  "Mage Minion": { hero: "Summoner", mana: 80, du: 3, icon: "Defense_Mage_Tower.png" },
  "Siren Minion": { hero: "Summoner", mana: 120, du: 4, icon: "Defense_Siren_Tower.png" },
  "Ogre Minion": { hero: "Summoner", mana: 120, du: 5, icon: "Defense_Ogre_Tower.png" },

  "Holy Bulwark": { hero: "Guardian", mana: 20, du: 3, icon: "Defense_Holy_Bulwark.png", targetingPriority: "N/A" },
  "Holy Cannon": { hero: "Guardian", mana: 80, du: 4, icon: "Defense_Holy_Cannon.png" },
  "The Obelisk": { hero: "Guardian", mana: 70, du: 4, icon: "Defense_Obelisk.png" },
  "Owl Perch": { hero: "Guardian", mana: 50, du: 3, icon: "Defense_Owl_Perch.png" },
  "Empowering Shrine": { hero: "Guardian", mana: 200, du: 2, icon: "Defense_Empowering_Shrine.png", targetingPriority: "N/A" },
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
    const regular = new FontFace("Poppins", "url(assets/fonts/Poppins-Regular.ttf)");
    const semiBold = new FontFace("Poppins-SemiBold", "url(assets/fonts/Poppins-SemiBold.ttf)");
    const bold = new FontFace("Poppins-Bold", "url(assets/fonts/Poppins-Bold.ttf)");
    const [loadedRegular, loadedSemiBold, loadedBold] = await Promise.all([regular.load(), semiBold.load(), bold.load()]);
    document.fonts.add(loadedRegular);
    document.fonts.add(loadedSemiBold);
    document.fonts.add(loadedBold);
  } catch (e) {
    console.warn("Poppins font files not found in assets/fonts/ — falling back to Arial until they're added.", e);
  }
}

/* ============================================================
   NUMBER / PERCENTAGE FORMATTING
   ============================================================ */

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
  const defenseNames = Object.keys(DEFENSES).sort();
  els.defense.innerHTML =
    `<option value="" selected>-- Select Defense --</option>` +
    defenseNames.map(name => `<option value="${name}">${name}</option>`).join("");

  const heroNames = [...new Set(defenseNames.map(name => DEFENSES[name].hero))];
  els.hero.innerHTML =
    `<option value="" selected>-- Select Hero --</option>` +
    heroNames.map(h => `<option value="${h}">${h}</option>`).join("");
}

function setupOcrDropzone() {
  const dropzone = document.getElementById("ocr-dropzone");
  const fileInput = document.getElementById("f-ocr-screenshot");

  fileInput.addEventListener("change", (e) => {
    handleOcrScreenshot(e.target.files[0]);
  });

  // The file input covers the whole box (see .dropzone-input CSS), so
  // click-to-open and native file drag-and-drop both work automatically —
  // dropping a file directly onto a file input sets its .files and fires
  // "change" on its own. These listeners just add the visual highlight.
  ["dragenter", "dragover"].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  // Paste is listened for on the whole document rather than requiring the
  // dropzone to be focused first — this is the only image-paste feature
  // on the page, so it's safe to treat any pasted image as intended for
  // it, which is more forgiving than needing a click-to-focus step first.
  document.addEventListener("paste", (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        handleOcrScreenshot(item.getAsFile());
        e.preventDefault();
        break;
      }
    }
  });
}

async function handleOcrScreenshot(file) {
  const status = document.getElementById("ocr-status");
  if (!file) return;
  status.textContent = "Scanning screenshot…";

  try {
    const { data } = await Tesseract.recognize(file, "eng");
    const text = data.text;

    const patterns = {
      power:     /power\D*?([\d.]+[a-zA-Z]?)/i,
      range:     /range\D*?([\d.]+[a-zA-Z]?)/i,
      defrate:   /def\.?\s*rate\D*?([\d.]+[a-zA-Z]?)/i,
      fortify:   /fortify\D*?([\d.]+[a-zA-Z]?)/i,
      defdamage: /def\.?\s*damage[^\d]*([\d.]+)/i  // "+19.252%" -> "19.252"
    };

    // Values over 9999 always end in a decimal + a letter ("k") in-game.
    // Any trailing letter here is that "k" — OCR occasionally misreads it
    // as a different letter, so we just normalize whatever it captured
    // to "k" rather than trying to match it exactly.
    function normalizeStatToken(token) {
      if (!token) return null;
      const match = token.trim().match(/^([\d.]+)([a-zA-Z]?)$/);
      if (!match) return null;
      let [, number, suffix] = match;
      if (/(?<!\d)\d\./.test(number)) number = '1' + number;  // Numbers < 10000 will not have a decimal separator, so OCR misread and we add 10000 as a correction
      return (suffix || number.includes('.')) ? number + "k" : number;
    }

    const found = [];
    Object.entries(patterns).forEach(([key, regex]) => {
      const match = text.match(regex);
      if (!match) return;

      const value = key === "defdamage" ? match[1] : normalizeStatToken(match[1]);
      if (value !== null) {
        els[key].value = value;
        found.push(key);
      }
    });

    render();

    status.textContent = found.length
      ? `Imported: ${found.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(", ").replace(/defdamage/i, "Def. Damage").replace(/defrate/i, "Def. Rate")}`
      : "Couldn't find any stats in that image — try a clearer screenshot or enter them manually.";
  } catch (err) {
    console.error(err);
    status.textContent = "Something went wrong scanning that image.";
  }
}

async function init() {
  updateThemeButton();
  themeToggle.addEventListener("click", toggleTheme);

  await loadFonts();
  populateDefenseAndHeroOptions();
  setupOcrDropzone();

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
    if (config.targetingPriority) els.targeting.value = config.targetingPriority;
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
function drawIfPresent(layout, value, colorOverride, outline = false) {
  if (value === null || value === undefined || String(value).trim() === "") return;
  ctx.fillStyle = colorOverride || layout.color;
  ctx.font = layout.font;
  ctx.textAlign = layout.align;

  if (outline) {
    ctx.strokeStyle = "black"
    ctx.lineWidth = 4
    ctx.strokeText(String(value), layout.x, layout.y)
  }
  
  ctx.fillText(String(value), layout.x, layout.y);
}

// Wraps text across up to `maxLines` lines (default 2), truncating the
// final line with "…" if it still doesn't fit. Uses layout.maxWidth and
// layout.lineHeight in addition to the usual x/y/font/color/align.
function drawDefenseName(layout, value, maxLines = 2) {
  if (value === null || value === undefined || String(value).trim() === "") return;

  ctx.fillStyle = layout.color;
  ctx.font = layout.font;
  ctx.textAlign = layout.align;

  const maxWidth = 200;
  const lineHeight = 28;
  const words = String(value).split(/\s+/);

  if (els.fusion.checked) words.unshift('Fused')

  const lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = words[i];
      if (lines.length === maxLines - 1) {
        let rest = words.slice(i).join(" ");
        while (ctx.measureText(rest + "…").width > maxWidth && rest.length > 0) {
          rest = rest.slice(0, -1);
        }
        if (rest !== words.slice(i).join(" ")) rest += "…";
        lines.push(rest);
        line = "";
        i = words.length; // stop the loop
      }
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((l, idx) => {
    ctx.fillText(l, layout.x, layout.y + idx * lineHeight);
  });
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
  drawDefenseName(LAYOUT.defenseName, els.defense.value);

  // 4. Level — always has a real value (no blank state), so it always draws.
  drawIfPresent(LAYOUT.level, els.level.value, undefined, true);

  // 5. Hero — colored per-hero via HERO_COLORS, falls back to LAYOUT.hero.color.
  drawIfPresent(LAYOUT.hero, els.hero.value, HERO_COLORS[els.hero.value]);

  // 6. Mana
  drawIfPresent(LAYOUT.mana, els.mana.value, undefined, true);

  // 7. DU
  drawIfPresent(LAYOUT.du, els.du.value, undefined, true);

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
  const stats = LAYOUT.defStats;
  stats.entries.forEach(col => {
    const value = els[col.key].value;
    if (value.trim() === "") return;
    ctx.fillStyle = stats.valueColor;
    ctx.font = stats.valueFont;
    ctx.textAlign = "right";
    ctx.fillText(value, col.x, col.y);
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
    a.download = (els.fusion.checked ? "Fused_" : "") + (els.defense.value || "card").replace(/\s+/g, "_") + ".png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

init();
