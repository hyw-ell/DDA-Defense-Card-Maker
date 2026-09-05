/* ============================================================
   LAYOUT CONFIG
   ------------------------------------------------------------
   This is the ONLY place you should need to edit to reposition
   things. Every value is in canvas pixels (canvas is 360x430,
   matching the template). Turn on the "Show position grid"
   checkbox in the form to see a labeled ruler while you tune
   these numbers, and click anywhere on the preview to read off
   the exact x/y of that spot in the small text under the canvas.
   ============================================================ */

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 430;

const TEMPLATE_SRC = "assets/template.png";
const MANIFEST_SRC = "assets/manifest.json";

const LAYOUT = {
  category: {
    x: 20, y: 34,
    font: "600 12px Arial",
    color: "#555555",
    align: "left",
    letterSpacing: 1 // px, applied manually below
  },
  title: {
    x: 20, y: 64,
    font: "bold 26px Georgia",
    color: "#111111",
    align: "left"
  },
  subtitle: {
    x: 20, y: 86,
    font: "16px Georgia",
    color: "#444444",
    align: "left"
  },
  asset: {
    x: 110, y: 105,
    width: 140,
    height: 140
    // draws the chosen asset image inside this box, preserving aspect ratio
  },
  statBar: {
    x: 20, y: 268,
    width: 320, height: 14,
    trackColor: "#e5e2da",
    label: true
  },
  description: {
    x: 20, y: 300,
    maxWidth: 320,
    lineHeight: 18,
    font: "14px Arial",
    color: "#333333",
    align: "left"
  },
  id: {
    x: 20, y: 402,
    font: "12px monospace",
    color: "#777777",
    align: "left"
  },
  date: {
    x: 340, y: 402,
    font: "12px monospace",
    color: "#777777",
    align: "right"
  },
  footer: {
    x: 180, y: 418,
    font: "italic 11px Georgia",
    color: "#999999",
    align: "center"
  }
};

/* ============================================================
   STATE + ELEMENTS
   ============================================================ */

const canvas = document.getElementById("card-canvas");
const ctx = canvas.getContext("2d");
const coordReadout = document.getElementById("coord-readout");

const els = {
  category: document.getElementById("f-category"),
  title: document.getElementById("f-title"),
  subtitle: document.getElementById("f-subtitle"),
  asset: document.getElementById("f-asset"),
  stat: document.getElementById("f-stat"),
  statOut: document.getElementById("f-stat-out"),
  description: document.getElementById("f-description"),
  id: document.getElementById("f-id"),
  date: document.getElementById("f-date"),
  footer: document.getElementById("f-footer"),
  color: document.getElementById("f-color"),
  grid: document.getElementById("f-grid")
};

let templateImg = null;
let assetImgCache = {}; // filename -> loaded HTMLImageElement

/* ============================================================
   LOAD TEMPLATE + MANIFEST, THEN INITIAL RENDER
   ============================================================ */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load " + src));
    img.src = src;
  });
}

async function init() {
  // Load the template background. If it's missing, draw a placeholder
  // so the page still works before you've added your template file.
  try {
    templateImg = await loadImage(TEMPLATE_SRC);
  } catch (e) {
    console.warn(e.message + " — using a placeholder background instead.");
    templateImg = null;
  }

  // Load the asset manifest (list of filenames in /assets) and
  // populate the <select>.
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

  // Default date field to today
  els.date.value = new Date().toISOString().slice(0, 10);

  attachListeners();
  render();
}

