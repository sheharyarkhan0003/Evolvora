const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SITE = "https://evolvoratech.com";
/* Where the Login links point. Absolute, not the site-relative "/login", so the
   link works identically on the local dev server, in Netlify deploy previews and
   in production. Routing "/login" through a netlify redirect only worked once
   deployed - locally it resolved to localhost:8080/login, which does not exist.
   Still one constant, so moving the app to its own domain is a one-line change.
   "/login" is kept as a vanity alias in netlify.toml for old links. */
const APP_TARGET = "https://schoolsync.pages.dev/login";
const EMAIL = "contact@evolvoratech.com";
const PHONE = "+92-314-0163628";
const PHONE_DISPLAY = "+92 314 0163628";
const PHONE_TEL = "tel:+923140163628";
const ADDRESS_TEXT = "599-Q, Johar Town, Lahore 54000, Pakistan";
const FOUNDER = "Sheharyar Khan";
const OG = SITE + "/assets/img/og-image.png";

/* ---------- fonts ----------
   Self-hosted and inlined, so text no longer waits on a chain of requests to
   Google Fonts before it can paint. Two families carry the site (Inter for body,
   Space Grotesk for headings and buttons); Chakra Petch survives only as a 4 KB
   subset for the EVOLVORA wordmark and small uppercase labels.

   The "Fallback" faces are Arial resized to each web font's metrics (measured
   with fontTools against real English text), so swapping from the fallback to
   the real font moves nothing on the page. That is what fixed the homepage's
   layout shift. The same block is synced into the hand-maintained product page. */
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const FONT_HEAD = `<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>@font-face{font-family:'Inter';font-style:normal;font-weight:400 600;font-display:swap;src:url(/assets/fonts/inter-latin.woff2) format('woff2');unicode-range:${LATIN}}@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:500 700;font-display:swap;src:url(/assets/fonts/space-grotesk-latin.woff2) format('woff2');unicode-range:${LATIN}}@font-face{font-family:'Chakra Petch';font-style:normal;font-weight:700;font-display:swap;src:url(/assets/fonts/chakra-petch-700-logo.woff2) format('woff2')}@font-face{font-family:'Inter Fallback';src:local('Arial');size-adjust:106.67%;ascent-override:90.82%;descent-override:22.61%;line-gap-override:0%}@font-face{font-family:'Space Grotesk Fallback';src:local('Arial');size-adjust:108.45%;ascent-override:90.73%;descent-override:26.92%;line-gap-override:0%}</style>`;

/* One date drives both sitemap <lastmod> and WebPage dateModified so the two can
   never disagree. Caveat: it advances on every build, so only deploy when page
   content actually changed - a dateModified that moves without real edits is a
   freshness signal search engines learn to distrust. */
// Local date (YYYY-MM-DD), matching the git commit dates used by pageDate().
const BUILD_DATE = new Date().toLocaleDateString("en-CA");

/* Per-page "last changed" date, so a header or footer tweak no longer marks
   every page as freshly updated. Only the <main> content counts:
     1. main unchanged since the last commit  -> that commit's date (git history)
     2. main unchanged since the last build   -> the date already on the page
     3. otherwise                             -> today */
const { execFileSync } = require("child_process");
const norm = (s) => s.replace(/\r\n/g, "\n").trim();
const mainOf = (html) => { const m = /<main[^>]*>([\s\S]*?)<\/main>/.exec(html || ""); return m ? norm(m[1]) : null; };
const git = (args) => { try { return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return null; } };
function pageDate(file, main) {
  const rel = file.split(path.sep).join("/");
  /* Walk back through the commits that touched this file and take the oldest
     one in the unbroken run whose <main> matches today's. A commit that only
     changed the header or footer therefore does not count as a content change. */
  let found = null;
  for (const line of (git(["log", "--format=%H %cs", "--", rel]) || "").trim().split("\n").filter(Boolean)) {
    const [hash, date] = line.split(" ");
    if (mainOf(git(["show", hash + ":" + rel])) !== main) break;
    found = date;
  }
  if (found) return found;
  const p = path.join(ROOT, file);
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, "utf8");
    const d = /"dateModified":\s*"(\d{4}-\d{2}-\d{2})"/.exec(html);
    if (d && mainOf(html) === main) return d[1];
  }
  return BUILD_DATE;
}

/* ---------- logo mark ---------- */
const MARK = `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="eg" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#2f4fd8"/></linearGradient></defs><g fill="url(#eg)"><path d="M48 10 L16 60 L48 110 L70 110 L44 63 L44 57 L70 10 Z"/><path d="M50 10 H112 L92 42 H30 Z"/><path d="M54 46 H104 L84 78 H34 Z"/><path d="M50 78 H112 L92 110 H30 Z"/></g></svg>`;
const FAVICON = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#0a0e1c"/><g transform="translate(4,4) scale(0.93)"><linearGradient id="e" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#2f4fd8"/></linearGradient><g fill="url(#e)"><path d="M48 10 L16 60 L48 110 L70 110 L44 63 L44 57 L70 10 Z"/><path d="M50 10 H112 L92 42 H30 Z"/><path d="M54 46 H104 L84 78 H34 Z"/><path d="M50 78 H112 L92 110 H30 Z"/></g></g></svg>`);

/* ---------- icons (24x24, stroke via CSS) ---------- */
const I = {
  fee:`<path d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 10h18"/><circle cx="8" cy="14.5" r="1.4"/>`,
  salary:`<path d="M12 2v20"/><path d="M17 6.5c0-2-2.2-3-5-3s-5 1-5 3.2S9 9.5 12 10s5 1.3 5 3.4-2.2 3.1-5 3.1-5-1-5-3"/>`,
  clock:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`,
  bell:`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z"/><path d="M10 20a2 2 0 0 0 4 0"/>`,
  users:`<path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M22 20v-2a4 4 0 0 0-3-3.8"/><path d="M16 3.7a4 4 0 0 1 0 6.6"/>`,
  cap:`<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>`,
  layers:`<path d="M12 2 2 7l10 5 10-5Z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/>`,
  upload:`<path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M20.4 18.5A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 3 16.3"/>`,
  chart:`<path d="M3 3v18h18"/><path d="M7 15l3-4 3 3 5-7"/>`,
  shield:`<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z"/><path d="M9 12l2 2 4-4"/>`,
  send:`<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>`,
  mail:`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>`,
  phone:`<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>`,
  globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>`,
  arrow:`<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>`,
  chev:`<path d="m6 9 6 6 6-6"/>`,
  gear:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0 1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3 2 2 0 1 1-2.8-2.8 1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8 2 2 0 1 1 2.8-2.8 1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0 1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3 2 2 0 1 1 2.8 2.8 1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4 1.6 1.6 0 0 0-1.5 1Z"/>`,
  teacher:`<path d="M3 5h13v10H3z"/><path d="M16 8h5v9H10"/><circle cx="7.5" cy="9" r="1.6"/><path d="M4.5 14c.6-1.4 5-1.4 5.6 0"/>`,
  heart:`<path d="M12 21s-7-4.3-9.3-9C1.2 8.6 3 5 6.5 5 8.6 5 10 6.3 12 8.5 14 6.3 15.4 5 17.5 5 21 5 22.8 8.6 21.3 12 19 16.7 12 21 12 21Z"/>`,
  rocket:`<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.8-.8.8-2.1 0-2.9-.8-.8-2.1-.8-3-.1Z"/><path d="M9 12c6-6 9-6 11-6 0 2 0 5-6 11l-3 .9L8.1 15Z"/><circle cx="15" cy="9" r="1.4"/>`,
  book:`<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>`,
  code:`<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  monitor:`<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>`,
  mobile:`<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>`,
  pen:`<path d="M12 19l7-7 3 3-7 7-3-3Z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18Z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="1.5"/>`,
  cloud:`<path d="M17.5 19a4.5 4.5 0 0 0 .3-9A7 7 0 1 0 6 17.8"/><path d="M6 18h11.5"/>`,
  cpu:`<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>`,
  support:`<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="4" height="6" rx="1"/><rect x="18" y="14" width="4" height="6" rx="1"/><path d="M20 18v1a3 3 0 0 1-3 3h-4"/>`,
  spark:`<path d="M12 2l2.2 6.5L21 11l-6.8 2.5L12 20l-2.2-6.5L3 11l6.8-2.5Z"/>`,
  target:`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>`,
  eye:`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
  handshake:`<path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4L14 8"/><path d="m14 8-3.3-3.3a2 2 0 0 0-2.8 0L3 9.5a2 2 0 0 0 0 2.8L7 16"/><path d="m8 12 2 2"/>`,
  scissors:`<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9"/><path d="M14.5 14.5 20 20"/><path d="M8.1 8.1 12 12"/>`,
  shop:`<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 11.5V20h14v-8.5"/><path d="M10 20v-5h4v5"/>`,
  ruler:`<path d="M3 17 17 3l4 4L7 21Z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>`,
  star:`<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>`,
};
const svg = (name) => `<svg viewBox="0 0 24 24">${I[name]}</svg>`;

/* ---------- social profiles ----------
   Single source of truth: drives both the visible footer links and the
   Organization "sameAs" list, so the two can never drift apart. Brand marks
   are solid shapes, so they are filled rather than stroked like the icons above. */
const BRAND_I = {
  linkedin:`<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>`,
  youtube:`<path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>`,
  instagram:`<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.71-2.13 1.38C1.34 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.71 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.71-1.46-1.38-2.13C21.32 1.34 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>`,
  github:`<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.4-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/>`,
};
const SOCIAL = [
  ["LinkedIn","linkedin","https://www.linkedin.com/company/evolvora-technologies/"],
  ["YouTube","youtube","https://www.youtube.com/@evolvoratechnologies"],
  ["Instagram","instagram","https://www.instagram.com/evolvora.tech/"],
  ["GitHub","github","https://github.com/Evolvora-Technologies"],
];
const socialRow = () => `<ul class="footer-social">${SOCIAL.map(([name,ic,url]) =>
  `<li><a href="${url}" aria-label="Evolvora Technologies on ${name}" title="${name}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true">${BRAND_I[ic]}</svg></a></li>`).join("")}</ul>`;

/* Render-blocking assets are inlined so first paint waits on no extra request.
   - theme-init.js must run before paint (else the wrong theme flashes), so it
     cannot be deferred. It is inlined, and its hash is added to script-src in
     the CSP below; editing the file changes the hash, so rebuild after.
   - styles.css (~15 KB gzipped) is inlined whole. Critical-CSS extraction needs
     a headless browser, and loading the rest async needs an inline onload
     handler the CSP blocks. The trade-off: it is not cached across pages. */
/* One line, so a CRLF checkout cannot change the bytes and break the hash
   (every statement in the file ends in ';', so joining lines is safe). */
