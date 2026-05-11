/**
 * scripts/generate-icons.mjs
 *
 * Generates all required PNG favicon/icon files AND favicon.ico from the SVG logo.
 * Uses sharp (native binding) to render SVG → PNG at multiple sizes,
 * and png-to-ico to combine PNGs into a multi-resolution ICO file.
 *
 * Run: node scripts/generate-icons.mjs
 */

import sharp from "sharp";
import {
  writeFileSync,
  existsSync,
  unlinkSync,
  mkdtempSync,
  readFileSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

/* ── SVG source (same paths as components/brand/WedInviterLogo.tsx) ── */
const SVG_LOGO = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C9A962"/>
      <stop offset="33%" stop-color="#E8638C"/>
      <stop offset="66%" stop-color="#C0185F"/>
      <stop offset="100%" stop-color="#F7E7CE"/>
    </linearGradient>
  </defs>
  <path d="M50,85 C30,85 12,68 12,45 C12,22 30,8 50,18 C55,22 58,32 55,40 C53,52 50,68 50,85 Z" fill="url(#g)"/>
  <path d="M50,85 C70,85 88,68 88,45 C88,22 70,8 50,18 C45,22 42,32 45,40 C47,52 50,68 50,85 Z" fill="url(#g)"/>
</svg>`;

/* ── ICO sizes (multi-resolution favicon.ico) ── */
const ICO_SIZES = [16, 32, 48];

/* ── PNG icon manifest ── */
const ICONS = [
  { name: "favicon-96x96.png", size: 96 },
  { name: "apple-icon.png", size: 180 },
  { name: "web-app-manifest-192x192.png", size: 192 },
  { name: "web-app-manifest-512x512.png", size: 512 },
];

/**
 * Render SVG to a PNG buffer at the given size.
 */
async function renderPngBuffer(size) {
  const svgBuffer = Buffer.from(SVG_LOGO);
  return sharp(svgBuffer)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function main() {
  console.log("Generating PNG icons from SVG...\n");

  const errors = [];

  for (const icon of ICONS) {
    const outPath = join(PUBLIC_DIR, icon.name);
    console.log(`  → ${icon.name} (${icon.size}×${icon.size})`);

    try {
      const buf = await renderPngBuffer(icon.size);
      writeFileSync(outPath, buf);
      console.log(`    ✓ Written to public/${icon.name}`);
    } catch (err) {
      errors.push({ name: icon.name, error: err.message });
      console.error(`    ✗ FAILED: ${err.message}`);
    }
  }

  /* ── Generate multi-resolution favicon.ico ── */
  console.log(`\n  → favicon.ico (${ICO_SIZES.join("×, ")}×)`);
  try {
    const pngBuffers = await Promise.all(
      ICO_SIZES.map((s) => renderPngBuffer(s)),
    );
    const icoBuffer = await pngToIco(pngBuffers);
    writeFileSync(join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
    console.log(`    ✓ Written to public/favicon.ico`);
  } catch (err) {
    errors.push({ name: "favicon.ico", error: err.message });
    console.error(`    ✗ FAILED: ${err.message}`);
  }

  if (errors.length > 0) {
    console.error(`\n⚠ ${errors.length} file(s) failed to generate:`);
    for (const e of errors) {
      console.error(`  - ${e.name}: ${e.error}`);
    }
    process.exit(1);
  }

  console.log("\n✓ All icons generated successfully.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
