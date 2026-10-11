/* Makes the extra image files build-site.js serves through <picture>:
   - stem.avif         AVIF at the original size (smaller than the WebP)
   - stem-<w>.avif     narrower copies, for srcset on phones and small columns
   - stem-<w>.webp
   The original .jpg/.png/.webp are never touched, so their pixel sizes (and the
   width/height the markup reads from them) stay the same.

   Run after adding or replacing a photo:  node optimize-images.js
   Files already newer than their source are skipped. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG = path.join(__dirname, "assets", "img");
// Must match RESP_WIDTHS in build-site.js.
const WIDTHS = [360, 640, 960, 1280];

const jpgs = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".jpg")) jpgs.push(p);
  }
})(IMG);

const fresh = (out, src) => fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

(async () => {
  let made = 0;
  for (const src of jpgs) {
    const stem = src.slice(0, -4);
    const { width } = await sharp(src).metadata();
    const jobs = [[stem + ".avif", null, "avif"]];
    for (const w of WIDTHS) if (w < width) jobs.push([`${stem}-${w}.avif`, w, "avif"], [`${stem}-${w}.webp`, w, "webp"]);
    for (const [out, w, fmt] of jobs) {
      if (fresh(out, src)) continue;
      let img = sharp(src);
      if (w) img = img.resize({ width: w });
      // Screenshots carry small UI text, so AVIF stays at a quality that keeps it sharp.
      img = fmt === "avif" ? img.avif({ quality: 60, effort: 6 }) : img.webp({ quality: 80 });
      await img.toFile(out);
      made++;
    }
  }
  console.log(`optimize-images: ${made} file(s) written, ${jpgs.length} source image(s).`);
})();