const THEME_INIT_JS = norm(fs.readFileSync(path.join(ROOT, "assets/js/theme-init.js"), "utf8")).replace(/\s*\n\s*/g, " ");
const THEME_INIT = `<script>${THEME_INIT_JS}</script>`;
const THEME_INIT_HASH = "'sha256-" + require("crypto").createHash("sha256").update(THEME_INIT_JS, "utf8").digest("base64") + "'";
const SITE_CSS = fs.readFileSync(path.join(ROOT, "assets/css/styles.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")   // comments (the file has none inside strings)
  .replace(/\s+/g, " ")
  .replace(/\s*([{};])\s*/g, "$1")   // not ':' or ',' - a space there can be a descendant combinator
  .trim();

const NAV_MOBILE_CRITICAL =`<style>@media(max-width:1000px){.nav-links:not(.open){display:none!important}.nav-links.open{display:flex!important;position:fixed;top:var(--nav-h);left:0;right:0;bottom:0;z-index:99;flex-direction:column;background:var(--nav-mobile-bg);overflow-y:auto}.nav-toggle{display:grid!important}.nav-toggle .icon-menu{display:block!important}.nav-toggle:not(.open) .icon-close{display:none!important}.nav-toggle.open .icon-menu{display:none!important}.nav-toggle.open .icon-close{display:block!important}}</style>`;

const NAV_TOGGLE = `<button class="nav-toggle" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false"><svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;

const THEME_TOGGLE = `<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to light mode"><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg></button>`;

/* ---------- responsive images ----------
   Reads real intrinsic dimensions off disk so width/height match the file and
   the browser reserves the right box (no layout shift). Serves WebP where the
   browser supports it and falls back to the .jpg/.png sibling otherwise. */
function imgSize(file) {
  const p = path.join(ROOT, "assets/img", file);
  if (!fs.existsSync(p)) return null;
  const b = fs.readFileSync(p);
  // PNG: IHDR is always the first chunk
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }
  // JPEG: walk the segment markers to the first SOFn
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

const imgExists = (f) => fs.existsSync(path.join(ROOT, "assets/img", f));

/* AVIF first, then WebP, each with narrower copies so phones and half-width
   columns do not download the full-size file. The copies are made by
   optimize-images.js; RESP_WIDTHS must match its WIDTHS. `sizes` is how wide
   the image is drawn: the default fits the half-column screenshots. */
const RESP_WIDTHS = [360, 640, 960, 1280];
/* Phone screenshots in .phone-pair: 44% of the column on small screens, 240px max. */
const PHONE_SIZES = "(max-width: 1000px) 44vw, 240px";
const SHOT_SIZES = "(max-width: 1000px) calc(100vw - 48px), 560px";
function srcsetFor(stem, ext, fullW) {
  const list = RESP_WIDTHS.filter(w => w < fullW && imgExists(`${stem}-${w}.${ext}`))
    .map(w => `/assets/img/${stem}-${w}.${ext} ${w}w`);
  if (!imgExists(`${stem}.${ext}`)) return null;
  return [...list, `/assets/img/${stem}.${ext} ${fullW}w`].join(", ");
}
function picture(img, { alt = "", eager = false, cls = "", draggable = false, sizes = SHOT_SIZES } = {}) {
  const stem = img.replace(/\.[a-z0-9]+$/i, "");
  // Prefer a small JPEG fallback; images with real transparency keep the PNG.
  const fallback = imgExists(stem + ".jpg") ? stem + ".jpg" : img;
  const d = imgSize(fallback) || imgSize(img);
  const dim = d ? ` width="${d.w}" height="${d.h}"` : "";
  const load = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  const tag = `<img${cls ? ` class="${cls}"` : ""} src="/assets/img/${fallback}" alt="${alt}"${load} decoding="async"${dim}${draggable ? "" : ' draggable="false"'}>`;
  const sources = d ? ["avif", "webp"].map(ext => {
    const set = srcsetFor(stem, ext, d.w);
    return set ? `<source type="image/${ext}" srcset="${set}" sizes="${sizes}">` : "";
  }).join("") : "";
  return sources ? `<picture>${sources}${tag}</picture>` : tag;
}

/* ---------- browser mockup ---------- */
const shot = (img, label, alt, eager, sizes) =>
  `<div class="browser"><div class="browser-bar"><span></span><span></span><span></span><i>${label}</i></div>${picture(img, { alt: alt || label || "Evolvora software screenshot", eager, ...(sizes ? { sizes } : {}) })}</div>`;

const WHY_PILLARS = [
  {
    phase: "01",
    art: "art-product",
    label: "Product discovery",
    title: "Product mindset",
    alt: "Diagram: scattered user signals converging into one clear product outcome",
    desc: "We think about your users and outcomes, not just tickets, because we run our own products too.",
    points: ["User-first discovery and clear scope", "Outcomes and metrics, not ticket counts", "We ship and operate our own software"]
  },
  {
    phase: "02",
    art: "art-craft",
    label: "Engineering craft",
    title: "Senior craftsmanship",
    alt: "Diagram: cleanly separated architecture layers with well-defined interfaces",
    desc: "Clean, maintainable code and thoughtful design: software built to last, not just to demo.",
    points: ["Clean architecture and readable code", "Design systems that scale with you", "Built to maintain, not just to launch"]
  },
  {
    phase: "03",
    art: "art-visibility",
    label: "Project visibility",
    title: "Transparent & reliable",
    alt: "Diagram: a milestone timeline showing completed, current and upcoming weeks",
    desc: "Clear scope, regular demos and honest timelines. You always know where things stand.",
    points: ["Weekly demos and honest progress updates", "Clear scope, milestones and timelines", "No surprises: you always know what's next"]
  },
  {
    phase: "04",
    art: "art-partner",
    label: "Long-term support",
    title: "Long-term partner",
    alt: "Diagram: a growth path that continues with milestones well past the launch marker",
    desc: "We stay after launch, maintaining, improving and scaling your software as you grow.",
    points: ["Post-launch maintenance and support", "Iterative improvements as you grow", "A team that stays with you long after go-live"]
  }
];

/* ---------- Why Evolvora: generated SVG art panels ----------
   Drawn from the CSS design tokens (--art-*, --blue, --sky, --cyan, --purple)
   so the panels re-theme with the site instead of being fixed bitmaps.
   Defined once as <symbol>s and referenced by <use> at each render site. */
const ART_W = 800, ART_H = 1000;
const aFill = (t) => `style="fill:var(${t})"`;
const aStroke = (t, w = 2) => `style="fill:none;stroke:var(${t});stroke-width:${w}"`;

/* The panels are drawn at 4:5 but rendered with preserveAspectRatio="slice",
   so either axis can be cropped depending on breakpoint. Everything meaningful
   stays inside this safe zone, and the caption is centred so it survives both. */
const SAFE = { x1: 130, x2: 670, y1: 250, y2: 880 };

/* caption: phase badge over a tracked label, centred at the top of every panel */
function artCaption(phase, label) {
  return `<g>
      <rect x="368" y="96" width="64" height="64" rx="18" ${aFill("--blue")} opacity=".16"/>
      <rect x="368" y="96" width="64" height="64" rx="18" ${aStroke("--blue", 1.5)} opacity=".45"/>
      <text x="400" y="139" text-anchor="middle" style="fill:var(--sky);font-family:'Chakra Petch',sans-serif;font-size:26px;font-weight:700">${phase}</text>
      <text x="400" y="200" text-anchor="middle" style="fill:var(--art-muted);font-family:'Chakra Petch',sans-serif;font-size:20px;font-weight:600;letter-spacing:.16em">${label.toUpperCase()}</text>
    </g>`;
}

/* 01 — many scattered user signals converge into one clear outcome */
function artProduct() {
  const nodes = [
    [180, 330, 12, "--art-muted"], [300, 288, 9, "--art-muted"], [400, 302, 15, "--cyan"],
    [500, 286, 10, "--art-muted"], [620, 336, 13, "--sky"], [240, 432, 10, "--art-muted"],
    [560, 430, 12, "--sky"]
  ];
  const cx = 400, cy = 662;
  const rays = nodes.map(([x, y]) =>
    `<line x1="${x}" y1="${y}" x2="${cx}" y2="${cy}" style="fill:none;stroke:var(--sky);stroke-width:1.5" opacity=".28"/>`).join("");
  const dots = nodes.map(([x, y, r, tok]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" ${aFill(tok)} opacity=".92"/>`).join("");
  return `${rays}
    <circle cx="${cx}" cy="${cy}" r="140" ${aFill("--blue")} opacity=".08"/>
    <circle cx="${cx}" cy="${cy}" r="140" ${aStroke("--art-line", 1.5)}/>
    <circle cx="${cx}" cy="${cy}" r="98" ${aStroke("--blue", 2)} opacity=".6"/>
    <circle cx="${cx}" cy="${cy}" r="54" ${aStroke("--sky", 2.5)} opacity=".85"/>
    <circle cx="${cx}" cy="${cy}" r="20" ${aFill("--sky")}/>
    ${dots}`;
}

/* 02 — cleanly separated layers joined by well-defined interfaces */
function artCraft() {
  const rows = [280, 420, 560, 700];
  const modOpacity = [".58", ".46", ".38", ".32"];
  const layers = rows.map((y, i) => {
    const mods = [0, 1, 2].map((m) =>
      `<rect x="${214 + m * 126}" y="${y + 26}" width="102" height="44" rx="9" ${aFill(i === 0 ? "--sky" : "--blue")} opacity="${modOpacity[i]}"/>`).join("");
    return `<rect x="190" y="${y}" width="420" height="96" rx="16" ${aFill("--art-bg-2")}/>
      <rect x="190" y="${y}" width="420" height="96" rx="16" ${aStroke("--art-line", 1.5)}/>
      ${mods}`;
  }).join("");
  const seams = rows.slice(1).map((y) => [280, 400, 520].map((x) =>
    `<line x1="${x}" y1="${y - 44}" x2="${x}" y2="${y}" ${aStroke("--blue", 1.5)} opacity=".5"/>`).join("")).join("");
  const ticks = Array.from({ length: 18 }, (_, i) => {
    const y = 288 + i * 30, long = i % 3 === 0;
    return `<line x1="150" y1="${y}" x2="${150 + (long ? 24 : 13)}" y2="${y}" style="fill:none;stroke:var(${long ? "--sky" : "--art-hollow"});stroke-width:${long ? 2 : 1.5}" opacity="${long ? ".8" : ".55"}"/>`;
  }).join("");
  return `${ticks}${seams}${layers}`;
}

/* 03 — milestone timeline: weeks done, the week in flight, weeks ahead */
function artVisibility() {
  const ys = [290, 420, 550, 680, 810];
  const widths = [250, 215, 265, 175, 140];
  const rail = `<line x1="250" y1="272" x2="250" y2="828" ${aStroke("--art-hollow", 2)} opacity=".6"/>
    <line x1="250" y1="272" x2="250" y2="${ys[3]}" ${aStroke("--blue", 3)} opacity=".85"/>`;
  const rows = ys.map((y, i) => {
    const done = i < 3, current = i === 3;
    const tok = done ? "--blue" : current ? "--cyan" : "--art-hollow";
    const node = done
      ? `<circle cx="250" cy="${y}" r="19" ${aFill("--blue")}/>
         <path d="M241 ${y} l6 7 12 -14" style="fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/>`
      : current
        ? `<circle cx="250" cy="${y}" r="27" ${aFill("--cyan")} opacity=".18"/>
           <circle cx="250" cy="${y}" r="19" ${aStroke("--cyan", 3)}/>
           <circle cx="250" cy="${y}" r="7" ${aFill("--cyan")}/>`
        : `<circle cx="250" cy="${y}" r="19" ${aStroke("--art-hollow", 2)}/>`;
    return `${node}
      <rect x="300" y="${y - 26}" width="${widths[i]}" height="16" rx="8" ${aFill(tok)} opacity="${done ? ".68" : current ? ".6" : ".34"}"/>
      <rect x="300" y="${y + 2}" width="${Math.round(widths[i] * 0.58)}" height="10" rx="5" ${aFill("--art-hollow")} opacity=".45"/>
      <text x="${300 + widths[i] + 20}" y="${y - 11}" style="fill:var(--art-muted);font-family:'Chakra Petch',sans-serif;font-size:20px;font-weight:600">W${i + 1}</text>`;
  }).join("");
  return `${rail}${rows}`;
}

/* 04 — the path keeps climbing well past the launch marker */
function artPartner() {
  const pts = [[165, 790], [250, 715], [335, 740], [420, 600], [505, 555], [590, 415], [660, 330]];
  const line = (p) => p.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const cap = "stroke-linecap:round;stroke-linejoin:round";
  const dots = pts.map(([x, y], i) => {
    const past = i >= 3;
    return `<circle cx="${x}" cy="${y}" r="${past ? 12 : 10}" ${aFill(past ? "--cyan" : "--sky")} opacity="${past ? ".95" : ".8"}"/>`;
  }).join("");
  return `<path d="${line(pts)} L660 812 L165 812 Z" ${aFill("--blue")} opacity=".09"/>
    <path d="${line(pts)}" style="fill:none;stroke:var(--cyan);stroke-width:4;${cap}"/>
    <path d="${line(pts.slice(0, 4))}" style="fill:none;stroke:var(--sky);stroke-width:4;${cap}"/>
    <line x1="420" y1="612" x2="420" y2="822" ${aStroke("--art-hollow", 2)} stroke-dasharray="7 9" opacity=".7"/>
    <rect x="345" y="834" width="150" height="46" rx="12" ${aFill("--sky")} opacity=".18"/>
    <text x="420" y="864" text-anchor="middle" style="fill:var(--sky);font-family:'Chakra Petch',sans-serif;font-size:20px;font-weight:700;letter-spacing:.1em">LAUNCH</text>
    ${dots}
    <g transform="translate(575 700)">
      <circle cx="0" cy="0" r="40" ${aStroke("--sky", 3)} opacity=".65"/>
      <circle cx="46" cy="0" r="40" ${aStroke("--purple", 3)} opacity=".65"/>
    </g>`;
}

const ART_BODIES = {
  "art-product": artProduct,
  "art-craft": artCraft,
  "art-visibility": artVisibility,
  "art-partner": artPartner
};

/* Shared defs + one <symbol> per pillar, emitted once per page.
   NOTE: paint servers in <defs> resolve var() against the *defs* element's own
   context, not the <use> site, so a gradient built from --art-bg-* would ignore
   the active theme. The two-tone background is therefore a solid token fill
   plus a second token fill revealed by a theme-independent luminance mask. */
function whyArtDefs() {
  const symbols = WHY_PILLARS.map((p) => `
    <symbol id="${p.art}" viewBox="0 0 ${ART_W} ${ART_H}">
      <rect width="${ART_W}" height="${ART_H}" ${aFill("--art-bg-1")}/>
      <rect width="${ART_W}" height="${ART_H}" ${aFill("--art-bg-2")} mask="url(#artFade)"/>
      <rect width="${ART_W}" height="${ART_H}" fill="url(#artGrid)"/>
      <rect width="${ART_W}" height="${ART_H}" fill="url(#artGlow)"/>
      ${ART_BODIES[p.art]()}
      ${artCaption(p.phase, p.label)}
    </symbol>`).join("");
  return `<svg class="why-art-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="artFadeGrad" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stop-color="#000"/>
        <stop offset="1" stop-color="#fff"/>
      </linearGradient>
      <mask id="artFade">
        <rect width="${ART_W}" height="${ART_H}" fill="url(#artFadeGrad)"/>
      </mask>
      <radialGradient id="artGlow" cx="0.5" cy="0.42" r="0.62">
        <stop offset="0" stop-color="#3b82f6" stop-opacity=".18"/>
        <stop offset="1" stop-color="#3b82f6" stop-opacity="0"/>
      </radialGradient>
      <pattern id="artGrid" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M50 0H0V50" fill="none" stroke="#608cf0" stroke-width="1" opacity=".16"/>
      </pattern>
    </defs>${symbols}
  </svg>`;
}

function whyArt(pillar, cls) {
  return `<svg class="${cls}" viewBox="0 0 ${ART_W} ${ART_H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${pillar.alt}"><use href="#${pillar.art}"/></svg>`;
}

function whyVisualPhoto(pillar) {
  return `<figure class="why-visual-float-item">${whyArt(pillar, "why-art")}</figure>`;
}

function whyStoryVisualStack() {
  const slides = WHY_PILLARS.map((p) => `
    <figure class="why-visual-photo-slide">${whyArt(p, "why-art")}</figure>`).join("");

  return `<div class="why-visual-float">
    <div class="why-visual-float-viewport">
      <div class="why-visual-photo-track">${slides}</div>
    </div>
  </div>`;
}

function whyStorySection() {
  const steps = WHY_PILLARS.map((p, i) => `
    <article class="why-story-step${i === 0 ? " is-active" : ""}" data-why-step="${i}">
      <div class="why-story-step-media">${whyVisualPhoto(p)}</div>
      <div class="why-story-step-copy">
        <span class="why-story-phase">${p.phase}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <ul class="why-story-points">${p.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
      </div>
    </article>`).join("");

  return `
<section class="section why-story" id="why">
  ${whyArtDefs()}
  <div class="container">
    <div class="section-head reveal"><span class="kicker">Why Evolvora</span><h2>A partner, not just a vendor</h2></div>
    <div class="why-story-layout">
      <div class="why-story-steps">${steps}</div>
      <aside class="why-story-visual" aria-hidden="true">
        <div class="why-story-visual-pin">${whyStoryVisualStack()}</div>
      </aside>
    </div>
  </div>
</section>`;
}

const STACK_SKILLS = [
  { name: "Angular", brand: "#DD0031", logo: "angular.svg" },
  { name: ".NET", brand: "#512BD4", logo: "dotnet.svg" },
  { name: "Node.js", brand: "#5FA04E", logo: "nodedotjs.svg" },
  { name: "TypeScript", brand: "#3178C6", logo: "typescript.svg" },
  { name: "PostgreSQL", brand: "#4169E1", logo: "postgresql.svg" },
  { name: "Supabase", brand: "#3FCF8E", logo: "supabase.svg" },
  { name: "Docker", brand: "#2496ED", logo: "docker.svg" },
  { name: "Cloudflare", brand: "#F38020", logo: "cloudflare.svg" },
  { name: "Figma", brand: "#F24E1E", logo: "figma.svg" },
];

const stackCard = (s) =>
  `<article class="stack-card-item" style="--brand:${s.brand}"><img class="stack-card-icon" src="/assets/img/stack/${s.logo}" alt="${s.name} logo" width="48" height="48" loading="lazy" decoding="async"><span class="stack-card-name">${s.name}</span></article>`;

const stackGrid = () =>
  `<div class="stack-grid reveal" aria-label="Technologies we use">${STACK_SKILLS.map(stackCard).join("")}</div>`;

/* ---------- head ---------- */
function head({ title, desc, url, jsonld, og }) {
  const canonical = SITE + url;
  /* A product page can carry its own share card; everything else uses the
     company one. Both are 1200x630, so the size tags below hold for either. */
  const ogImg = og || OG;
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${url.endsWith("/") ? `<link rel="alternate" type="text/markdown" href="${url}index.md">` : ""}
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#070b16">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Evolvora Technologies">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImg}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">
${FONT_HEAD}
${THEME_INIT}
${NAV_MOBILE_CRITICAL}
<style>${SITE_CSS}</style>
<script src="/assets/js/main.js?v=7" defer></script>
${(jsonld ? (Array.isArray(jsonld) ? jsonld : [jsonld]) : []).map(o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join("\n")}`;
}

/* ---------- header ---------- */
/* Pages whose visitors are hiring us to build something. Everywhere else the
   visitor is looking at Evolvora Campus, so the header offers a demo instead. */
const PROJECT_PAGES = ["services", "about"];
function header(active) {
  const on = (k) => active === k ? ' class="active"' : "";
  return `<header class="nav" id="nav"><div class="container nav-inner">
  <a href="/" class="brand" aria-label="Evolvora Technologies home">${MARK}<span class="wm">EVOL<b>VORA</b></span></a>
  <div class="nav-actions">${NAV_TOGGLE}${THEME_TOGGLE}
  </div>
</div></header>
<nav class="nav-links" id="navLinks" aria-label="Primary">
    <a href="/"${on("home")}>Home</a>
    <a href="/services/"${on("services")}>Services</a>
    <div class="has-dropdown">
      <button class="drop-btn" aria-haspopup="true" aria-expanded="false">Products <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${I.chev}</svg></button>
      <div class="dropdown">
        <div><p class="dd-h">Our products</p>
          <a href="/products/evolvora-campus/"><span class="di">${svg("cap")}</span><span><strong>Evolvora Campus</strong><span>All-in-one school management system</span></span></a>
          <a href="${SILAAI_PATH}"><span class="di">${svg("scissors")}</span><span><strong>SilaaiMarkaz</strong><span>Tailoring marketplace in Lahore</span></span></a>
          <a href="/products/"><span class="di">${svg("rocket")}</span><span><strong>All products</strong><span>See what's live &amp; coming next</span></span></a>
        </div>
        <div><p class="dd-h">Campus solutions</p>
          <a href="/school-management-system/"><span class="di">${svg("layers")}</span><span><strong>School Management System</strong></span></a>
          <a href="/student-attendance-software/"><span class="di">${svg("clock")}</span><span><strong>Attendance Software</strong></span></a>
          <a href="/school-fee-management-software/"><span class="di">${svg("fee")}</span><span><strong>Fee Management</strong></span></a>
          <a href="/school-erp/"><span class="di">${svg("shield")}</span><span><strong>School ERP</strong></span></a>
        </div>
      </div>
    </div>
    <a href="/about/"${on("about")}>About</a>
    <a href="/contact/"${on("contact")}>Contact</a>
    <a href="/contact/" class="btn btn-primary btn-sm">${PROJECT_PAGES.includes(active) ? "Start a project" : "Book a demo"}</a>
  </nav>`;
}

/* ---------- footer ---------- */
function footer() {
  return `<footer class="footer"><div class="container">
  <div class="footer-top">
    <div class="footer-brand">
      <a href="/" class="brand">${MARK}<span class="wm">EVOL<b>VORA</b></span></a>
      <p>Evolvora Technologies is a Lahore software company. It makes Evolvora Campus, a school management system for Pakistani schools, runs SilaaiMarkaz, a tailoring marketplace in Lahore, and builds custom software for clients. Evolvora Campus is not related to evolCampus.</p>
      <p class="footer-contact">${ADDRESS_TEXT}<br><a href="${PHONE_TEL}">${PHONE_DISPLAY}</a> · <a href="mailto:${EMAIL}">${EMAIL}</a></p>
      <span class="footer-tagline">Building a smarter tomorrow</span>
      ${socialRow()}
    </div>
    <div><p class="footer-h">Company</p><ul>
      <li><a href="/">Home</a></li>
      <li><a href="/services/">Services</a></li>
      <li><a href="/products/">Products</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul></div>
    <div><p class="footer-h">Products</p><ul>
      <li><a href="/products/evolvora-campus/">Evolvora Campus</a></li>
      <li><a href="/products/evolvora-campus/#features">Campus features</a></li>
      <li><a href="${PRICING_PATH}">Campus pricing</a></li>
      <li><a href="${SILAAI_PATH}">SilaaiMarkaz</a></li>
      <li><a href="/products/">All products</a></li>
    </ul></div>
    <div><p class="footer-h">Solutions</p><ul>
      <li><a href="/school-management-system/">School Management System</a></li>
      <li><a href="/campus-management-system/">Multi-Campus School Management</a></li>
      <li><a href="/school-erp/">School ERP</a></li>
      <li><a href="/student-attendance-software/">Student Attendance Software</a></li>
      <li><a href="/school-fee-management-software/">Fee Management Software</a></li>
    </ul></div>
  </div>
  <div class="footer-tagline-bar">
    <p>What makes us different: <strong>assign us the work, take that long vacation, and we handle it all.</strong></p>
  </div>
  <div class="footer-base">
    <span>© <span id="year">2026</span> Evolvora Technologies. All rights reserved.</span>
    <span><a href="mailto:${EMAIL}">${EMAIL}</a></span>
  </div>
</div></footer>`;
}

/* ---------- page shell ---------- */
function doc(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head(page)}
</head>
<body>
${header(page.active)}
<main${page.mainClass ? ` class="${page.mainClass}"` : ""}>
${page.body}
</main>
${footer()}
</body>
</html>`;
}

/* ---------- reusable blocks ---------- */
function ctaBlock(h, p) {
  return `<section class="cta"><div class="cta-glow"></div><div class="container"><div class="cta-inner reveal">
  <h2>${h}</h2><p>${p}</p>
  <div class="cta-actions">
    <a href="/contact/" class="btn btn-primary btn-lg">Book a free demo</a>
    <a href="mailto:${EMAIL}?subject=Evolvora%20Campus%20Enquiry" class="btn btn-ghost btn-lg">${EMAIL}</a>
  </div></div></div></section>`;
}
const PILLARS = `<div class="benefit-grid">
  <article class="benefit reveal"><span class="benefit-ic ic-green">${svg("fee")}</span><h3>Fee collection made easy</h3><p>See who has paid, who is pending and what's outstanding across the whole school, and send fee reminders in a tap instead of chasing parents.</p></article>
  <article class="benefit reveal"><span class="benefit-ic ic-amber">${svg("salary")}</span><h3>Salaries calculate themselves</h3><p>Basic pay, allowances and tax status are stored per teacher, so monthly salary is worked out automatically. No spreadsheets, no manual maths.</p></article>
  <article class="benefit reveal"><span class="benefit-ic ic-blue">${svg("clock")}</span><h3>Teachers reach class on time</h3><p>Attendance is marked from the classroom in seconds with a clear daily view, so teachers always know where they're needed.</p></article>
  <article class="benefit reveal"><span class="benefit-ic ic-cyan">${svg("bell")}</span><h3>Parents notified instantly</h3><p>Marks, attendance, fee reminders and daily diary reach parents the moment they happen, on the app and their phone.</p></article>
</div>`;

function solutionsGrid() {
  const items = [
    ["school-management-system","School Management System","Run admissions, classes, attendance, fees and reports from one dashboard.","layers"],
    ["campus-management-system","Multi-Campus School Management","Run every branch from one head-office view, while each campus keeps its own classes, staff and fees.","globe"],
    ["school-erp","School ERP","Students, staff, payroll and finance unified in a single school ERP.","shield"],
    ["student-attendance-software","Student Attendance Software","Mark and track daily attendance in seconds, with instant parent alerts.","clock"],
    ["school-fee-management-software","Fee Management Software","Track dues, send reminders on WhatsApp and SMS, and let parents pay through JazzCash and EasyPaisa.","fee"],
  ];
  return `<div class="cards">${items.map(([s,t,d,ic])=>`<a class="card reveal" href="/${s}/"><span class="card-ic">${svg(ic)}</span><h3>${t}</h3><p>${d}</p><span class="card-link">Learn more ${svg("arrow")}</span></a>`).join("")}</div>`;
}

/* ---------- FAQ ---------- */
function faqBlock(items) {
  const html = `<div class="faq">${items.map(f=>`<div class="faq-item"><button class="faq-q" aria-expanded="false">${f.q}<span class="fi">+</span></button><div class="faq-a"><p>${f.a}</p></div></div>`).join("")}</div>`;
  const jsonld = { "@context":"https://schema.org","@type":"FAQPage","mainEntity":items.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}})) };
  return { html, jsonld };
}

