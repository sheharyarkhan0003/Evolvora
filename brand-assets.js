const sharp = require("sharp");
const path = require("path");
// Resolve against this repo, not an absolute path. An earlier hard-coded path
// pointed at a different checkout, so regenerating wrote to the wrong folder.
const OUT = path.join(__dirname, "assets", "img");

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs><linearGradient id="eg" x1="0.1" y1="0" x2="0.9" y2="1">
    <stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#2f4fd8"/>
  </linearGradient></defs>
  <g fill="url(#eg)">
    <path d="M48 10 L16 60 L48 110 L70 110 L44 63 L44 57 L70 10 Z"/>
    <path d="M50 10 H112 L92 42 H30 Z"/>
    <path d="M54 46 H104 L84 78 H34 Z"/>
    <path d="M50 78 H112 L92 110 H30 Z"/>
  </g>
</svg>`;

// OG / social share image 1200x630
const OG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1226"/><stop offset="0.6" stop-color="#0a0e1c"/><stop offset="1" stop-color="#0e0a24"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.28" cy="0.35" r="0.7">
      <stop offset="0" stop-color="#3b82f6" stop-opacity="0.35"/><stop offset="1" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="eg" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#2f4fd8"/>
    </linearGradient>
    <linearGradient id="tg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#93c5fd"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(96,180) scale(2.1)" fill="url(#eg)">
    <path d="M48 10 L16 60 L48 110 L70 110 L44 63 L44 57 L70 10 Z"/>
    <path d="M50 10 H112 L92 42 H30 Z"/>
    <path d="M54 46 H104 L84 78 H34 Z"/>
    <path d="M50 78 H112 L92 110 H30 Z"/>
  </g>
  <text x="360" y="288" font-family="Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="10" fill="#ffffff">EVOLVORA</text>
  <text x="362" y="352" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="7" fill="url(#tg)">SOFTWARE HOUSE</text>
  <text x="364" y="410" font-family="Arial, sans-serif" font-size="26" fill="#9db0d6">We design &amp; build web, mobile &amp; cloud software</text>
  <text x="364" y="462" font-family="Arial, sans-serif" font-size="20" letter-spacing="4" fill="#6d7fa6">BUILDING A SMARTER TOMORROW · evolvoratech.com</text>
</svg>`;

/* App-icon lockup: the mark on a dark rounded square. Used for every favicon
   and the Apple touch icon. Deliberately mark-only - the wordmark and tagline
   are illegible below ~64px, so icons must never carry them. */
const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="26" fill="#0a0e1c"/>
  <g transform="translate(4,4) scale(0.93)">
    <linearGradient id="e" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#2f4fd8"/>
    </linearGradient>
    <g fill="url(#e)">
      <path d="M48 10 L16 60 L48 110 L70 110 L44 63 L44 57 L70 10 Z"/>
      <path d="M50 10 H112 L92 42 H30 Z"/>
      <path d="M54 46 H104 L84 78 H34 Z"/>
      <path d="M50 78 H112 L92 110 H30 Z"/>
    </g>
  </g>
</svg>`;

/* Every output keeps the exact pixel size it already had, so the hard-coded
   width/height attributes and <link sizes="..."> in the markup stay correct. */
(async () => {
  const fs = require("fs");
  const pngToIco = require("png-to-ico").default; // ESM-style default export
  const clear = { r:0, g:0, b:0, alpha:0 };
  const icon = (px) => sharp(Buffer.from(ICON)).resize(px, px).png().toFile(`${OUT}/favicon-${px}.png`);

  // transparent mark, 512
  await sharp(Buffer.from(MARK)).resize(512, 512, { fit:"contain", background: clear })
    .png().toFile(`${OUT}/evolvora-mark.png`);

  // social share image, 1200x630
  await sharp(Buffer.from(OG)).png().toFile(`${OUT}/og-image.png`);

  // square padded logo on dark, 512 - this is the one referenced by JSON-LD
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="96" fill="#0a0e1c"/></svg>`))
    .composite([{ input: await sharp(Buffer.from(MARK)).resize(340,340).png().toBuffer(), top:86, left:86 }])
    .png().toFile(`${OUT}/evolvora-logo.png`);

  // favicons + Apple touch icon (opaque: iOS ignores transparency)
  await icon(48);
  await icon(192);
  await sharp(Buffer.from(ICON)).resize(180,180).png().toFile(`${OUT}/apple-touch-icon.png`);
  fs.writeFileSync(`${OUT}/favicon.svg`, ICON.replace(/\n\s*/g, ""), "utf8");

  // favicon.ico carries 32 + 16 for legacy browsers
  const ico = await pngToIco([
    await sharp(Buffer.from(ICON)).resize(32,32).png().toBuffer(),
    await sharp(Buffer.from(ICON)).resize(16,16).png().toBuffer(),
  ]);
  fs.writeFileSync(path.join(__dirname, "favicon.ico"), ico);

  console.log("brand assets written to " + OUT);
})();