function attachListeners() {
  Object.values(els).forEach(el => {
    el.addEventListener("input", render);
  });
  els.stat.addEventListener("input", () => {
    els.statOut.textContent = els.stat.value;
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

function drawLetterSpacedText(text, x, y, spacing) {
  let cursorX = x;
  for (const ch of text) {
    ctx.fillText(ch, cursorX, y);
    cursorX += ctx.measureText(ch).width + spacing;
  }
}

function wrapText(text, maxWidth, lineHeight, x, y) {
  const words = text.split(/\s+/);
  let line = "";
  let curY = y;
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = words[i];
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, curY);
  return curY; // y of last line drawn, in case you want to place things after it
}

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

  // 1. Background template
  if (templateImg) {
    ctx.drawImage(templateImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#999999";
    ctx.font = "12px Arial";
    ctx.fillText("assets/template.png not found", 20, 20);
  }

  const accent = els.color.value;

  // 2. Category tag
  const cat = LAYOUT.category;
  ctx.fillStyle = cat.color;
  ctx.font = cat.font;
  ctx.textAlign = "left";
  drawLetterSpacedText(els.category.value.toUpperCase(), cat.x, cat.y, cat.letterSpacing);

  // 3. Title
  const t = LAYOUT.title;
  ctx.fillStyle = t.color;
  ctx.font = t.font;
  ctx.textAlign = t.align;
  ctx.fillText(els.title.value, t.x, t.y);

  // 4. Subtitle
  const st = LAYOUT.subtitle;
  ctx.fillStyle = st.color;
  ctx.font = st.font;
  ctx.textAlign = st.align;
  ctx.fillText(els.subtitle.value, st.x, st.y);

  // 5. Asset image
  const a = LAYOUT.asset;
  const chosen = els.asset.value;
  if (chosen) {
    let img = assetImgCache[chosen];
    if (!img) {
      try {
        img = await loadImage("assets/" + chosen);
        assetImgCache[chosen] = img;
      } catch (e) {
        console.warn(e.message);
      }
    }
    if (img) {
      // fit inside box, preserve aspect ratio, center it
      const scale = Math.min(a.width / img.width, a.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const dx = a.x + (a.width - w) / 2;
      const dy = a.y + (a.height - h) / 2;
      ctx.drawImage(img, dx, dy, w, h);
    }
  }

  // 6. Stat bar
  const sb = LAYOUT.statBar;
  const pct = Math.max(0, Math.min(100, Number(els.stat.value))) / 100;
  ctx.fillStyle = sb.trackColor;
  ctx.fillRect(sb.x, sb.y, sb.width, sb.height);
  ctx.fillStyle = accent;
  ctx.fillRect(sb.x, sb.y, sb.width * pct, sb.height);
  if (sb.label) {
    ctx.fillStyle = "#555555";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`${els.stat.value}/100`, sb.x, sb.y - 4);
  }

  // 7. Description (wrapped)
  const d = LAYOUT.description;
  ctx.fillStyle = d.color;
  ctx.font = d.font;
  ctx.textAlign = d.align;
  wrapText(els.description.value, d.maxWidth, d.lineHeight, d.x, d.y);

  // 8. ID
  const idc = LAYOUT.id;
  ctx.fillStyle = idc.color;
  ctx.font = idc.font;
  ctx.textAlign = idc.align;
  ctx.fillText(els.id.value, idc.x, idc.y);

  // 9. Date
  const dt = LAYOUT.date;
  ctx.fillStyle = dt.color;
  ctx.font = dt.font;
  ctx.textAlign = dt.align;
  ctx.fillText(els.date.value, dt.x, dt.y);

  // 10. Footer
  const f = LAYOUT.footer;
  ctx.fillStyle = f.color;
  ctx.font = f.font;
  ctx.textAlign = f.align;
  ctx.fillText(els.footer.value, f.x, f.y);

  // Optional position grid overlay (never included in the downloaded PNG)
  if (els.grid.checked) drawGrid();
}

/* ============================================================
   DOWNLOAD
   ============================================================ */

function downloadImage() {
  const wasGridOn = els.grid.checked;
  if (wasGridOn) {
    els.grid.checked = false;
    render();
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (els.title.value || "image").replace(/\s+/g, "_") + ".png";
    a.click();
    URL.revokeObjectURL(url);

    if (wasGridOn) {
      els.grid.checked = true;
      render();
    }
  }, "image/png");
}

init();