/* ---------- breadcrumb ---------- */
function crumb(trail) { // [[name,url],...]
  const html = `<nav class="crumb" aria-label="Breadcrumb">${trail.map((t,i)=> i<trail.length-1 ? `<a href="${t[1]}">${t[0]}</a><span>/</span>` : `<span>${t[0]}</span>`).join("")}</nav>`;
  /* @id so the page node can point at this breadcrumb instead of restating it.
     Derived from the last trail entry, which is always the current page. */
  const jsonld = { "@context":"https://schema.org","@type":"BreadcrumbList",
    "@id":SITE+trail[trail.length-1][1]+"#breadcrumb",
    "itemListElement":trail.map((t,i)=>({"@type":"ListItem","position":i+1,"name":t[0],"item":SITE+t[1]})) };
  return { html, jsonld };
}

/* ---- entity graph ids ----
   Stable @ids let every page point at the same Organization / WebSite node
   instead of repeating disconnected copies. That is what lets a search engine
   treat "Evolvora" as one company entity rather than a loose keyword. */
const ORG_ID     = SITE + "/#organization";
const SITE_ID    = SITE + "/#website";
const FOUNDER_ID = SITE + "/#founder";
const LOGO_ID    = SITE + "/#logo";
const OG_IMG_ID  = SITE + "/#og-image";
const CATALOG_ID = SITE + "/#service-catalog";

const SERVICE_ID = SITE + "/services/#service";

/* ---- topic entities ----
   Every topic carries sameAs to its Wikipedia article. That is the mechanism
   that removes ambiguity: it pins "Attendance" or "Payroll" to a known entity
   in Google's Knowledge Graph instead of leaving a bare string to interpret.

   Every URL below was checked to return HTTP 200. "admissions" has no matching
   Wikipedia article (School_admissions is a 404), so it is a name-only Thing
   rather than being pointed at a wrong article. */
const T = {
  softwareDev: ["Software development","https://en.wikipedia.org/wiki/Software_development"],
  softwareInd: ["Software industry","https://en.wikipedia.org/wiki/Software_industry"],
  customSw:    ["Custom software","https://en.wikipedia.org/wiki/Custom_software"],
  webApp:      ["Web application","https://en.wikipedia.org/wiki/Web_application"],
  mobileApp:   ["Mobile app","https://en.wikipedia.org/wiki/Mobile_app"],
  saas:        ["Software as a service","https://en.wikipedia.org/wiki/Software_as_a_service"],
  cloud:       ["Cloud computing","https://en.wikipedia.org/wiki/Cloud_computing"],
  devops:      ["DevOps","https://en.wikipedia.org/wiki/DevOps"],
  ux:          ["User experience design","https://en.wikipedia.org/wiki/User_experience_design"],
  eduSoftware: ["Educational software","https://en.wikipedia.org/wiki/Educational_software"],
  edtech:      ["Educational technology","https://en.wikipedia.org/wiki/Educational_technology"],
  sis:         ["Student information system","https://en.wikipedia.org/wiki/Student_information_system"],
  erp:         ["Enterprise resource planning","https://en.wikipedia.org/wiki/Enterprise_resource_planning"],
  lms:         ["Learning management system","https://en.wikipedia.org/wiki/Learning_management_system"],
  attendance:  ["Attendance","https://en.wikipedia.org/wiki/Attendance"],
  payroll:     ["Payroll","https://en.wikipedia.org/wiki/Payroll"],
  tuition:     ["Tuition payments","https://en.wikipedia.org/wiki/Tuition_payments"],
  grading:     ["Grading in education","https://en.wikipedia.org/wiki/Grading_in_education"],
  timetable:   ["Timetable","https://en.wikipedia.org/wiki/Timetable"],
  teacher:     ["Teacher","https://en.wikipedia.org/wiki/Teacher"],
  parent:      ["Parent","https://en.wikipedia.org/wiki/Parent"],
  school:      ["School","https://en.wikipedia.org/wiki/School"],
  admissions:  ["School admissions", null],
  // SilaaiMarkaz. "Clothing alterations" has no article (404), so alterations
  // are covered by the Tailor and Sewing entities instead of a wrong page.
  marketplace: ["Online marketplace","https://en.wikipedia.org/wiki/Online_marketplace"],
  tailor:      ["Tailor","https://en.wikipedia.org/wiki/Tailor"],
  bespoke:     ["Bespoke tailoring","https://en.wikipedia.org/wiki/Bespoke_tailoring"],
  sewing:      ["Sewing","https://en.wikipedia.org/wiki/Sewing"],
  shalwar:     ["Shalwar kameez","https://en.wikipedia.org/wiki/Shalwar_kameez"],
  lahore:      ["Lahore","https://en.wikipedia.org/wiki/Lahore"],
};

/* "campus", "silaai" and "org" resolve to the site's own entities so a page can
   mention a product or the company using the same mechanism as a topic. */
const topic = (k) => {
  if (k === "campus") return { "@id": CAMPUS_SW_ID };
  if (k === "silaai") return { "@id": SILAAI_SW_ID };
  if (k === "org") return { "@id": ORG_ID };
  const [name, sameAs] = T[k];
  const node = { "@type":"Thing","@id":SITE+"/#topic-"+k,"name":name };
  if (sameAs) node.sameAs = sameAs;
  return node;
};

/* Per-page topical wiring. "about" entries are added alongside the page's
   primary subject; "mentions" are supporting topics the page genuinely covers.
   This is what encodes the chain from software company through Evolvora Campus
   down to attendance, fees, payroll, admissions, parents and teachers. */
const PAGE_TOPICS = {
  "/":                                  { about:["softwareDev","sis"], mentions:["campus","silaai","customSw","webApp","mobileApp","saas","ux","cloud","devops","eduSoftware","sis","marketplace"] },
  "/about/":                            { about:["softwareDev"], mentions:["campus","silaai","softwareInd","customSw","saas","marketplace"] },
  "/services/":                         { about:["softwareDev"], mentions:["customSw","webApp","mobileApp","saas","ux","cloud","devops","campus"] },
  "/contact/":                          { about:[],              mentions:["campus","eduSoftware","sis"] },
  "/products/":                         { about:["softwareDev"], mentions:["campus","silaai","eduSoftware","sis","edtech","lms","marketplace","mobileApp"] },
  "/products/silaaimarkaz/":            { about:["marketplace","tailor"], mentions:["bespoke","sewing","shalwar","lahore","mobileApp","webApp"] },
  "/products/evolvora-campus/pricing/": { about:["sis"],         mentions:["campus","eduSoftware","tuition","school"] },
  "/school-management-system/":         { about:["sis","eduSoftware"], mentions:["attendance","grading","tuition","payroll","admissions","parent","teacher","school","timetable"] },
  "/campus-management-system/":         { about:["sis","eduSoftware"], mentions:["school","attendance","tuition","payroll","teacher","parent","timetable"] },
  "/school-erp/":                       { about:["erp","sis"],   mentions:["payroll","tuition","attendance","grading","admissions","school"] },
  "/student-attendance-software/":      { about:["attendance","sis"], mentions:["school","teacher","parent","timetable","eduSoftware"] },
  "/school-fee-management-software/":   { about:["tuition","sis"],    mentions:["school","parent","payroll","eduSoftware"] },
};

/* ---- page-level entities ----
   Every indexable page becomes its own node wired into one graph:
     WebPage -> isPartOf -> WebSite -> publisher -> Organization
   plus breadcrumb, subject (about) and primaryImageOfPage references. Built
   centrally so all pages stay structurally identical.

   Per page a definition may set:
     pageType           WebPage subtype (AboutPage, ContactPage, CollectionPage)
     pageAbout          @id of what the page is about (defaults to Organization)
     pageMainEntity     @id of the page's primary entity
     pageMainEntityNode an inline node, when the primary entity is a list
     pageImage          inline ImageObject, when a page has its own lead image

   speakable is deliberately omitted everywhere: Google limits the speakable
   feature to news publishers in supported regions, so it would do nothing on a
   SaaS marketing site and would only add unverifiable markup. */
function pageNode(p) {
  const url = SITE + p.url;
  const list = p.jsonld || [];
  const bc  = list.find(o => o && o["@type"] === "BreadcrumbList");
  const faq = list.find(o => o && o["@type"] === "FAQPage");

  /* A page carrying an FAQ is co-typed FAQPage, which is itself a WebPage
     subtype, so one node covers both roles. FAQPage requires mainEntity to be
     the questions, so such pages express their subject through "about". */
  const base = p.pageType || "WebPage";
  const node = {
    "@context":"https://schema.org",
    "@type": faq ? [base, "FAQPage"] : base,
    "@id": url + "#webpage",
    "url": url,
    "name": p.title,
    "description": p.desc,
    "inLanguage": "en",
    "isPartOf": { "@id": SITE_ID },
    "about": { "@id": p.pageAbout || ORG_ID },
    "publisher": { "@id": ORG_ID },
    "creator": { "@id": ORG_ID },
    "primaryImageOfPage": p.pageImage || { "@type":"ImageObject","@id":OG_IMG_ID,"url":OG,"contentUrl":OG,"width":1200,"height":630 },
    "dateModified": p.date || BUILD_DATE,
  };
  if (bc) node.breadcrumb = { "@id": bc["@id"] };
  if (faq) node.mainEntity = faq.mainEntity;
  else if (p.pageMainEntityNode) node.mainEntity = p.pageMainEntityNode;
  else if (p.pageMainEntity) node.mainEntity = { "@id": p.pageMainEntity };

  /* Topical wiring: the page's subject plus the disambiguated topics it covers.
     about = what the page IS about; mentions = what it references in support. */
  const t = PAGE_TOPICS[p.url] || {};
  const about = [node.about, ...(t.about || []).map(topic)];
  node.about = about.length === 1 ? about[0] : about;
  const mentions = (t.mentions || []).map(topic);
  if (mentions.length) node.mentions = mentions;
  return node;
}

const CAMPUS_PATH = "/products/evolvora-campus/";
const CAMPUS_URL = SITE + CAMPUS_PATH;
const CAMPUS_SW_ID = CAMPUS_URL + "#software";   // same node the product page defines in full
const BRAND_ID = CAMPUS_URL + "#brand";

/* SilaaiMarkaz lives on its own domain; this site carries its product page.
   The entity @ids hang off our page (like Campus) so the company graph stays
   in one place, while "url" points at the product's real home. */
const SILAAI_PATH = "/products/silaaimarkaz/";
const SILAAI_URL = SITE + SILAAI_PATH;
const SILAAI_SW_ID = SILAAI_URL + "#software";
const SILAAI_BRAND_ID = SILAAI_URL + "#brand";
const SILAAI_HOME = "https://silaaimarkaz.com/";
/* Other spellings of the name. "Silai" is the more common way to write the
   word for stitching, so many people search "Silai Markaz". */
const SILAAI_NAMES = ["Silaai Markaz","Silai Markaz","SilaiMarkaz","Sillai Markaz"];
const SILAAI_APK = "https://silaaimarkaz.com/downloads/silaaimarkaz.apk";
const SILAAI_DARZI = "https://app.silaaimarkaz.com/auth/darzi/signup";   // Darzi shop sign-up
const SILAAI_LOGIN = "https://app.silaaimarkaz.com/auth/login";          // customer entry: "Find a Darzi"
const SILAAI_LOGO = SITE + "/assets/img/silaaimarkaz/silaaimarkaz-logo.png";   // 480x480
const SILAAI_OG = SITE + "/assets/img/silaaimarkaz/silaaimarkaz-og.png";       // 1200x630

/* Registered office. One constant so the address in structured data can never
   drift from the address published anywhere else - NAP consistency is what
   lets Google tie the entity to a real business. */
const ADDRESS = {
  "@type":"PostalAddress",
  "streetAddress":"599-Q, Johar Town",
  "addressLocality":"Lahore",
  "addressRegion":"Punjab",
  "postalCode":"54000",
  "addressCountry":"PK",
};

/* Incorporation date, ISO 8601 (e.g. "2024-06-01"). Emitted only when set.
   Deliberately null: foundingDate is a factual claim about the company, so it
   is never guessed. Fill this in and it appears automatically. */
const FOUNDED = "2026-06-01";

/* Services offered, mirroring the service cards already on the site. Drives
   hasOfferCatalog so the catalogue can never contradict the visible page. */
const SERVICES = [
  ["Custom Software Development","Bespoke systems built around your workflow, from internal tools to customer-facing platforms."],
  ["Web Application Development","Responsive, high-performance web apps with clean architecture and modern frameworks."],
  ["Mobile App Development","Cross-platform iOS and Android apps that feel native and ship fast."],
  ["SaaS Product Engineering","Multi-tenant, subscription-ready products designed to scale from day one."],
  ["UI/UX Design","Interface research, wireframes, prototypes and visual design."],
  ["Cloud & DevOps","Deployment, CI/CD, monitoring and infrastructure that keeps software fast and online."],
];

const orgLD = { "@context":"https://schema.org","@type":"Organization",
  "@id":ORG_ID,
  "name":"Evolvora Technologies",
  "alternateName":["Evolvora","Evolvora Tech"],
  "legalName":"Evolvora Technologies",
  "url":SITE,
  "description":"Evolvora Technologies is a software house that designs, builds and runs custom web, mobile and cloud software. Its own products are Evolvora Campus, an all-in-one school management system, and SilaaiMarkaz, a tailoring marketplace in Lahore.",
  "disambiguatingDescription":"Evolvora Technologies is a software company in Lahore, Pakistan. It makes Evolvora Campus, a school management system for Pakistani schools, and SilaaiMarkaz, a tailoring marketplace.",
  "slogan":"Building a smarter tomorrow",
  /* Google requires the logo to be at least 112x112; this one is 512x512.
     contentUrl + dimensions let Google validate it without fetching. */
  "logo":{ "@type":"ImageObject","@id":LOGO_ID,
    "url":SITE+"/assets/img/evolvora-logo.png",
    "contentUrl":SITE+"/assets/img/evolvora-logo.png",
    "width":512,"height":512,
    "caption":"Evolvora Technologies logo" },
  /* Two aspect ratios: the square logo and the landscape share card. Google
     prefers a choice of ratios. The logo is a reference to the node defined in
     "logo" directly above, so the graph holds one image, not two copies of it,
     and it stands in until a real photograph of the Lahore office exists. */
  "image":[
    { "@id":LOGO_ID },
    { "@type":"ImageObject","@id":OG_IMG_ID,"url":OG,"contentUrl":OG,
      "width":1200,"height":630,"caption":"Evolvora Technologies" },
  ],
  "email":EMAIL,
  "telephone":PHONE,
  "address":ADDRESS,
  "founder":{ "@type":"Person","@id":FOUNDER_ID,
    "name":"Sheharyar Khan","jobTitle":"Founder",
    "worksFor":{ "@id":ORG_ID },
    "sameAs":["https://www.linkedin.com/in/sheharyar-khaan/"] },
  "foundingLocation":{ "@type":"Place","name":"Lahore, Pakistan",
    "address":{ "@type":"PostalAddress","addressLocality":"Lahore","addressRegion":"Punjab","addressCountry":"PK" } },
  ...(FOUNDED ? { "foundingDate":FOUNDED } : {}),
  /* areaServed only. schema.org marks serviceArea as superseded by areaServed,
     so carrying both would state the same fact twice. */
  "areaServed":[
    { "@type":"Country","name":"Pakistan" },
    "Worldwide",
  ],
  /* Disambiguated expertise. Each Thing carries sameAs to Wikipedia, so the
     company is tied to both software development AND education software as known
     entities - which is exactly the dual identity that has to be unambiguous:
     a software house that happens to make school software, not a school. Topics
     with no matching Wikipedia article stay as plain text. */
  "knowsAbout":[
    topic("softwareDev"), topic("customSw"), topic("webApp"), topic("mobileApp"),
    topic("saas"), topic("ux"), topic("cloud"), topic("devops"),
    topic("eduSoftware"), topic("edtech"), topic("sis"), topic("erp"),
    topic("marketplace"),
    "School management systems","School fee management","Teacher payroll",
    "Software architecture",
  ],
  /* Valid schema.org on Organization, though Google does not use it for
     Organization rich results. Harmless, and read by other consumers. */
  "keywords":"software house, custom software development, web application development, mobile app development, SaaS product engineering, UI/UX design, cloud and DevOps, school management system, school ERP, Evolvora Campus, SilaaiMarkaz, tailoring marketplace, software company Lahore, software company Pakistan",
  "brand":[
    { "@type":"Brand","@id":BRAND_ID,
      "name":"Evolvora Campus","url":CAMPUS_URL,
      "logo":SITE+"/assets/img/evolvora-logo.png" },
    { "@type":"Brand","@id":SILAAI_BRAND_ID,
      "name":"SilaaiMarkaz","alternateName":SILAAI_NAMES,"url":SILAAI_HOME,
      "logo":SILAAI_LOGO },
  ],
  "hasOfferCatalog":{ "@type":"OfferCatalog","@id":CATALOG_ID,
    "name":"Evolvora Technologies services and products",
    "itemListElement":[
      ...SERVICES.map(([name,description]) => ({ "@type":"Offer",
        "itemOffered":{ "@type":"Service",
          "name":name,"description":description,"serviceType":name,
          "provider":{ "@id":ORG_ID },
          "areaServed":"Worldwide" } })),
      /* Prices live on the SoftwareApplication offers, not here, so the
         catalogue cannot contradict the published pricing. */
      { "@type":"Offer","itemOffered":{ "@id":CAMPUS_SW_ID } },
      { "@type":"Offer","itemOffered":{ "@id":SILAAI_SW_ID } },
    ] },
  "contactPoint":[
    { "@type":"ContactPoint","contactType":"sales",
      "telephone":PHONE,"email":EMAIL,
      "areaServed":["PK","Worldwide"],"availableLanguage":["en","ur"] },
    { "@type":"ContactPoint","contactType":"customer support",
      "email":EMAIL,
      "areaServed":["PK","Worldwide"],"availableLanguage":["en","ur"] },
  ],
  "sameAs":SOCIAL.map(s => s[2]) };

