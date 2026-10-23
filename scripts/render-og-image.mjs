// Renders the link-preview image (WhatsApp, LinkedIn, X, Slack...) to public/og-image.png at 1200x630
// with the brand font, logo and the Shaniwar Wada line drawing.
//
// Usage: node scripts/render-og-image.mjs
// Needs Google Chrome (override the path with CHROME_PATH). Re-run after changing the date, venue or design.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const WIDTH = 1200;
const HEIGHT = 630;
// Rendered at 2x, then scaled down, for cleaner text edges.
const SCALE = 2;

// Kept in step with lib/event.ts by hand: this script runs outside the TypeScript build.
const DATE = "Sunday, 6 December 2026";
const VENUE = "The Orchid, Pune";

const fontUrl = pathToFileURL(join(root, "scripts/assets/Outfit-latin.woff2")).href;
const logoUrl = pathToFileURL(join(root, "public/gdg-cloud-pune-logo.png")).href;
const wadaUrl = pathToFileURL(join(root, "public/assets/wada.svg")).href;

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      @font-face { font-family: Outfit; src: url("${fontUrl}") format("woff2"); font-weight: 100 900; }
      html, body { margin: 0; background: #1e1e1e; }
      .card {
        position: relative; box-sizing: border-box; width: ${WIDTH}px; height: ${HEIGHT}px; padding: 64px 72px;
        overflow: hidden; font-family: Outfit; color: #f0f0f0; -webkit-font-smoothing: antialiased;
        background:
          linear-gradient(90deg, #1e1e1e 0%, rgb(30 30 30 / 0.85) 46%, rgb(30 30 30 / 0) 70%),
          repeating-linear-gradient(0deg, transparent 0 47px, #2c2c2c 47px 48px),
          repeating-linear-gradient(90deg, transparent 0 47px, #2c2c2c 47px 48px),
          #1e1e1e;
      }
      .wada { position: absolute; right: -56px; bottom: 34px; width: 580px; height: auto; opacity: 0.92; }
      .logo { display: block; width: 300px; height: auto; }
      .pill { display: inline-block; margin-top: 44px; padding: 8px 16px; font-size: 20px; font-weight: 600; line-height: 1;
        color: #1e1e1e; background: #f9ab00; border: 2.5px solid #f0f0f0; border-radius: 999px; }
      .wordmark { margin-top: 22px; font-size: 92px; font-weight: 700; line-height: 0.92; letter-spacing: -0.04em; }
      .row { display: flex; align-items: center; gap: 14px; margin-top: 28px; }
      .badge { padding: 9px 22px; font-size: 30px; font-weight: 500; line-height: 1; border: 3px solid #f0f0f0; border-radius: 999px; }
      .solid { font-weight: 600; color: #1e1e1e; background: #f0f0f0; }
      .bar { display: flex; gap: 8px; width: 220px; height: 16px; margin-left: 6px; }
      .bar span { flex: 1; border: 3px solid #f0f0f0; border-radius: 999px; }
      .facts { position: absolute; left: 72px; bottom: 60px; font-size: 26px; font-weight: 600; line-height: 1.3; }
      .facts span { color: #b8b8b8; font-weight: 500; }
    </style>
  </head>
  <body>
    <div class="card">
      <img class="wada" src="${wadaUrl}" alt="">
      <img class="logo" src="${logoUrl}" alt="">
      <div class="pill">5th edition</div>
      <div class="wordmark">Cloud<br>Community Day</div>
      <div class="row">
        <span class="badge">Pune</span><span class="badge solid">2026</span>
        <div class="bar"><span style="background:#4285f4"></span><span style="background:#34a853"></span><span style="background:#f9ab00"></span><span style="background:#ea4335"></span></div>
      </div>
      <div class="facts">${DATE} <span>&middot; ${VENUE}</span></div>
    </div>
  </body>
</html>`;

const workDir = mkdtempSync(join(tmpdir(), "og-image-"));
const htmlPath = join(workDir, "og.html");
const pngPath = join(workDir, "og.png");
writeFileSync(htmlPath, html);

execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  `--force-device-scale-factor=${SCALE}`,
  `--window-size=${WIDTH},${HEIGHT}`,
  "--virtual-time-budget=3000",
  `--screenshot=${pngPath}`,
  pathToFileURL(htmlPath).href,
], { stdio: "pipe" });

// Flat colours and text: a palette PNG is visually identical and far smaller than the raw screenshot.
const outFile = join(root, "public/og-image.png");
const png = await sharp(readFileSync(pngPath))
  .resize(WIDTH, HEIGHT)
  .png({ palette: true, colors: 256, quality: 100, compressionLevel: 9, effort: 10 })
  .toBuffer();
writeFileSync(outFile, png);
console.log(`Rendered ${outFile} (${Math.round(png.length / 1024)} KB)`);
