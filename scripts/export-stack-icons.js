const si = require("simple-icons");
const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "..", "assets", "img", "stack");
fs.mkdirSync(out, { recursive: true });

const items = [
  ["angular", "siAngular", "#DD0031"],
  ["dotnet", "siDotnet", "#512BD4"],
  ["nodedotjs", "siNodedotjs", "#5FA04E"],
  ["typescript", "siTypescript", "#3178C6"],
  ["postgresql", "siPostgresql", "#4169E1"],
  ["supabase", "siSupabase", "#3FCF8E"],
  ["docker", "siDocker", "#2496ED"],
  ["cloudflare", "siCloudflare", "#F38020"],
  ["figma", "siFigma", "#F24E1E"],
];

// Official multi-color Figma mark (original brand colors)
const figmaMulti = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 57" role="img" aria-label="Figma">
  <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
  <path fill="#A259FF" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
  <path fill="#1ABCFE" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
  <path fill="#0ACF83" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
  <path fill="#FF7262" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
</svg>`;

for (const [slug, key, color] of items) {
  if (slug === "figma") {
    fs.writeFileSync(path.join(out, "figma.svg"), figmaMulti);
    console.log("wrote figma (multi-color)");
    continue;
  }
  const icon = si[key];
  if (!icon) {
    console.log("missing", key);
    continue;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${icon.title}">` +
    `<path fill="${color}" d="${icon.path}"/></svg>\n`;
  fs.writeFileSync(path.join(out, `${slug}.svg`), svg);
  console.log("wrote", slug, icon.title);
}