/* WebSite node, bound to the Organization as publisher, copyright holder and
   subject. No potentialAction/SearchAction: the site has no search feature, and
   Google retired the sitelinks searchbox rich result, so it would do nothing. */
const websiteLD = { "@context":"https://schema.org","@type":"WebSite",
  "@id":SITE_ID,
  "name":"Evolvora Technologies",
  "alternateName":["Evolvora","Evolvora Tech"],
  "url":SITE,
  "inLanguage":"en",
  "description":"Evolvora Technologies is a software house building custom web, mobile and cloud software, and the maker of Evolvora Campus and SilaaiMarkaz.",
  "publisher":{ "@id":ORG_ID },
  "copyrightHolder":{ "@id":ORG_ID },
  "creator":{ "@id":ORG_ID },
  "about":{ "@id":ORG_ID } };

/* ---- pricing (single source of truth) ----
   Prices are set in USD; every rupee figure on the site is converted from them
   at PKR_PER_USD, so the two currencies can never disagree. To follow the rate,
   change PKR_PER_USD and RATE_DATE and rebuild.

   Enterprise was priced against the Pakistani market (Sept 2026): published
   per-student rates run Rs 15-100 (EduSuite: Standard Rs 30, Pro Rs 50,
   Enterprise Rs 70, Ultimate Rs 100), and most rivals hide multi-campus prices
   behind "contact us". Rs 75 sits beside EduSuite's Enterprise tier; the
   monthly minimum keeps single schools on Standard, and what the premium buys
   is service rivals don't publish: an account manager, on-site training at
   every campus, priority support and a written uptime commitment. */
const PKR_PER_USD = 277.11;           // Wise mid-market rate
const RATE_DATE = "28 September 2026";
const PRICE = "0.18";                 // Standard, per active student per month
const ENT_PRICE = "0.27";             // Enterprise, per active student per month
const ENT_MIN = 180;                  // Enterprise monthly minimum, USD
const ENT_ONBOARD = 180;              // Enterprise one-time onboarding per campus, USD
const ENT_YEARLY_OFF = 10;            // % off Enterprise when billed yearly
const ENT_UPTIME = "99.5%";
const toPKR = (usd) => Number(usd) * PKR_PER_USD;
/* Per-student prices round to the rupee; larger sums to the nearest Rs 100. */
const pkr = (usd) => { const v = toPKR(usd); return v < 1000 ? String(Math.round(v)) : (Math.round(v / 100) * 100).toLocaleString("en-US"); };
const usd = (v) => Number(v).toLocaleString("en-US", { minimumFractionDigits: Number(v) < 1 ? 2 : 0 });
const PRICE_PKR = pkr(PRICE);
const ENT_PRICE_PKR = pkr(ENT_PRICE);
/* A price that can flip between currencies on the pricing page. Rupees are the
   default (the product is sold in Pakistan); the toggle in main.js swaps the
   text and remembers the choice. */
const money = (v, { per = "" } = {}) =>
  `<span class="money" data-usd="$${usd(v)}${per}" data-pkr="Rs ${pkr(v)}${per}">Rs ${pkr(v)}${per}</span>`;
// Pricing lives under the product, not at the site root: it prices Evolvora
// Campus, not the software house. /pricing/ 301s here (see netlify.toml).
const PRICING_PATH = CAMPUS_PATH + "pricing/";
const PRICING_URL = SITE + PRICING_PATH;

/* ---- EVOLVORA CAMPUS (SoftwareApplication) ----
   Single canonical definition of the product entity. Emitted on the pricing
   page and synced into the hand-maintained product page (see CAMPUS_SCHEMA
   sync at the end of this file), so the two can never diverge again.

   Typed WebApplication alone: it is a subtype of SoftwareApplication (which
   Google's Software App rich result accepts), accurate for a browser-based
   SaaS, and the type that legitimately carries browserRequirements.

   Deliberately absent, and why:
     aggregateRating / review  no genuine public ratings exist. Inventing them
                               risks a manual action, so the Software App rich
                               result is forgone by choice.
     softwareVersion           no published version number.
     releaseNotes              no public changelog.
     installUrl                nothing is installed; it runs in the browser.
     applicationSuite          Evolvora Learn and Insights are unreleased, so
                               there is no shipping suite to claim.
     countriesSupported        no published list of served countries.
     license                   no public licence or terms URL on the site.
     permissions               not applicable to a web app.
     brand / manufacturer / logo / availableLanguage
                               not valid on SoftwareApplication or CreativeWork
                               per schema.org. The same facts are carried
                               validly by publisher/creator/provider, by
                               inLanguage, and by the Organization's own
                               brand property. */
/* Named swShot to avoid clashing with shot(), the responsive-image helper. */
const swShot = (file, caption, w, h) => ({
  "@type":"ImageObject",
  "url":SITE+"/assets/img/"+file,
  "contentUrl":SITE+"/assets/img/"+file,
  "width":w,"height":h,"caption":caption,
});

const campusLD = {
  "@context":"https://schema.org",
  "@type":"WebApplication",
  "@id":CAMPUS_SW_ID,
  "name":"Evolvora Campus",
  "alternateName":["Evolvora Campus School Management System","Evolvora School ERP"],
  "url":CAMPUS_URL,
  /* Points at the product page's WebPage node, not the bare URL, so the
     software and its canonical page are the same two linked nodes everywhere. */
  "mainEntityOfPage":{ "@id":CAMPUS_URL+"#webpage" },
  "description":"Evolvora Campus is a cloud-based school management system for schools in Pakistan, covering admissions, class and section management, attendance, exams and marks, fee collection with JazzCash and EasyPaisa, teacher payroll and parent communication on WhatsApp and SMS in one platform.",
  "disambiguatingDescription":"Evolvora Campus is a school management system for Pakistani schools, made by Evolvora Technologies, a software company in Lahore, Pakistan.",
  "applicationCategory":"BusinessApplication",
  "applicationSubCategory":"School Management System",
  /* Web only. The site states a mobile app is on the roadmap, so Android and
     iOS are not claimed here. */
  "operatingSystem":"Web browser (cross-platform)",
  "browserRequirements":"Requires a modern web browser with JavaScript enabled.",
  "softwareRequirements":"A modern web browser and an internet connection. No installation required.",
  "inLanguage":"en",
  "isAccessibleForFree":false,
  "creator":{ "@id":ORG_ID },
  "publisher":{ "@id":ORG_ID },
  "provider":{ "@id":ORG_ID },
  "audience":{ "@type":"Audience",
    "audienceType":"Schools, academies and educational institutions" },
  "keywords":"school management system, school ERP, student attendance software, school fee management software, campus management system, teacher payroll, parent portal",
  /* The category the product belongs to, and the domain topics it covers. This
     is the middle of the chain: Evolvora Campus -> school management software /
     school ERP -> attendance, fees, payroll, admissions, parents, teachers. */
  "about":[ topic("sis"), topic("eduSoftware"), topic("erp") ],
  "mentions":[
    topic("attendance"), topic("grading"), topic("tuition"), topic("payroll"),
    topic("admissions"), topic("timetable"), topic("teacher"), topic("parent"),
    topic("school"),
  ],
  "featureList":[
    "Student admissions and records",
    "Class and section management",
    "Daily attendance marking with instant parent alerts",
    "Exams, marks and results",
    "Fee collection with dues tracking and fee reminders",
    "Teacher payroll with automatic salary calculation",
    "Parent portal with notifications and daily diary",
    "Fee reminders and alerts to parents on WhatsApp and SMS",
    "Online fee payment through JazzCash and EasyPaisa",
    "Multi-campus management with a head-office view across every branch",
    "Staff directory and records",
    "Bulk student import from Excel",
    "Role-based dashboards for admins, teachers and parents",
  ],
  "screenshot":[
    swShot("homepage_evolvoracampus.png","Evolvora Campus admin dashboard showing student and staff totals, attendance trend and fee submissions",1672,941),
    swShot("teacher_attendence_feature.jpg","Marking class attendance in Evolvora Campus",1918,865),
    swShot("staff_payroll_feature.jpg","Student list in Evolvora Campus with each student's class and fee status",1542,834),
    swShot("fee_records_admin.jpg","Fee Records in Evolvora Campus: each student's fee amount and Paid, Pending or Waived status",1896,1022),
    swShot("parent_switch_child.jpg","Evolvora Campus parent dashboard: switching between children and a pending fee with voucher upload",1903,1008),
    swShot("teacher-dashboard.jpg","Evolvora Campus teacher dashboard",1894,865),
    swShot("school-expense-tracker.jpg","Evolvora Campus school expense tracker with monthly totals, trend chart and expenses by category",1584,1010),
    swShot("automatic-fee-reminder-settings.jpg","Automatic fee reminder settings in Evolvora Campus",990,755),
    swShot("attendance_phone_overview.jpg","Taking class attendance in the Evolvora Campus phone app",720,1477),
  ],
  "image":{ "@type":"ImageObject","@id":OG_IMG_ID,"url":OG,"contentUrl":OG,"width":1200,"height":630 },
  "offers":[
    { "@type":"Offer","name":"Free trial","price":"0","priceCurrency":"USD",
      "description":"One month free trial with every feature included. No card required.",
      "availability":"https://schema.org/InStock","url":PRICING_URL,
      "seller":{ "@id":ORG_ID } },
    /* Each plan is published in both currencies the pricing page shows, so the
       structured data matches whichever one a visitor reads. */
    ...[["USD",PRICE],["PKR",PRICE_PKR]].map(([cur,p]) => ({ "@type":"Offer","name":"Evolvora Campus Standard","price":p,"priceCurrency":cur,
      "description":"Standard plan: "+cur+" "+p+" per active student per month. Every feature included, unlimited teacher and parent accounts, no setup fee.",
      "availability":"https://schema.org/InStock","url":PRICING_URL,
      "seller":{ "@id":ORG_ID },
      "priceSpecification":{ "@type":"UnitPriceSpecification","price":p,"priceCurrency":cur,
        "unitText":"per student per month","billingDuration":1,"billingIncrement":1 } })),
    ...[["USD",ENT_PRICE],["PKR",ENT_PRICE_PKR]].map(([cur,p]) => ({ "@type":"Offer","name":"Evolvora Campus Enterprise","price":p,"priceCurrency":cur,
      "description":"Enterprise plan for multi-campus school networks: "+cur+" "+p+" per active student per month, with a monthly minimum, a dedicated account manager, on-site training at every campus, priority support and a "+ENT_UPTIME+" uptime commitment.",
      "availability":"https://schema.org/InStock","url":PRICING_URL,
      "seller":{ "@id":ORG_ID },
      "priceSpecification":{ "@type":"UnitPriceSpecification","price":p,"priceCurrency":cur,
        "unitText":"per student per month","billingDuration":1,"billingIncrement":1 } })),
  ],
};

/* Kept as an alias so existing references keep working. */
const pricingLD = campusLD;

/* Page entity for the hand-maintained product page. name and description mirror
   that page's own <title> and meta description. Synced alongside campusLD. */
const campusPageLD = {
  "@context":"https://schema.org","@type":"WebPage",
  "@id":CAMPUS_URL+"#webpage",
  "url":CAMPUS_URL,
  "name":"Evolvora Campus | School Software Made for Pakistan",
  "description":"Evolvora Campus runs fees, attendance, payroll and WhatsApp and SMS parent alerts for schools in Pakistan, in one platform. See features, plans and how it works.",
  "inLanguage":"en",
  "isPartOf":{ "@id":SITE_ID },
  "about":[ { "@id":CAMPUS_SW_ID }, topic("sis"), topic("eduSoftware") ],
  "mainEntity":{ "@id":CAMPUS_SW_ID },
  "mentions":[
    topic("attendance"), topic("grading"), topic("tuition"), topic("payroll"),
    topic("admissions"), topic("teacher"), topic("parent"), topic("school"),
  ],
  "publisher":{ "@id":ORG_ID },
  "creator":{ "@id":ORG_ID },
  "breadcrumb":{ "@id":CAMPUS_URL+"#breadcrumb" },
  "primaryImageOfPage":{ "@type":"ImageObject","@id":OG_IMG_ID,"url":OG,"contentUrl":OG,"width":1200,"height":630 },
  "dateModified":BUILD_DATE,
};

/* ---- SILAAIMARKAZ (SoftwareApplication) ----
   Tailoring marketplace: customers compare Darzis (tailors) in Lahore, save
   measurements, agree the price, then visit the shop. Every claim below is
   taken from silaaimarkaz.com itself.

   Co-typed MobileApplication + WebApplication: there is an Android app and a
   browser version at silaaimarkaz.com.

   Deliberately absent, and why:
     offers                 no published price. Rates are agreed per Darzi,
                            so a price here would be invented.
     aggregateRating/review the marketplace shows reviews of Darzis, not of
                            the app itself, and inventing either is a policy risk.
     operatingSystem iOS    no iOS app exists.
     softwareVersion        no published version number. */
const SILAAI_FEATURES = [
  "Compare Darzis by portfolio, price and turnaround",
  "Saved measurement profiles, reusable with any Darzi on the platform",
  "Share reference photos and design notes with the Darzi",
  "Price agreed before work starts",
  "Ratings and reviews of Darzis",
  "English and Urdu interface",
  "Shop registration for Darzis, with orders arriving with measurements attached",
];

const silaaiLD = {
  "@context":"https://schema.org",
  "@type":["MobileApplication","WebApplication"],
  "@id":SILAAI_SW_ID,
  "name":"SilaaiMarkaz",
  "alternateName":[...SILAAI_NAMES,"SilaaiMarkaz tailoring marketplace"],
  "url":SILAAI_HOME,
  "sameAs":[SILAAI_HOME],
  "mainEntityOfPage":{ "@id":SILAAI_URL+"#webpage" },
  "description":"SilaaiMarkaz is a tailoring marketplace in Lahore, Pakistan. Customers compare Darzis (tailors), save their measurements, share the design and agree the price in the app, then visit the shop for drop-off and collection.",
  "applicationCategory":"ShoppingApplication",
  "applicationSubCategory":"Tailoring marketplace",
  "operatingSystem":"Android, Web browser",
  "downloadUrl":SILAAI_APK,
  "installUrl":SILAAI_APK,
  "browserRequirements":"Requires a modern web browser with JavaScript enabled.",
  "inLanguage":["en","ur"],
  "creator":{ "@id":ORG_ID },
  "publisher":{ "@id":ORG_ID },
  "provider":{ "@id":ORG_ID },
  "audience":{ "@type":"Audience",
    "audienceType":"People in Lahore who want clothes stitched or altered, and tailoring shops (Darzis)",
    "geographicArea":{ "@type":"City","name":"Lahore",
      "sameAs":"https://en.wikipedia.org/wiki/Lahore" } },
  "keywords":"tailor in Lahore, darzi, tailoring marketplace, custom stitching, ladies tailor Lahore, bridal stitching, shalwar kameez tailor, alterations, school uniforms",
  "about":[ topic("marketplace"), topic("tailor") ],
  "mentions":[ topic("bespoke"), topic("sewing"), topic("shalwar"), topic("lahore") ],
  "featureList":SILAAI_FEATURES,
  "image":[
    { "@type":"ImageObject","url":SILAAI_LOGO,"contentUrl":SILAAI_LOGO,
      "width":480,"height":480,"caption":"SilaaiMarkaz logo" },
    { "@type":"ImageObject","url":SILAAI_OG,"contentUrl":SILAAI_OG,
      "width":1200,"height":630,"caption":"SilaaiMarkaz" },
  ],
};

/* =================================================================
   PAGES
   ================================================================= */
const pages = [];

