const sharp = require("sharp");
const OUT = "C:/Practice Projects/SchoolSync/evolvora-website/assets/img";

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs><linearGradient id="eg" x1="0.1" y1="0" x2="0.9" y2="1">
    <stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#6d28d9"/>
  </linearGradient></defs>
  <g fill="url(#eg)">
    <path d="M52 14 L26 60 L52 106 L70 106 L47 63 L47 57 L70 14 Z"/>
    <path d="M58 14 H102 L86 40 H42 Z"/>
    <path d="M50 47 H94 L80 73 H36 Z"/>
    <path d="M58 80 H102 L86 106 H42 Z"/>
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
      <stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="tg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(96,180) scale(2.1)" fill="url(#eg)">
    <path d="M52 14 L26 60 L52 106 L70 106 L47 63 L47 57 L70 14 Z"/>
    <path d="M58 14 H102 L86 40 H42 Z"/>
    <path d="M50 47 H94 L80 73 H36 Z"/>
    <path d="M58 80 H102 L86 106 H42 Z"/>
  </g>
  <text x="360" y="288" font-family="Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="10" fill="#ffffff">EVOLVORA</text>
  <text x="362" y="352" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="7" fill="url(#tg)">SOFTWARE HOUSE</text>
  <text x="364" y="410" font-family="Arial, sans-serif" font-size="26" fill="#9db0d6">We design &amp; build web, mobile &amp; cloud software</text>
  <text x="364" y="462" font-family="Arial, sans-serif" font-size="20" letter-spacing="4" fill="#6d7fa6">INNOVATION NEVER STOPS · evolvoratech.com</text>
</svg>`;

(async () => {
  await sharp(Buffer.from(MARK)).resize(512, 512, { fit: "contain", background: { r:0,g:0,b:0,alpha:0 } }).png().toFile(`${OUT}/evolvora-mark.png`);
  await sharp(Buffer.from(OG)).png().toFile(`${OUT}/og-image.png`);
  // logo on dark for JSON-LD (square, padded)
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="96" fill="#0a0e1c"/></svg>`))
    .composite([{ input: await sharp(Buffer.from(MARK)).resize(340,340).png().toBuffer(), top:86, left:86 }])
    .png().toFile(`${OUT}/evolvora-logo.png`);
  console.log("brand assets written");
})();