/* ---- HOME (software house) ---- */
pages.push({
  file:"index.html", active:"home", url:"/", pageMainEntity:ORG_ID,
  /* Company-led on purpose. "School management system" belongs to
     /school-management-system/ and "Evolvora Campus" to the product page, so
     the three pages do not compete for the same search. */
  title:"Evolvora Technologies | Software Company in Lahore, Pakistan",
  desc:"Evolvora Technologies is a Lahore software company. We make Evolvora Campus for schools, run SilaaiMarkaz, and build custom web, mobile and cloud software.",
  jsonld:[orgLD,websiteLD],
  body:`
<section class="hero hero--visual">
  <div class="hero-bg" aria-hidden="true">
    <div class="hero-mesh"></div>
    <div class="hero-grid"></div>
    <div class="hero-orb hero-orb--1"></div>
    <div class="hero-orb hero-orb--2"></div>
    <div class="hero-orb hero-orb--3"></div>
    <div class="hero-fade"></div>
  </div>
  <div class="container hero-inner">
    <div class="hero-copy reveal">
      <span class="eyebrow"><span class="dot"></span> Made in Lahore · Building a smarter tomorrow</span>
      <h1 class="hero-title">
        <span class="hero-title-brand">Evolvora Technologies</span>
        <span class="hero-title-tagline">Software Products &amp; Custom Development in Lahore</span>
      </h1>
      <p class="lead">We make <strong><a href="${CAMPUS_PATH}">Evolvora Campus</a></strong>, the <a href="/school-management-system/">school management system</a> that runs fees, attendance, payroll and parent updates for schools in Pakistan, with alerts on WhatsApp and SMS and fee payments through JazzCash and EasyPaisa. We also design and build custom <strong>web, mobile and cloud</strong> software for businesses.</p>
      <div class="hero-cta">
        <a href="/contact/" class="btn btn-primary btn-lg">Book a free demo</a>
        <a href="/services/" class="btn btn-ghost btn-lg">Custom software projects</a>
      </div>
      <div class="hero-trust">
        <div><strong><a href="${PRICING_PATH}">Rs ${PRICE_PKR}</a></strong><span>per student / month</span></div>
        <div><strong>WhatsApp · SMS</strong><span>alerts to parents</span></div>
        <div><strong>Custom builds</strong><span>web · mobile · cloud</span></div>
      </div>
    </div>
  </div>
</section>

<section class="strip"><div class="container"><p>What makes us different: <strong>assign us the work, take that long vacation, and we handle it all.</strong></p></div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">Our products</span><h2>Software we build and run ourselves</h2><p>Evolvora Campus runs day-to-day school life for Pakistani schools. SilaaiMarkaz connects people in Lahore with local Darzis.</p></div>
  <div class="feature-row reveal">
    <div class="feature-media tilt-3d" data-tilt-3d tabindex="0" role="img" aria-label="Evolvora Campus dashboard preview: press or drag for 3D view">${shot("homepage_evolvoracampus.png","Evolvora Campus","Evolvora Campus school management system dashboard: student and staff totals, attendance trend, fee submission breakdown and new admissions")}</div>
    <div class="feature-text"><span class="tag tag-blue">Flagship product · Live</span>
      <h3>Evolvora Campus</h3>
      <p style="color:var(--muted);font-size:16px;margin-bottom:18px">An all-in-one school management system for attendance, marks, fee collection, teacher payroll and parent communication, used to run real schools.</p>
      <ul class="ticks">
        <li>A tailored view for <strong>admins, teachers and parents</strong></li>
        <li>Fees, attendance, payroll &amp; messaging in one platform</li>
        <li>Web app today, with a mobile app on the roadmap</li>
      </ul>
      <div class="feature-actions"><a href="/products/evolvora-campus/" class="btn btn-primary">Explore Evolvora Campus ${svg("arrow")}</a><a href="/products/" class="btn btn-ghost">All products</a></div>
    </div>
  </div>
  <div class="feature-row reverse reveal">
    <div class="feature-media">${shot("silaaimarkaz/tailoring-with-trust.jpg","silaaimarkaz.com","SilaaiMarkaz: price agreed before work starts, saved measurements, visit the Darzi's shop, rated and accountable Darzis")}</div>
    <div class="feature-text"><span class="tag tag-green">Live in Lahore</span>
      <h3>SilaaiMarkaz</h3>
      <p style="color:var(--muted);font-size:16px;margin-bottom:18px">A tailoring marketplace for Lahore. Compare Darzis, save your measurements once, agree the price upfront, then visit the shop when your clothes are ready.</p>
      <ul class="ticks">
        <li>Portfolios, prices and <strong>ratings side by side</strong></li>
        <li>Measurements saved once, reused with any Darzi</li>
        <li>Android app and web, in English and Urdu</li>
      </ul>
      <div class="feature-actions"><a href="${SILAAI_PATH}" class="btn btn-primary">Explore SilaaiMarkaz ${svg("arrow")}</a><a href="${SILAAI_HOME}" class="btn btn-ghost" target="_blank" rel="noopener">Visit silaaimarkaz.com</a></div>
    </div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><span class="kicker">Evolvora Campus solutions</span><h2>One system for every part of your school</h2><p>Start with the job that costs your office the most time. It is all one platform at one <a href="${PRICING_PATH}">price per student</a>, built for schools in Pakistan.</p></div>
${solutionsGrid()}
</div></section>

<section class="section services-scroll" id="services">
  <div class="services-scroll-pin">
    <div class="container">
      <div class="section-head reveal"><span class="kicker">What we do</span><h2>Software services, end to end</h2><p>One team to take your product from a rough idea all the way to a polished, launched, maintained reality.</p></div>
      <div class="cards-scroll" data-cards-scroll>
        <div class="cards-scroll-viewport">
          <div class="cards-scroll-track">
            <div class="cards-scroll-panel">
              <div class="card"><span class="card-ic">${svg("code")}</span><h3>Custom Software Development</h3><p>Bespoke systems built around your workflow, from internal tools to customer-facing platforms.</p></div>
              <div class="card"><span class="card-ic">${svg("monitor")}</span><h3>Web Application Development</h3><p>Responsive, high-performance web apps with clean architecture and modern frameworks.</p></div>
            </div>
            <div class="cards-scroll-panel">
              <div class="card"><span class="card-ic">${svg("mobile")}</span><h3>Mobile App Development</h3><p>Cross-platform iOS &amp; Android apps that feel native and ship fast.</p></div>
              <div class="card"><span class="card-ic">${svg("layers")}</span><h3>SaaS Product Engineering</h3><p>Multi-tenant, subscription-ready products designed to scale from day one.</p></div>
            </div>
            <div class="cards-scroll-panel">
              <div class="card"><span class="card-ic">${svg("pen")}</span><h3>UI/UX Design</h3><p>Interfaces that are beautiful and intuitive: research, wireframes, prototypes and polish.</p></div>
              <div class="card"><span class="card-ic">${svg("cloud")}</span><h3>Cloud &amp; DevOps</h3><p>Deployment, CI/CD, monitoring and infrastructure that keeps your software fast and online.</p></div>
            </div>
          </div>
        </div>
        <div class="cards-scroll-dots" aria-hidden="true"><span class="active"></span><span></span><span></span></div>
      </div>
      <div class="center services-scroll-cta"><a href="/services/" class="btn btn-primary">Explore our services ${svg("arrow")}</a></div>
    </div>
  </div>
</section>

<section class="section"><div class="container">
  <div class="section-head reveal"><span class="kicker">How we work</span><h2>A clear path from idea to launch</h2><p>A simple, transparent process: you always know what's happening and what's next.</p></div>
  <div class="steps">
    <div class="step reveal"><span class="step-num">1</span><h3>Discover</h3><p>We learn your goals, users and constraints, then scope the right solution.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">2</span><h3>Design</h3><p>Wireframes and UI design so you see and shape the product before we build.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">3</span><h3>Build</h3><p>Engineering in short, visible iterations with regular working demos.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">4</span><h3>Launch &amp; support</h3><p>We deploy, monitor and keep improving after go-live.</p></div>
  </div>
</div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">Our toolkit</span><h2>Built with a modern, proven stack</h2><p>We choose reliable, well-supported technologies so your software stays fast, secure and maintainable.</p></div>
${stackGrid()}
</div></section>

${whyStorySection()}

${ctaBlock("See Evolvora Campus with your own school","Book a free walkthrough with your own classes and fee structure. Building something else? Tell us about your project and we'll reply within one business day.")}`
});

/* ---- PRODUCTS INDEX ---- */
{
  const cb = crumb([["Home","/"],["Products","/products/"]]);
  pages.push({
    file:"products/index.html", active:"products", url:"/products/",
    pageType:"CollectionPage",
    /* Only released products are listed. Evolvora Learn and Insights are
       shown as "Coming soon" on the page, so they are not asserted as offerings. */
    pageMainEntityNode:{ "@type":"ItemList","@id":SITE+"/products/#list","itemListElement":[
      { "@type":"ListItem","position":1,"item":{ "@id":CAMPUS_SW_ID } },
      { "@type":"ListItem","position":2,"item":{ "@id":SILAAI_SW_ID } } ] },
    title:"Our Products: Software We Build & Run | Evolvora",
    desc:"Products built by Evolvora, the software house: Evolvora Campus, a school management system, and SilaaiMarkaz, a tailoring marketplace in Lahore.",
    jsonld:[cb.jsonld],
    body:`
<section class="section" style="padding-top:52px"><div class="container">
  ${cb.html}
  <div class="section-head reveal" style="margin-bottom:44px"><span class="kicker">Our products</span><h1>Software we've built &amp; run ourselves</h1><p>Evolvora isn't only a services company; we design and operate our own products. Here's what we've shipped, and what's coming next.</p></div>
  <div class="section-head reveal"><h2>Products built and run by Evolvora</h2></div>
</div>
<div class="coverflow" data-coverflow data-set-count="4" aria-label="Our products">
  <div class="coverflow-track">
    <article class="coverflow-card card flagship"><span class="badge-live">Live</span><span class="card-ic">${svg("cap")}</span><h3>Evolvora Campus</h3><p>The complete school management system: admissions, attendance, marks, fee collection, teacher payroll and instant parent communication, in one place.</p><a href="/products/evolvora-campus/" class="card-link">Explore Evolvora Campus ${svg("arrow")}</a></article>
    <article class="coverflow-card card flagship"><span class="badge-live">Live</span><span class="card-ic">${svg("scissors")}</span><h3>SilaaiMarkaz</h3><p>A tailoring marketplace for Lahore: compare Darzis, save your measurements, agree the price upfront, then visit the shop when the work is ready.</p><a href="${SILAAI_PATH}" class="card-link">Explore SilaaiMarkaz ${svg("arrow")}</a></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("book")}</span><h3>Evolvora Learn</h3><p>Assignments, learning resources and online classes: a learning platform that plugs straight into Evolvora Campus.</p></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("chart")}</span><h3>Evolvora Insights</h3><p>School analytics and reporting that turn attendance, results and fee data into decisions you can act on.</p></article>
  </div>
</div></section>
${ctaBlock("Want to be first to know?","Tell us what your school needs and we'll show you what's live today, and what's coming next.")}`
  });
}

/* ---- EVOLVORA CAMPUS (product) ----
   The live page at products/evolvora-campus/index.html is hand-maintained
   (its own styles.css/script.js and markup). It is listed here only so the
   sitemap includes its URL - nothing is generated for it. */
pages.push({ url:"/products/evolvora-campus/", skipWrite:true });

/* ---- SILAAIMARKAZ (product) ----
   Generated, unlike the Campus page. The product itself lives at
   silaaimarkaz.com; this page presents it as an Evolvora product and links out.
   Copy and photos come from silaaimarkaz.com so the two never disagree. */
{
  const cb = crumb([["Home","/"],["Products","/products/"],["SilaaiMarkaz",SILAAI_PATH]]);
  const faq = faqBlock([
    {q:"What is SilaaiMarkaz?",a:"SilaaiMarkaz (also written Silaai Markaz or Silai Markaz) is a tailoring marketplace built by Evolvora Technologies. You compare tailors (Darzis) in Lahore, save your measurements, share your design and agree the price in the app, then visit the shop when the work is ready."},
    {q:"Which cities does SilaaiMarkaz cover?",a:"SilaaiMarkaz is opening with tailors (Darzis) in Lahore. Shops appear in the app as they are listed."},
    {q:"Does SilaaiMarkaz deliver my clothes?",a:"No. You visit the Darzi's shop yourself for fabric drop-off, fittings and collection. SilaaiMarkaz handles finding the right Darzi, the measurements, the design details and the agreed price."},
    {q:"How is the price decided?",a:"Each Darzi sets their own rates. The price is agreed in the app before work starts, so there is no surprise number at the shop, and you can choose to pay at the shop."},
    {q:"Is there a SilaaiMarkaz app?",a:"Yes. There is an Android app you can download from silaaimarkaz.com, and you can also find a Darzi on the website and continue on your phone. The app is available in English and Urdu."},
    {q:"I'm a Darzi. How do I join?",a:"Register your shop on the SilaaiMarkaz Darzi sign-up page at app.silaaimarkaz.com. Your work is shown to customers who are already looking, and orders arrive with measurements attached."},
  ]);
  const CATS = [
    ["ladies-formal","Ladies formal"],["bridal","Bridal &amp; heavy work"],["mens-shalwar-kameez","Men's shalwar kameez"],
    ["mens-suits-coats","Men's suits &amp; coats"],["kids-wear","Kids wear"],["school-work-uniforms","School &amp; work uniforms"],
    ["abaya-hijab","Abaya &amp; hijab"],["alterations-fitting","Alterations &amp; fitting"],["curtains-home-decor","Curtains &amp; home decor"],
    ["ladies-everyday","Ladies everyday"],
  ];
  const catTile = ([f,name]) => `<figure class="cat-tile reveal">${picture("silaaimarkaz/"+f+".jpg",{ sizes:"(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 240px", alt:name.replace(/&amp;/g,"&")+" stitched by a Darzi on SilaaiMarkaz" })}<figcaption>${name}</figcaption></figure>`;
  pages.push({
    file:"products/silaaimarkaz/index.html", active:"products", url:SILAAI_PATH,
    pageAbout:SILAAI_SW_ID,
    og:SILAAI_OG,
    pageImage:{ "@type":"ImageObject","url":SILAAI_OG,"contentUrl":SILAAI_OG,"width":1200,"height":630 },
    title:"SilaaiMarkaz: Tailoring Marketplace in Lahore | Evolvora",
    desc:"SilaaiMarkaz, by Evolvora, is a tailoring marketplace in Lahore. Compare Darzis, save your measurements, agree the price upfront, then visit the shop.",
    jsonld:[cb.jsonld, faq.jsonld, silaaiLD],
    body:`
<section class="section" style="padding-top:48px;padding-bottom:40px"><div class="container">
  ${cb.html}
  <div class="hero-inner" style="gap:48px">
    <div class="hero-copy reveal">
      <span class="eyebrow"><span class="dot"></span> Our product · Live in Lahore</span>
      <h1>SilaaiMarkaz<br><span class="grad-text">Lahore's tailoring marketplace</span></h1>
      <p class="lead"><strong>SilaaiMarkaz</strong> helps you find the right tailor in Lahore. Compare shops, save your measurements, share the design and agree the price, then visit the shop when the work is ready.</p>
      <div class="hero-cta"><a href="${SILAAI_LOGIN}" class="btn btn-primary btn-lg" target="_blank" rel="noopener">Find a Darzi</a><a href="${SILAAI_APK}" class="btn btn-ghost btn-lg" rel="noopener">Download for Android</a></div>
    </div>
    <div class="hero-shot reveal">${shot("silaaimarkaz/tailoring-with-trust.jpg","silaaimarkaz.com","How SilaaiMarkaz works: price agreed before work starts, measurements stay with you, you visit the shop, Darzis are rated and accountable",true)}</div>
  </div>
</div></section>

<section class="section" style="padding-top:20px"><div class="container"><div class="prose reveal">
  <h2>What is SilaaiMarkaz?</h2>
  <p><strong>SilaaiMarkaz</strong> (also written Silaai Markaz or Silai Markaz) is a tailoring marketplace: a place where people who want clothes stitched meet the tailors, or Darzis, who stitch them. If you are looking for a tailor in Lahore, for ladies suits, bridal wear, men's shalwar kameez or simple alterations, it lets you compare shops before you visit one. It fixes the parts of getting clothes made that usually go wrong, like the price changing at the shop, measurements taken again every time, and designs lost in a chat thread.</p>
  <p>SilaaiMarkaz is built and run by <a href="/about/">Evolvora Technologies</a>, the Lahore software house behind <a href="/products/evolvora-campus/">Evolvora Campus</a>. It works on Android and on the web at <a href="${SILAAI_HOME}" target="_blank" rel="noopener">silaaimarkaz.com</a>, in English and Urdu.</p>
</div></div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">How it works</span><h2>From choosing a Darzi to collecting your clothes</h2></div>
  <div class="steps">
    <div class="step reveal"><span class="step-num">1</span><h3>Pick a Darzi</h3><p>Portfolios, prices and turnaround, side by side.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">2</span><h3>Send measurements</h3><p>Save a profile once; every later order takes ten seconds.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">3</span><h3>Share the design</h3><p>Reference photos and notes go straight to the Darzi.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">4</span><h3>Visit the shop</h3><p>When it's ready you go to the shop, and pay there if you choose.</p></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><span class="kicker">Categories</span><h2>What you can get stitched</h2><p>From everyday wear to bridal, uniforms and alterations.</p></div>
  <div class="cat-grid">${CATS.map(catTile).join("")}</div>
</div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">Why SilaaiMarkaz</span><h2>The part that usually goes wrong, fixed</h2></div>
  <div class="benefit-grid">
    <article class="benefit reveal"><span class="benefit-ic ic-amber">${svg("star")}</span><h3>Ratings before you choose</h3><p>See ratings and reviews of each Darzi before you place an order.</p></article>
    <article class="benefit reveal"><span class="benefit-ic ic-green">${svg("fee")}</span><h3>Price agreed upfront</h3><p>The price is agreed before work starts. No surprise charges at the shop.</p></article>
    <article class="benefit reveal"><span class="benefit-ic ic-blue">${svg("ruler")}</span><h3>Measurements stay with you</h3><p>Saved measurement profiles work with any Darzi on the platform.</p></article>
    <article class="benefit reveal"><span class="benefit-ic ic-purple">${svg("shop")}</span><h3>You visit the shop</h3><p>Drop-off, fittings and collection happen at the Darzi's own shop in Lahore.</p></article>
  </div>
</div></section>

<section class="section"><div class="container"><div class="prose reveal">
  <h2>For Darzis: grow your tailoring shop</h2>
  <p>Put your work in front of customers who are already looking, take orders with measurements attached, and get paid without chasing anyone.</p>
  <ul>
    <li><strong>Get found:</strong> your portfolio, prices and turnaround are shown to customers searching in Lahore.</li>
    <li><strong>Clear orders:</strong> measurements, reference photos and notes arrive with every order.</li>
    <li><strong>Price settled first:</strong> the price is agreed before you start, so there is no haggling at the counter.</li>
  </ul>
  <p style="margin-top:24px"><a href="${SILAAI_DARZI}" class="btn btn-primary" target="_blank" rel="noopener">Register your shop ${svg("arrow")}</a></p>
</div></div></section>

<section class="section section-alt"><div class="container"><div class="section-head reveal"><span class="kicker">FAQ</span><h2>SilaaiMarkaz: common questions</h2></div>${faq.html}</div></section>

<section class="cta"><div class="cta-glow"></div><div class="container"><div class="cta-inner reveal">
  <h2>Need a Darzi in Lahore?</h2><p>Order from the app, or find a Darzi on silaaimarkaz.com and continue on your phone.</p>
  <div class="cta-actions">
    <a href="${SILAAI_HOME}" class="btn btn-primary btn-lg" target="_blank" rel="noopener">Visit silaaimarkaz.com</a>
    <a href="${SILAAI_APK}" class="btn btn-ghost btn-lg" rel="noopener">Download for Android</a>
  </div></div></div></section>`
  });
}

/* ---- PRICING ---- */
{
  const cb = crumb([["Home","/"],["Products","/products/"],["Evolvora Campus",CAMPUS_PATH],["Pricing",PRICING_PATH]]);
  const faq = faqBlock([
    {q:"How is Evolvora Campus priced?",a:`There are two plans, both charged per active student per month. Standard is Rs ${PRICE_PKR} (USD ${PRICE}) with every feature included. Enterprise is Rs ${ENT_PRICE_PKR} (USD ${ENT_PRICE}) for school networks with several campuses, and adds a dedicated account manager, on-site training and priority support. You only pay for students who are actually active in the system.`},
    {q:"Which plan is right for our school?",a:`Most single schools choose Standard: it has every feature, including multi-campus support, with no setup fee and no minimum. Enterprise suits school networks that want a named account manager, training at every campus, priority support on WhatsApp and phone, and a written ${ENT_UPTIME} uptime commitment. It has a monthly minimum of Rs ${pkr(ENT_MIN)} (USD ${ENT_MIN}).`},
    {q:"Is there a free trial?",a:"Yes. Every school on the Standard plan starts with a full month free, with all features unlocked. You're not charged anything until the trial ends, and there's no card required to begin."},
    {q:"Why are prices shown in rupees and dollars?",a:`Prices are set in US dollars and converted to rupees at USD 1 = PKR ${PKR_PER_USD} (${RATE_DATE}), so you can compare them easily. Use the switch at the top of the page to change currency.`},
    {q:"Is there a long-term contract?",a:`No. Both plans are billed monthly and you can adjust as your school grows. Enterprise schools can choose yearly billing for ${ENT_YEARLY_OFF}% off, but it is never required.`},
    {q:"Do you help us move our existing data?",a:`Yes. On Standard, our team helps you import students, classes and staff, including bulk import from an Excel file. On Enterprise, onboarding covers data migration and on-site training for each campus, for a one-time Rs ${pkr(ENT_ONBOARD)} (USD ${ENT_ONBOARD}) per campus, waived on yearly billing.`},
    {q:"Can parents and teachers use it for free?",a:"Yes. Teacher and parent access is included in both plans at no extra per-user cost. You're billed at the school level, not per parent."},
  ]);
  const toggle = `<div class="currency-toggle reveal" role="group" aria-label="Show prices in"><button type="button" data-currency="pkr" aria-pressed="true">PKR (Rs)</button><button type="button" data-currency="usd" aria-pressed="false">USD ($)</button></div>`;
  pages.push({
    file:"products/evolvora-campus/pricing/index.html", active:"pricing", url:PRICING_PATH,
    pageAbout:CAMPUS_SW_ID,
    title:`Evolvora Campus Pricing: Plans from Rs ${PRICE_PKR} per Student`,
    desc:`Evolvora Campus pricing in rupees or dollars: Standard at Rs ${PRICE_PKR} per student per month with a free first month, and Enterprise for multi-campus school networks.`,
    jsonld:[cb.jsonld, faq.jsonld, pricingLD],
    body:`
<section class="section" style="padding-top:52px"><div class="container">
  ${cb.html}
  <div class="section-head reveal"><span class="kicker">Pricing</span><h1>Simple pricing for every school</h1><p>Two plans, both charged per active student per month, with unlimited teacher and parent accounts. Start with a free month on Standard, or talk to us about Enterprise for a network of campuses.</p>
    <div class="hero-cta pricing-cta"><a href="/contact/" class="btn btn-primary btn-lg">Start your free month</a><a href="/contact/" class="btn btn-ghost btn-lg">Book a demo</a></div>
  </div>
  ${toggle}
  <div class="price-grid two">
    <div class="price pop reveal"><span class="pop-tag">1 month free</span><h3>Standard</h3><p class="p-sub">Every feature, for schools of any size.</p><div class="p-amt">${money(PRICE)}<small>/student / mo</small></div><p class="p-note">Billed monthly · no setup fee · no minimum</p><ul class="ticks sm"><li>Students, classes &amp; sections</li><li>Attendance &amp; marks</li><li>Fee tracking, with reminders on WhatsApp &amp; SMS</li><li>Fee payments through JazzCash &amp; EasyPaisa</li><li>Parent app &amp; notifications</li><li>Teacher payroll &amp; salary calculation</li><li>Bulk import &amp; auto parent accounts</li><li>Groups, read receipts &amp; web push</li><li>Multi-campus support</li><li>Unlimited teacher &amp; parent accounts</li><li>Onboarding, data import &amp; support</li></ul><a href="/contact/" class="btn btn-primary">Start your free month</a></div>
    <div class="price reveal"><h3>Enterprise</h3><p class="p-sub">For school networks with several campuses.</p><div class="p-amt">${money(ENT_PRICE)}<small>/student / mo</small></div><p class="p-note">Minimum ${money(ENT_MIN)} a month · ${ENT_YEARLY_OFF}% off billed yearly</p><ul class="ticks sm"><li><strong>Everything in Standard</strong></li><li>Head-office view across every campus</li><li>A dedicated account manager</li><li>On-site staff training at every campus</li><li>Priority support on WhatsApp &amp; phone</li><li>${ENT_UPTIME} uptime commitment, in writing</li><li>Data migration for each campus: ${money(ENT_ONBOARD)} one-time per campus, waived on yearly billing</li></ul><a href="/contact/" class="btn btn-ghost">Talk to us about Enterprise</a></div>
  </div>
  <p class="reveal" style="text-align:center;color:var(--faint);font-size:13px;margin-top:22px">Only active students are billed. No per-parent charge, no long-term contract. Prices are set in US dollars; rupee prices are converted at USD 1 = PKR ${PKR_PER_USD} (${RATE_DATE}).</p>
</div></section>
<section class="section section-alt"><div class="container"><div class="section-head reveal"><span class="kicker">Questions</span><h2>Pricing FAQ</h2></div>${faq.html}</div></section>
${ctaBlock("Standard or Enterprise? We'll help you choose","Tell us how many students and campuses you have, and we'll recommend a plan and send a clear quote.")}`
  });
}

/* ---- CONTACT ---- */
{
  const cb = crumb([["Home","/"],["Contact","/contact/"]]);
  const ld = { "@context":"https://schema.org","@type":"ContactPage","name":"Contact Evolvora Technologies","url":SITE+"/contact/" };
  pages.push({
    file:"contact/index.html", active:"contact", url:"/contact/",
    pageType:"ContactPage", pageMainEntity:ORG_ID,
    title:"Contact Evolvora Technologies: Book a Demo",
    desc:"Get in touch with Evolvora Technologies to book a free demo of Evolvora Campus, ask about pricing, or discuss moving your school onto one connected platform.",
    jsonld:[cb.jsonld, ld],
    body:`
<section class="section" style="padding-top:52px"><div class="container">
  ${cb.html}
  <div class="section-head reveal" style="margin-bottom:40px"><span class="kicker">Contact</span><h1>Let's get your school set up</h1><p>Book a free demo, ask about pricing, or tell us what you need. Call us on <a href="${PHONE_TEL}">${PHONE_DISPLAY}</a> or use the form, and we usually reply within one business day. Building something other than a school system? Tell us about your project here too.</p></div>
  <div class="contact-wrap">
    <form class="reveal" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact/?sent=1">
      <input type="hidden" name="form-name" value="contact">
      <p style="display:none"><label>Don't fill this out: <input name="bot-field"></label></p>
      <div class="field"><label for="name">Your name</label><input id="name" name="name" type="text" required placeholder="e.g. Memona Khan"></div>
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required placeholder="you@school.edu"></div>
      <div class="field"><label for="school">School / organisation</label><input id="school" name="school" type="text" placeholder="e.g. The Educators"></div>
      <div class="field"><label for="students">Approx. number of students</label><input id="students" name="students" type="text" placeholder="e.g. 400"></div>
      <div class="field"><label for="message">How can we help?</label><textarea id="message" name="message" required placeholder="Tell us a little about your school and what you're looking for…"></textarea></div>
      <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Send message</button>
      <p style="color:var(--faint);font-size:12.5px;margin-top:12px;text-align:center">Prefer email? Write to <a href="mailto:${EMAIL}" style="color:var(--sky)">${EMAIL}</a></p>
    </form>
    <div class="contact-info reveal">
      <h2>Talk to us</h2>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.mail}</svg></span><div><b>Email</b><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.phone}</svg></span><div><b>Phone</b><a href="${PHONE_TEL}">${PHONE_DISPLAY}</a></div></div>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.globe}</svg></span><div><b>Office</b><span>Evolvora Technologies, ${ADDRESS_TEXT}</span></div></div>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.globe}</svg></span><div><b>Already a customer?</b><a href="${APP_TARGET}" rel="noopener">Log in to Evolvora Campus</a></div></div>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.cap}</svg></span><div><b>Book a demo</b><span>See Evolvora Campus with your own classes &amp; fees.</span></div></div>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.clock}</svg></span><div><b>Response time</b><span>Usually within one business day.</span></div></div>
    </div>
  </div>
</div></section>`
  });
}

/* ---- SERVICES ---- */
{
  const cb = crumb([["Home","/"],["Services","/services/"]]);
  const SERVICE_ITEMS = [
    { ic:"code", title:"Custom Software Development", desc:"Bespoke systems designed around your exact workflow and business logic.", items:["Internal tools &amp; admin systems","Customer-facing platforms","API &amp; integration work"] },
    { ic:"monitor", title:"Web Application Development", desc:"Modern, responsive web apps that are fast, secure and easy to maintain.", items:["Dashboards &amp; portals","Progressive web apps","Clean, scalable architecture"] },
    { ic:"mobile", title:"Mobile App Development", desc:"Cross-platform apps for iOS &amp; Android from a single, efficient codebase.", items:["Native-feeling UX","Push notifications &amp; offline","App store deployment"] },
    { ic:"layers", title:"SaaS Product Engineering", desc:"Subscription-ready, multi-tenant products designed to scale from day one.", items:["Multi-tenant architecture","Billing &amp; user management","Built to grow with you"] },
    { ic:"pen", title:"UI/UX Design", desc:"Interfaces that are beautiful, intuitive and grounded in real user needs.", items:["Research &amp; wireframes","Interactive prototypes","Design systems"] },
    { ic:"cloud", title:"Cloud &amp; DevOps", desc:"Reliable deployment and infrastructure that keeps your software online.", items:["CI/CD pipelines","Monitoring &amp; alerts","Cloud hosting &amp; scaling"] }
  ];
  const serviceCard = (s) => `<article class="services-coverflow-card card"><span class="card-ic">${svg(s.ic)}</span><h3>${s.title}</h3><p>${s.desc}</p><ul class="ticks sm" style="margin-top:16px">${s.items.map((i) => `<li>${i}</li>`).join("")}</ul></article>`;
  const servicesCoverflow = () => `<div class="services-coverflow" data-coverflow data-set-count="${SERVICE_ITEMS.length}" aria-label="Our services">
    <div class="services-coverflow-track">${SERVICE_ITEMS.map(serviceCard).join("")}</div>
  </div>`;
  pages.push({
    file:"services/index.html", active:"services", url:"/services/",
    pageType:"CollectionPage", pageMainEntity:SERVICE_ID,
    title:"Software Development Services | Evolvora Software House",
    desc:"Evolvora's software services: custom software, web & mobile apps, SaaS product engineering, UI/UX design and cloud & DevOps, from idea to launch and beyond.",
    jsonld:[cb.jsonld, { "@context":"https://schema.org","@type":"Service","@id":SERVICE_ID,"name":"Software development services","serviceType":"Software development","provider":{"@id":ORG_ID},"areaServed":"Worldwide","description":"Custom software, web and mobile app development, SaaS product engineering, UI/UX design and cloud & DevOps." }],
    body:`
<section class="section" style="padding-top:52px;padding-bottom:20px"><div class="container">
  ${cb.html}
  <div class="section-head reveal"><span class="kicker">Services</span><h1>Everything you need to build great software</h1><p>Whether you're starting from a blank page or scaling an existing product, we cover the whole journey: strategy, design, engineering and operations.</p></div>
</div></section>

<section class="section services-coverflow-section" style="padding-top:20px;padding-bottom:56px">
  <div class="container"><div class="section-head reveal"><h2>Our software development services</h2></div></div>
  ${servicesCoverflow()}
</section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">How we work</span><h2>A clear path from idea to launch</h2><p>Transparent, iterative and collaborative. You're involved at every step.</p></div>
  <div class="steps">
    <div class="step reveal"><span class="step-num">1</span><h3>Discover</h3><p>We learn your goals, users and constraints, then scope the right solution.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">2</span><h3>Design</h3><p>Wireframes and UI so you shape the product before we build it.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">3</span><h3>Build</h3><p>Engineering in short, visible iterations with working demos.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">4</span><h3>Launch &amp; support</h3><p>We deploy, monitor and keep improving after go-live.</p></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><span class="kicker">Our toolkit</span><h2>A modern, proven stack</h2></div>
${stackGrid()}
</div></section>

${ctaBlock("Let's build something great","Tell us about your project and we'll get back within one business day with next steps.")}`
  });
}

/* ---- ABOUT ---- */
{
  const cb = crumb([["Home","/"],["About","/about/"]]);
  const stat = (n,l) => `<div class="card reveal center"><div style="font-family:'Space Grotesk';font-weight:700;font-size:34px;background:var(--grad-text);-webkit-background-clip:text;background-clip:text;color:transparent">${n}</div><p style="margin-top:6px;flex:none">${l}</p></div>`;
  pages.push({
    file:"about/index.html", active:"about", url:"/about/", mainClass:"about-page",
    pageType:"AboutPage", pageMainEntity:ORG_ID,
    title:"About Evolvora: A Software House Built on Craft",
    desc:"Evolvora is a software house that designs, builds and runs modern web, mobile and cloud software. Learn our mission, values and products like Evolvora Campus.",
    jsonld:[cb.jsonld, orgLD, { "@context":"https://schema.org","@type":"AboutPage","name":"About Evolvora Technologies","url":SITE+"/about/",
      "isPartOf":{ "@id":SITE_ID },
      "mainEntity":{ "@id":ORG_ID },
      "about":{ "@id":ORG_ID } }],
    body:`
<section class="about-hero">
  <div class="about-hero-bg" aria-hidden="true">
    <div class="hero-mesh"></div>
    <div class="hero-grid"></div>
    <div class="about-hero-overlay"></div>
    <div class="hero-fade"></div>
  </div>
  <div class="container">
    ${cb.html}
    <div class="about-hero-panel reveal">
      <span class="kicker">About us</span>
      <h1>We're Evolvora - a software house on a mission</h1>
      <p>Evolvora Technologies is the company behind Evolvora. We design, build and ship <strong>web, mobile and cloud software</strong> for businesses that want a partner who genuinely cares about the outcome - not just the deliverable.</p>
      <div class="about-hero-actions">
        <a href="/contact/" class="btn btn-primary btn-lg">Get in touch</a>
      </div>
    </div>
  </div>
</section>

<section class="section about-story"><div class="container">
  <div class="about-prose-float reveal">
    <span class="about-prose-border-light" aria-hidden="true"><span class="about-prose-light-dot"></span></span>
    <div class="prose">
      <p>What sets us apart is that we build and run our own products too. Our flagship, <strong>Evolvora Campus</strong>, is a full school management system used to run real schools, so we know first-hand what it takes to design, launch and support software that people depend on every single day. Our second product, <strong><a href="${SILAAI_PATH}">SilaaiMarkaz</a></strong>, is a tailoring marketplace that connects customers in Lahore with local Darzis.</p>
      <p>That product mindset shapes everything we do for clients: clean architecture, thoughtful design, honest timelines, and a commitment to stick around long after launch.</p>
      <p>Evolvora Technologies was founded by <strong>${FOUNDER}</strong> and works from ${ADDRESS_TEXT}. You can reach us on <a href="${PHONE_TEL}">${PHONE_DISPLAY}</a> or at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
    </div>
  </div>
</div></section>

<section class="section section-alt about-values"><div class="container">
  <div class="section-head reveal"><span class="kicker">What we value</span><h2>The principles behind our work</h2></div>
  <div class="cards about-stagger">
    <div class="card reveal"><span class="card-ic">${svg("spark")}</span><h3>Craft over shortcuts</h3><p>We write clean, maintainable code and design with care. Quality that lasts beyond the demo.</p></div>
    <div class="card reveal"><span class="card-ic">${svg("eye")}</span><h3>Transparency</h3><p>Clear scope, regular demos and honest communication. No surprises, no jargon.</p></div>
    <div class="card reveal"><span class="card-ic">${svg("handshake")}</span><h3>Partnership</h3><p>We're in it for the long run, supporting and growing your software as your needs evolve.</p></div>
  </div>
</div></section>

<section class="section about-products"><div class="container">
  <div class="section-head reveal"><span class="kicker">Our products</span><h2>Software we've built ourselves</h2><p>The clearest proof of how we work is what we ship under our own name.</p></div>
</div>
<div class="coverflow" data-coverflow data-set-count="4" aria-label="Our products">
  <div class="coverflow-track">
    <article class="coverflow-card card flagship"><span class="badge-live">Live</span><span class="card-ic">${svg("cap")}</span><h3>Evolvora Campus</h3><p>All-in-one school management system for fees, attendance, payroll and parent communication.</p><a href="/products/evolvora-campus/" class="card-link">Explore ${svg("arrow")}</a></article>
    <article class="coverflow-card card flagship"><span class="badge-live">Live</span><span class="card-ic">${svg("scissors")}</span><h3>SilaaiMarkaz</h3><p>A tailoring marketplace in Lahore that connects customers with rated local Darzis.</p><a href="${SILAAI_PATH}" class="card-link">Explore ${svg("arrow")}</a></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("book")}</span><h3>Evolvora Learn</h3><p>A learning platform for assignments, resources and online classes.</p></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("chart")}</span><h3>Evolvora Insights</h3><p>Analytics that turn everyday data into clear decisions.</p></article>
  </div>
</div></section>

${ctaBlock("Want to work with us?","Whether it's a new product or an existing one to grow, we'd love to hear what you're building.")}`
  });
}

/* ---- KEYWORD / SOLUTION PAGES ---- */
/* Pakistan-specific points shared by every solution page. A page can put its
   own point first (pkLead) so the most relevant local detail leads. */
const PK_POINTS = [
  "<strong>WhatsApp and SMS alerts:</strong> fee reminders, attendance and announcements reach parents on the apps they already use.",
  "<strong>JazzCash and EasyPaisa:</strong> parents can pay school fees online from their phones.",
  `<strong>Priced in rupees:</strong> Rs ${PRICE_PKR} per active student per month, with a free first month. <a href="${PRICING_PATH}">See pricing</a>.`,
  `<strong>Support from Lahore:</strong> call <a href="${PHONE_TEL}">${PHONE_DISPLAY}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a>, in English or Urdu.`,
];
/* "School ERP" keeps its acronym when the keyword is used mid-sentence. */
const kwInline = (kw) => kw.toLowerCase().replace(/\berp\b/, "ERP");
function solutionPage({file,url,kw,title,desc,h1,intro,whatH,whatP,media,media2,media2b,benefits,why,faqItems,related,capsH,whyH,pkLead,ctaH}) {
  const cb = crumb([["Home","/"],["Solutions",related.length?"/products/":"/products/"],[kw,url]]);
  const faq = faqBlock(faqItems);
  const relCards = related.map(([s,t,ic])=>`<a class="card reveal" href="/${s}/"><span class="card-ic">${svg(ic)}</span><h3>${t}</h3><span class="card-link">Learn more ${svg("arrow")}</span></a>`).join("");
  return {
    file, active:"products", url, title, desc,
    pageAbout:CAMPUS_SW_ID,
    jsonld:[cb.jsonld, faq.jsonld],
    body:`
<section class="section" style="padding-top:48px;padding-bottom:40px"><div class="container">
  ${cb.html}
  <div class="hero-inner" style="gap:48px">
    <div class="hero-copy reveal">
      <span class="eyebrow"><span class="dot"></span> ${kw}</span>
      <h1>${h1}</h1>
      <p class="lead">${intro}</p>
      <div class="hero-cta"><a href="/contact/" class="btn btn-primary btn-lg">Book a free demo</a><a href="/products/evolvora-campus/" class="btn btn-ghost btn-lg">Explore the platform</a></div>
    </div>
    <div class="hero-shot reveal">${media.phones
      ? `<div class="phone-pair">${media.phones.map(p => `<div class="phone">${picture(p.img, { alt: p.alt, eager: true, sizes: PHONE_SIZES })}</div>`).join("")}</div>`
      : shot(media.img,media.label,media.alt,true)}</div>
  </div>
</div></section>

<section class="section" style="padding-top:20px"><div class="container"><div class="prose reveal">
  <h2>${whatH}</h2>
  ${whatP.map(p=>`<p>${p}</p>`).join("")}
  ${[].concat(media2 || [], media2b || []).map(m => `<figure style="margin:32px 0 0">${shot(m.img,m.label,m.alt,false,"(max-width: 1000px) calc(100vw - 48px), 820px")}<figcaption style="margin-top:12px;color:var(--faint);font-size:14px;text-align:center">${m.caption}</figcaption></figure>`).join("")}
</div></div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">Capabilities</span><h2>${capsH || "What you get with Evolvora Campus"}</h2></div>
  <div class="benefit-grid">${benefits.map(b=>`<article class="benefit reveal"><span class="benefit-ic ${b.c}">${svg(b.ic)}</span><h3>${b.h}</h3><p>${b.p}</p></article>`).join("")}</div>
</div></section>

<section class="section"><div class="container"><div class="prose reveal">
  <h2>${whyH || "Why schools pick Evolvora Campus"}</h2>
  <ul>${why.map(w=>`<li>${w}</li>`).join("")}</ul>
  <h2 style="margin-top:40px">Built for schools in Pakistan</h2>
  <ul>${(pkLead ? [pkLead, ...PK_POINTS] : PK_POINTS).map(w=>`<li>${w}</li>`).join("")}</ul>
  <p style="margin-top:24px"><a href="/contact/" class="btn btn-primary">Book a demo ${svg("arrow")}</a> <a href="${PRICING_PATH}" class="btn btn-ghost">See pricing</a></p>
</div></div></section>

<section class="section section-alt"><div class="container"><div class="section-head reveal"><span class="kicker">FAQ</span><h2>${kw}: common questions</h2></div>${faq.html}</div></section>

<section class="section"><div class="container"><div class="section-head reveal"><span class="kicker">Related</span><h2>Explore related solutions</h2></div><div class="cards">${relCards}</div></div></section>

${ctaBlock(ctaH || `See Evolvora Campus, your ${kwInline(kw)}`,"Book a free walkthrough with your own school data and see how much time Evolvora Campus saves your team.")}`
  };
}

pages.push(solutionPage({
  file:"school-management-system/index.html", url:"/school-management-system/", kw:"School Management System",
  title:"School Management System in Pakistan | Evolvora Campus",
  desc:"A complete school management system for Pakistani schools: attendance, marks, fee collection, teacher payroll and parent alerts on WhatsApp and SMS, in one platform.",
  h1:"A school management system that <span class=\"grad-text\">does it all</span>",
  intro:"Evolvora Campus is a modern <strong>school management system</strong> that brings admissions, attendance, marks, fee collection, teacher payroll and parent communication into one simple platform so your whole school runs from a single screen.",
  whatH:"What is a school management system?",
  capsH:"Everything a school management system should cover",
  whyH:"Why schools move from registers and spreadsheets to Evolvora Campus",
  whatP:["A <strong>school management system</strong> is software that replaces the scattered registers, spreadsheets and message groups a school uses day to day. Instead of tracking attendance in one place, fees in another and results somewhere else, everything lives in one connected system that admins, teachers and parents can all access.",
    "Evolvora Campus was built for real schools. Set it up once (your classes, sections, staff and students) and information flows automatically. Teachers record attendance and marks from the classroom, the office tracks fees and salaries, and parents are notified instantly on their phones."],
  media:{img:"homepage_evolvoracampus.png",label:"Evolvora Campus",alt:"School management system dashboard in Evolvora Campus"},
  benefits:[
    {c:"ic-blue",ic:"cap",h:"Student &amp; class records",p:"Every student, class and section in one searchable place. Add them individually or import a whole class from Excel."},
    {c:"ic-cyan",ic:"clock",h:"Attendance tracking",p:"Mark a full class present, late or absent in seconds, with live totals and trends."},
    {c:"ic-green",ic:"fee",h:"Fee management",p:"See paid, pending and outstanding fees at a glance and send reminders in a tap."},
    {c:"ic-amber",ic:"salary",h:"Staff &amp; payroll",p:"Store pay, allowances and tax status per teacher, and salaries calculate automatically."},
  ],
  why:["<strong>All-in-one:</strong> attendance, marks, fees, payroll and messaging in a single system, with no more disconnected tools.",
    "<strong>Made for everyone:</strong> tailored views for admins, teachers and parents, with no training required.",
    "<strong>Mobile-ready:</strong> parents get instant updates on their phones; teachers work from the classroom.",
    "<strong>Fast to launch:</strong> bulk-import students and auto-create parent logins in minutes."],
  faqItems:[
    {q:"What does a school management system do?",a:"It centralises the daily running of a school (student records, attendance, marks, fee collection, staff and payroll, and parent communication) into one platform so information is entered once and shared automatically with everyone who needs it."},
    {q:"Is Evolvora Campus suitable for small schools?",a:"Yes. Evolvora Campus scales from small schools to large multi-section campuses. You only pay for the active students you have, and teacher and parent access is always included."},
    {q:"Can parents access the school management system?",a:"Yes. Parents get their own app view showing their child's attendance, marks, fees and teachers, plus instant notifications, all created automatically when you add students."},
    {q:"How long does it take to set up?",a:"Most schools are up and running quickly. You can bulk-import students and staff from an Excel file, and parent accounts are generated for you."},
  ],
  related:[["student-attendance-software","Student Attendance Software","clock"],["school-fee-management-software","Fee Management Software","fee"],["school-erp","School ERP","shield"]]
}));

pages.push(solutionPage({
  file:"campus-management-system/index.html", url:"/campus-management-system/", kw:"Multi-Campus School Management",
  title:"Multi-Campus School Management Software | Evolvora Campus",
  desc:"Run every branch of your school from one account. Each campus keeps its own classes, staff and fees, and head office sees all of them in one place.",
  h1:"Multi-campus school management<br><span class=\"grad-text\">for schools with more than one branch</span>",
  intro:"Evolvora Campus is <strong>multi-campus school management software</strong> for school networks with several campuses or branches. Every campus keeps its own classes, staff and fee records, while head office sees the whole network in one live picture.",
  whatH:"What is multi-campus school management software?",
  capsH:"What school networks get with Evolvora Campus",
  whyH:"Why school networks pick Evolvora Campus",
  whatP:["<strong>Multi-campus school management software</strong> runs a group of schools from one system: enrolment, classes and sections, attendance, fees, staff and payroll, and parent communication for every branch. What separates it from a single-school system is control: each campus runs day to day on its own, while head office can see the totals and compare branches.",
    `Evolvora Campus is structured for exactly that. Each campus keeps its own sections, staff directory and fee ledger, so a teacher only sees their own classes and a branch head only sees their branch, while head office gets one consolidated view across every campus. Networks that want a dedicated account manager and training at every campus can choose the <a href="${PRICING_PATH}">Enterprise plan</a>.`,
    "Evolvora Campus is built for schools, not universities. For a single-site school, our <a href=\"/school-management-system/\">school management system</a> page is the better starting point."],
  media:{img:"teacher-dashboard.png",label:"Evolvora Campus",alt:"Multi-campus school management dashboard in Evolvora Campus"},
  benefits:[
    {c:"ic-purple",ic:"layers",h:"Every branch, one system",p:"Each campus keeps its own classes, sections, staff and fees, all inside one account."},
    {c:"ic-blue",ic:"users",h:"Access by role",p:"Teachers see their own classes, branch heads their own campus, and head office sees them all."},
    {c:"ic-cyan",ic:"bell",h:"Network-wide messaging",p:"Reach a class, a campus or every parent in the network in one message, with read receipts."},
    {c:"ic-green",ic:"chart",h:"Head-office view",p:"Attendance, fee collection and outstanding dues for every campus, side by side on one dashboard."},
  ],
  why:["<strong>Built for branches:</strong> each campus runs on its own, and head office sees every one.",
    "<strong>One source of truth:</strong> admins, teachers and parents across the network share the same live data.",
    "<strong>Instant communication:</strong> announcements and alerts reach the right campus immediately.",
    "<strong>Simple to run:</strong> a clean, modern interface that staff at every branch pick up on day one."],
  pkLead:`<strong>An Enterprise plan for networks:</strong> Rs ${ENT_PRICE_PKR} per active student per month, with a dedicated account manager and on-site training at every campus. <a href="${PRICING_PATH}">Compare plans</a>.`,
  faqItems:[
    {q:"What's the difference between multi-campus and single-school management software?",a:"Single-school software runs one site. Multi-campus software adds a layer above it: each branch keeps its own classes, staff and fees, and head office sees every branch together and can compare them. Evolvora Campus does both, so a school can start with one campus and add branches later."},
    {q:"Can each branch head see only their own campus?",a:"Yes. Access is role-based: teachers see their own classes, branch heads see their own campus, and head office sees every campus in one view."},
    {q:"Is there a plan for school networks?",a:`Yes. The Standard plan (Rs ${PRICE_PKR} per active student per month) already includes multi-campus support. The Enterprise plan (Rs ${ENT_PRICE_PKR} per active student per month) adds a dedicated account manager, on-site training at every campus, priority support on WhatsApp and phone, and a written ${ENT_UPTIME} uptime commitment.`},
    {q:"Does it include parent communication?",a:"Yes. Marks, attendance, fee reminders and announcements reach parents instantly in the app and on WhatsApp and SMS, with read tracking so you know who has seen each message."},
    {q:"Is training required for staff?",a:"No. The interface is intentionally simple, and we help with onboarding and data import so every campus is productive right away. Enterprise networks also get on-site training at each campus."},
  ],
  ctaH:"See Evolvora Campus run every branch",
  related:[["school-management-system","School Management System","layers"],["school-erp","School ERP","shield"],["student-attendance-software","Student Attendance Software","clock"]]
}));

pages.push(solutionPage({
  file:"school-erp/index.html", url:"/school-erp/", kw:"School ERP",
  title:"School ERP Software for Finance, HR & Payroll | Evolvora",
  desc:"School ERP software for the back office: staff records, automatic teacher payroll, a full fee ledger and finance reporting on one set of student data.",
  h1:"School ERP software<br><span class=\"grad-text\">for finance, HR and payroll</span>",
  intro:"Evolvora Campus is modern <strong>school ERP software</strong> for the back office: staff records, automatic teacher payroll, a full fee ledger and finance reporting, all sharing one set of student data instead of living in separate spreadsheets.",
  whatH:"What is school ERP software?",
  capsH:"The back-office modules you get",
  whyH:"Why schools replace a legacy ERP with Evolvora Campus",
  whatP:["<strong>School ERP</strong> (Enterprise Resource Planning) software is the administrative and financial backbone of a school: staff and HR records, payroll, fee collection and the finance ledger, all reading from the same student information. The distinction from day-to-day academic tools is where the weight sits. An ERP is judged on whether the money and the staff records are right.",
    "Traditional school ERPs are powerful but painful to use. Evolvora Campus delivers the same connected control (including automatic teacher salary calculation and a full fee ledger) in a clean, modern interface your staff will actually enjoy using."],
  media:{img:"staff_directory_img.png",label:"Evolvora Campus",alt:"School ERP staff and payroll module in Evolvora Campus"},
  media2:{img:"school-expense-tracker.jpg",label:"Evolvora Campus · Expenses",alt:"School expense tracker in Evolvora Campus showing this month's total of Rs. 984,000, an expense trend chart and expenses by category, with salaries the largest at 81%",
    caption:"The daily expense tracker: every school expense by category (salaries, bills, repairs, furniture, stationery), with monthly totals, a trend chart and recurring expenses."},
  benefits:[
    {c:"ic-blue",ic:"cap",h:"Student information",p:"A complete, searchable record for every student, class and section."},
    {c:"ic-amber",ic:"salary",h:"HR &amp; payroll",p:"Staff records with basic pay, allowances and tax status, and salaries are calculated automatically."},
    {c:"ic-green",ic:"fee",h:"Finance &amp; fees",p:"Track dues, collect fees and see your whole-school fee position in real time."},
    {c:"ic-purple",ic:"shield",h:"One secure system",p:"Role-based access for admins, teachers and parents. Everyone sees exactly what they should."},
  ],
  why:["<strong>Truly integrated:</strong> academics, HR, finance and communication share one database.",
    "<strong>Modern &amp; usable:</strong> none of the clutter of legacy ERP software.",
    "<strong>Automated payroll:</strong> teacher salaries computed from stored pay and tax settings.",
    "<strong>Expense tracking:</strong> record daily school expenses by category and payment method, and see monthly totals and trends at a glance.",
    "<strong>Grows with you:</strong> from a single school to multiple campuses."],
  faqItems:[
    {q:"What is a school ERP?",a:"A school ERP is software that integrates the core functions of running a school (student records, staff and payroll, attendance, fees and finance, and communication) into one connected system, replacing disconnected spreadsheets and tools."},
    {q:"Does Evolvora Campus handle teacher payroll?",a:"Yes. You store each teacher's basic pay, allowances and tax status, and monthly salary is calculated automatically, with no separate payroll spreadsheet needed."},
    {q:"Is it easier to use than traditional ERP software?",a:"Yes. Evolvora Campus is designed around a clean, modern interface so staff can use it without lengthy training, while still giving you the connected control of an ERP."},
    {q:"Can it manage school finances and fees?",a:"Yes. Evolvora Campus tracks fee dues and collections and shows your whole-school fee position (paid, pending and under review) in real time."},
  ],
  related:[["school-management-system","School Management System","layers"],["school-fee-management-software","Fee Management Software","fee"],["campus-management-system","Multi-Campus School Management","globe"]]
}));

pages.push(solutionPage({
  file:"student-attendance-software/index.html", url:"/student-attendance-software/", kw:"Student Attendance Software",
  title:"Student Attendance Software | Evolvora Campus",
  desc:"Evolvora Campus is student attendance software that lets teachers mark a full class in seconds, with live totals, trends and instant parent alerts.",
  h1:"Student attendance software<br><span class=\"grad-text\">that takes seconds a day</span>",
  intro:"Evolvora Campus includes fast, reliable <strong>student attendance software</strong> that lets teachers mark a whole class in seconds, keeps accurate daily records, and notifies parents automatically when it matters.",
  whatH:"What is student attendance software?",
  capsH:"What marking attendance looks like day to day",
  whyH:"Why teachers keep using it after the first week",
  whatP:["<strong>Student attendance software</strong> replaces paper registers with a digital system for recording who is present, late or absent each day. Good attendance software is quick for teachers, accurate for the office, and transparent for parents.",
    "In Evolvora Campus, a teacher opens their class, taps <strong>Present, Late or Absent</strong> for each student (or marks everyone present and flags the exceptions), and totals update live. Attendance feeds straight into dashboards and the parent app, so families and administrators always have the real picture."],
  media:{phones:[
    {img:"attendance_phone_overview.jpg",alt:"Teacher's view in the Evolvora Campus phone app: 28 present, 0 on leave, 0 absent, and the Take Attendance list for Nursery, Section A"},
    {img:"attendance_phone_list.jpg",alt:"Marking each student Present, Leave or Absent in the Evolvora Campus phone app, with a Save & Send to Parents button"}]},
  benefits:[
    {c:"ic-cyan",ic:"clock",h:"Mark in seconds",p:"Tap through a class fast, or \"swipe present\" and flag only the exceptions."},
    {c:"ic-blue",ic:"chart",h:"Trends &amp; reports",p:"Daily totals and a 14-day trend show attendance patterns at a glance."},
    {c:"ic-green",ic:"bell",h:"Instant parent alerts",p:"Parents can be told about their child's attendance automatically, in the app and on WhatsApp and SMS."},
    {c:"ic-purple",ic:"cap",h:"Per-student history",p:"Every child has a clear attendance record parents can view anytime."},
  ],
  why:["<strong>Genuinely fast:</strong> a full class marked in under a minute.",
    "<strong>Accurate records:</strong> no lost registers, no double entry.",
    "<strong>Parents in the loop:</strong> attendance shows up in the parent app instantly.",
    "<strong>Part of the whole:</strong> attendance connects to dashboards, marks and reports."],
  faqItems:[
    {q:"How do teachers take attendance in Evolvora Campus?",a:"Teachers open their class and tap Present, Late or Absent for each student. They can also mark everyone present at once and only change the exceptions. Totals update live as they go."},
    {q:"Can parents see their child's attendance?",a:"Yes. Each child's attendance record is visible in the parent app, and parents can be notified automatically about attendance updates."},
    {q:"Does it show attendance trends?",a:"Yes. Evolvora Campus shows daily present/late/absent totals and a 14-day trend, so schools can spot patterns early."},
    {q:"Is the attendance software part of a bigger system?",a:"Yes. Attendance is one module of Evolvora Campus, which also covers marks, fees, payroll and parent communication, all connected."},
  ],
  pkLead:"<strong>Absence alerts on WhatsApp and SMS:</strong> when a child is marked absent or late, parents can hear about it on the phone they already carry.",
  related:[["school-management-system","School Management System","layers"],["campus-management-system","Multi-Campus School Management","globe"],["school-fee-management-software","Fee Management Software","fee"]]
}));

pages.push(solutionPage({
  file:"school-fee-management-software/index.html", url:"/school-fee-management-software/", kw:"School Fee Management Software",
  title:"School Fee Management Software | Evolvora Campus",
  desc:"Evolvora Campus is school fee management software to track dues, see paid, pending and outstanding fees at a glance, and send parent reminders in a tap.",
  h1:"School fee management software<br><span class=\"grad-text\">that ends the chasing</span>",
  intro:"Evolvora Campus is powerful <strong>school fee management software</strong> that shows exactly who has paid, who is pending and what's outstanding, and lets you send fee reminders to parents in a single tap.",
  whatH:"What is school fee management software?",
  capsH:"How fee collection works in Evolvora Campus",
  whyH:"Why schools stop chasing fee payments by hand",
  whatP:["<strong>School fee management software</strong> handles the money side of running a school: recording fee dues, tracking payments, flagging outstanding balances and communicating reminders to parents, without stacks of spreadsheets or manual follow-up calls.",
    "Evolvora Campus gives your office a live, whole-school view of fees: paid, pending and under review, plus the total outstanding amount right on the dashboard. Parents see their own child's fee status in the app, and reminders go out with a tap, so collection is faster and far less stressful."],
  media:{img:"fee_records_admin.jpg",label:"Evolvora Campus",alt:"Fee Records screen in Evolvora Campus listing each student's class, fee cycle, amount and Paid, Pending or Waived status"},
  media2:{img:"parent_fee_pending.jpg",label:"Evolvora Campus · Parent",alt:"Parent dashboard in Evolvora Campus showing the September fee as Pending with an Upload voucher button",
    caption:"What the parent sees: the month's fee, its due date and status, and a button to upload the paid bank voucher."},
  media2b:{img:"automatic-fee-reminder-settings.jpg",label:"Evolvora Campus · Settings",alt:"Automatic fee reminder settings in Evolvora Campus: delivery by in-app notification or email, daily, weekly or monthly, at a set time in Pakistan time (Asia/Karachi)",
    caption:"Fee reminders run on their own: choose the channel, how often, and the time (Pakistan time), and parents with pending fees are reminded automatically."},
  benefits:[
    {c:"ic-green",ic:"fee",h:"See every fee at a glance",p:"Paid, pending and under-review totals plus outstanding amount on the home dashboard."},
    {c:"ic-cyan",ic:"bell",h:"One-tap reminders",p:"Send fee reminders straight to parents instead of chasing them by phone."},
    {c:"ic-blue",ic:"cap",h:"Per-student fee records",p:"Parents view their child's fee status anytime in their own app."},
    {c:"ic-purple",ic:"chart",h:"Clear reporting",p:"Understand your collection position across the whole school in real time."},
  ],
  why:["<strong>No more chasing:</strong> reminders go out in a tap, not a phone call.",
    "<strong>Total clarity:</strong> whole-school fee status visible instantly.",
    "<strong>Transparent for parents:</strong> families see exactly what's due and paid.",
    "<strong>Connected:</strong> fees live alongside attendance, marks and payroll."],
  faqItems:[
    {q:"How does fee management work in Evolvora Campus?",a:"The office sees a live view of fees across the school (paid, pending and under review), plus the total outstanding amount. Parents see their child's fee status in their app, and reminders can be sent in a tap."},
    {q:"Can we send fee reminders to parents?",a:"Yes. Fee reminders go out through the app and on WhatsApp and SMS, so they reach parents on their phones instantly."},
    {q:"Can parents pay fees online?",a:"Yes. Parents can pay school fees online through JazzCash and EasyPaisa, straight from their phones."},
    {q:"Do parents see their own fee status?",a:"Yes. Each parent sees their child's fee records in the parent portal, so it's always clear what has been paid and what's due."},
    {q:"Is fee management separate or part of the platform?",a:"It's built into Evolvora Campus alongside attendance, marks, payroll and communication, so your fee data connects to the rest of the school."},
  ],
  pkLead:"<strong>Fewer trips to the office:</strong> parents pay through JazzCash or EasyPaisa, and unpaid fees trigger reminders on WhatsApp and SMS.",
  related:[["school-management-system","School Management System","layers"],["school-erp","School ERP","shield"],["student-attendance-software","Student Attendance Software","clock"]]
}));

/* ---- attach page-level entities ----
   The generated page node supersedes the older standalone AboutPage /
   ContactPage / FAQPage blocks: those described the page without an @id, so the
   page had no identity in the graph. Their content is folded into the single
   page node (FAQ questions become its mainEntity), leaving exactly one node per
   URL rather than two competing descriptions of the same page. */
const CAMPUS_FILE = path.join("products", "evolvora-campus", "index.html");
for (const p of pages) {
  /* The hand-maintained product page is dated from its own file's <main>. */
  p.date = p.skipWrite
    ? pageDate(CAMPUS_FILE, mainOf(fs.readFileSync(path.join(ROOT, CAMPUS_FILE), "utf8")))
    : pageDate(p.file, norm(p.body));
  if (p.skipWrite) { campusPageLD.dateModified = p.date; continue; }
  p.jsonld = p.jsonld || [];
  const node = pageNode(p);                       // reads FAQ/breadcrumb before filtering
  p.jsonld = p.jsonld.filter(o => !(o && ["FAQPage","AboutPage","ContactPage"].includes(o["@type"])));
  p.jsonld.unshift(node);
  /* Organization and WebSite on every page. Without them, the publisher /
     about / isPartOf references above point at nodes that are not present on
     the page being crawled, and a crawler is not obliged to remember a node it
     saw on a different URL. Deduped, so pages that already declare them are
     left alone. */
  const has = t => p.jsonld.some(o => o && o["@type"] === t);
  if (!has("WebSite")) p.jsonld.push(websiteLD);
  if (!has("Organization")) p.jsonld.push(orgLD);
}

/* ================= WRITE FILES ================= */
let count = 0;
for (const p of pages) {
  if (p.skipWrite) continue; // standalone/cloned page, kept in list for sitemap only
  const out = path.join(ROOT, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, doc(p), "utf8");
  count++;
}

/* 404 */
const notFound = doc({
  active:"", url:"/404", title:"Page not found | Evolvora Technologies",
  desc:"The page you were looking for could not be found.",
  body:`<section class="section" style="text-align:center;padding:120px 0"><div class="container">
    <div class="reveal"><span class="kicker">404</span><h1 style="font-size:44px;margin:16px 0">This page took a day off.</h1>
    <p class="lead" style="margin:0 auto 26px">We couldn't find what you were looking for. Let's get you back on track.</p>
    <a href="/" class="btn btn-primary btn-lg">Back to home</a></div></div></section>`
});
fs.writeFileSync(path.join(ROOT,"404.html"), notFound, "utf8");

/* sitemap.xml */
const urls = pages.map(p=>p.url).concat(["/"]).filter((v,i,a)=>a.indexOf(v)===i);
/* lastmod is the same per-page date as that page's WebPage dateModified.
   changefreq and priority are left out: Google ignores both. */
const dateOf = (u) => (pages.find(p => p.url === u) || {}).date || BUILD_DATE;
/* Image sitemap: the photos and screenshots on each page (not icons or
   logos), read from the written HTML, so Google finds every screenshot and
   knows which page it belongs to. */
const imagesOf = (u) => {
  const f = path.join(ROOT, u.slice(1), "index.html");
  if (!fs.existsSync(f)) return [];
  const html = fs.readFileSync(f, "utf8");
  return [...new Set([...html.matchAll(/<img[^>]+src="(\/assets\/img\/[^"?]+\.(?:jpe?g|png))"/g)].map(m => m[1])
    .filter(src => !/\/stack\/|logo|favicon|evolvora-mark/.test(src)))];
};
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u=>`  <url><loc>${SITE}${u}</loc><lastmod>${dateOf(u)}</lastmod>${imagesOf(u).map(src => `<image:image><image:loc>${SITE}${src}</image:loc></image:image>`).join("")}</url>`).join("\n")}
</urlset>`;
fs.writeFileSync(path.join(ROOT,"sitemap.xml"), sitemap, "utf8");

/* robots.txt */
fs.writeFileSync(path.join(ROOT,"robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, "utf8");

/* netlify.toml */
fs.writeFileSync(path.join(ROOT,"netlify.toml"), `# Evolvora Technologies static site
[build]
  publish = "."

# Hands off to the Evolvora Campus app. 302 (not 301) because the app's host is
# an implementation detail we may move; a permanent redirect would let it get
# cached as the canonical home of /login.
[[redirects]]
  from = "/login"
  to = "${APP_TARGET}"
  status = 302
  force = true

# Pricing moved under the product it prices. Permanent so the old URL's
# search equity follows it.
[[redirects]]
  from = "/pricing"
  to = "${PRICING_PATH}"
  status = 301
  force = true

[[redirects]]
  from = "/pricing/*"
  to = "${PRICING_PATH}"
  status = 301
  force = true

# /about/index.html and / serve the same page. The canonical tag already
# points at the clean URL; the redirect makes it one URL for real.
${urls.map(u => `[[redirects]]
  from = "${u}index.html"
  to = "${u}"
  status = 301
  force = true
`).join("\n")}
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    # Two years, all subdomains, and preload consent - what hstspreload.org
    # requires. Every subdomain must serve HTTPS before this goes live.
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    Referrer-Policy = "strict-origin-when-cross-origin"
    # Everything the site loads is served from this domain (fonts included), so
    # the policy can be strict. 'unsafe-inline' is for styles only: the pages
    # use inline style attributes and inline <style> blocks. The one inline
    # script (theme-init.js, inlined so it does not block render) is allowed by
    # its hash, which build-site.js computes. JSON-LD blocks are data, not
    # scripts, so script-src does not affect them.
    Content-Security-Policy = "default-src 'self'; script-src 'self' ${THEME_INIT_HASH}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Markdown copies of the pages, for AI tools. noindex so Google keeps
# ranking the HTML page, not its text copy.
[[headers]]
  for = "/*.md"
  [headers.values]
    Content-Type = "text/markdown; charset=utf-8"
    X-Robots-Tag = "noindex"

[[headers]]
  for = "/llms-full.txt"
  [headers.values]
    X-Robots-Tag = "noindex"
`, "utf8");

/* ---- sync the product page's SoftwareApplication ----
   products/evolvora-campus/index.html is hand-maintained, so its JSON-LD used
   to be a second, separately edited copy of the same entity - and the two had
   already drifted apart. Only the marked block is rewritten here; the rest of
   that page is left untouched. */
{
  const p = path.join(ROOT, "products", "evolvora-campus", "index.html");
  const START = "<!-- campus-schema:start", END = "<!-- campus-schema:end -->";
  let html = fs.readFileSync(p, "utf8");
  const a = html.indexOf(START), b = html.indexOf(END);
  if (a === -1 || b === -1) {
    console.warn("WARNING: campus-schema markers not found - product page schema NOT synced");
  } else {
    const openEnd = html.indexOf("-->", a) + 3;
    const block = "\n" + [campusPageLD, campusLD, websiteLD, orgLD]
      .map(o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`)
      .join("\n") + "\n";
    const next = html.slice(0, openEnd) + block + html.slice(b);
    if (next !== html) { fs.writeFileSync(p, next, "utf8"); console.log("Synced product page SoftwareApplication"); }
    else console.log("Product page SoftwareApplication already in sync");
  }
}

/* ---- sync the self-hosted font block into the product page ----
   Same marker approach as the schema sync above, so both page families load
   exactly the same fonts. */
{
  const p = path.join(ROOT, "products", "evolvora-campus", "index.html");
  const START = "<!-- fonts:start", END = "<!-- fonts:end -->";
  let html = fs.readFileSync(p, "utf8");
  const a = html.indexOf(START), b = html.indexOf(END);
  if (a === -1 || b === -1) console.warn("WARNING: fonts markers not found - product page fonts NOT synced");
  else {
    const openEnd = html.indexOf("-->", a) + 3;
    const next = html.slice(0, openEnd) + "\n" + FONT_HEAD + "\n" + html.slice(b);
    if (next !== html) { fs.writeFileSync(p, next, "utf8"); console.log("Synced product page fonts"); }
  }
}

/* ---- sync the inline theme script into the product page ----
   The CSP allows exactly one inline script by hash, so the product page must
   carry byte-for-byte the same one. Replaces the old external tag or a stale
   inline copy. */
{
  const p = path.join(ROOT, "products", "evolvora-campus", "index.html");
  const html = fs.readFileSync(p, "utf8");
  const re = /<script src="\/assets\/js\/theme-init\.js"><\/script>|<script>[^<]*evolvora-theme[^<]*<\/script>/;
  if (!re.test(html)) console.warn("WARNING: theme script not found - product page theme-init NOT synced");
  else {
    const next = html.replace(re, () => THEME_INIT);
    if (next !== html) { fs.writeFileSync(p, next, "utf8"); console.log("Synced product page theme-init"); }
  }
}

/* ---- IndexNow ----
   The key file proves to Bing, Yandex and others that we own the domain, so
   they accept "this page changed" pings. Send them after a deploy with
   `node indexnow-submit.js` (reads sitemap.xml). */
const INDEXNOW_KEY = "32a37914266faa793f69c493c4398d76";
fs.writeFileSync(path.join(ROOT, INDEXNOW_KEY + ".txt"), INDEXNOW_KEY, "utf8");

/* ---- llms.txt ----
   A plain Markdown summary for AI tools (llmstxt.org). Google Search ignores
   it; some AI assistants read it. Generated so prices and pages never drift. */
fs.writeFileSync(path.join(ROOT, "llms.txt"), `# Evolvora Technologies

> Evolvora Technologies is a software company in Lahore, Pakistan. It makes Evolvora Campus, a school management system for Pakistani schools, runs SilaaiMarkaz, a tailoring marketplace in Lahore, and builds custom web, mobile and cloud software for clients. Evolvora Campus is not related to evolCampus (Evolmind).

Contact: ${EMAIL} · ${PHONE_DISPLAY} · ${ADDRESS_TEXT}. Founder: ${FOUNDER}.

## Evolvora Campus

- [Evolvora Campus](${CAMPUS_URL}): school management system covering admissions, classes and sections, attendance, exams and marks, fees, teacher payroll and a parent app. Parent alerts on WhatsApp and SMS; fee payments through JazzCash and EasyPaisa.
- [Pricing](${PRICING_URL}): Standard Rs ${PRICE_PKR} (USD ${PRICE}) per active student per month with a free first month; Enterprise Rs ${ENT_PRICE_PKR} (USD ${ENT_PRICE}) per active student per month for multi-campus networks, minimum Rs ${pkr(ENT_MIN)} (USD ${ENT_MIN}) a month.
- [School management system](${SITE}/school-management-system/)
- [Multi-campus school management](${SITE}/campus-management-system/)
- [School ERP](${SITE}/school-erp/)
- [Student attendance software](${SITE}/student-attendance-software/)
- [School fee management software](${SITE}/school-fee-management-software/)

## Company

- [Home](${SITE}/)
- [Software development services](${SITE}/services/)
- [Products](${SITE}/products/)
- [SilaaiMarkaz](${SILAAI_URL})
- [About](${SITE}/about/)
- [Contact](${SITE}/contact/)

## Plain-text versions

- [Full site text](${SITE}/llms-full.txt): every page above in one Markdown file.
- Any single page as Markdown: add \`index.md\` to its address, for example ${SITE}/about/index.md
`, "utf8");

/* ---- Markdown copies for AI tools ----
   Each page's <main> as plain Markdown at <page>/index.md, plus every page in
   one file at /llms-full.txt. AI assistants read these far more reliably than
   HTML full of menus and SVG. Made from the *written* HTML, so the hand-kept
   product page is included. netlify.toml marks .md as noindex so Google does
   not treat them as duplicate pages. */
{
  const TurndownService = require("turndown");
  const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
  td.remove(["script", "style", "svg", "button", "noscript", "form", "iframe"]);
  // Images keep their alt text only; the files add nothing for a text reader.
  td.addRule("imgAlt", { filter: "img", replacement: (_, n) => n.getAttribute("alt") ? `[Image: ${n.getAttribute("alt")}]` : "" });
  td.addRule("picture", { filter: "picture", replacement: (c) => c });
  // Relative links become absolute, so the text still works outside the site.
  td.addRule("absLinks", { filter: (n) => n.nodeName === "A" && n.getAttribute("href"),
    replacement: (c, n) => { const h = n.getAttribute("href"); const t = c.trim();
      if (!t) return ""; if (h.startsWith("#")) return t;
      return `[${t}](${h.startsWith("/") ? SITE + h : h})`; } });

  const full = [];
  for (const u of urls) {
    const file = path.join(ROOT, u.slice(1), "index.html");
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    const title = (/<title>([^<]*)<\/title>/.exec(html) || [])[1] || "";
    const desc = (/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || "";
    const main = (/<main[^>]*>([\s\S]*?)<\/main>/.exec(html) || [])[1];
    if (!main) { console.warn("WARNING: no <main> in " + u + " - Markdown copy skipped"); continue; }
    const body = td.turndown(main).replace(/\n{3,}/g, "\n\n").trim();
    const md = `# ${title.replace(/&amp;/g, "&")}\n\n> ${desc.replace(/&amp;/g, "&")}\n\nSource: ${SITE}${u}\n\n${body}\n`;
    fs.writeFileSync(path.join(path.dirname(file), "index.md"), md, "utf8");
    full.push(md);
  }
  fs.writeFileSync(path.join(ROOT, "llms-full.txt"),
    `# Evolvora Technologies: full site text\n\nEvery page of ${SITE} as Markdown. The short index is ${SITE}/llms.txt.\n\n---\n\n` + full.join("\n---\n\n"), "utf8");
  console.log("Wrote " + full.length + " Markdown copies + llms-full.txt");
}

console.log("Wrote " + count + " pages + 404, sitemap, robots, netlify.toml, llms.txt, IndexNow key");

/* Verify every local asset the *written* pages point at actually exists.
   Checking the output (rather than the templates) means dead template code
   never trips it, and typos or pruned files are caught before deploy. */
(function verifyAssets() {
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if ([".git", "node_modules"].includes(e.name)) continue;
      const p = path.join(d, e.name);
      e.isDirectory() ? walk(p) : (p.endsWith(".html") && files.push(p));
    }
  })(ROOT);

  const missing = new Map();
  for (const f of files) {
    const s = fs.readFileSync(f, "utf8");
    for (const m of s.matchAll(/(?:src|srcset|href)="([^"]+\.(?:png|jpe?g|webp|svg|css|js))(?:\?[^"]*)?"/g)) {
      const u = m[1];
      if (/^https?:|^data:/.test(u)) continue;
      const abs = u.startsWith("/") ? path.join(ROOT, u) : path.resolve(path.dirname(f), u);
      if (!fs.existsSync(abs)) {
        if (!missing.has(u)) missing.set(u, new Set());
        missing.get(u).add(path.relative(ROOT, f).split(path.sep).join("/"));
      }
    }
  }
  if (!missing.size) return console.log("Asset check: all referenced files exist.");
  console.warn("\n  WARNING - " + missing.size + " missing asset(s):");
  for (const [u, pages] of missing) console.warn("    " + u + "  <- " + [...pages].join(", "));
  console.warn("");
  process.exitCode = 1;
})();
console.log(urls.join("\n"));
