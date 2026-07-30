const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SITE = "https://evolvoratech.com";
const APP = "https://schoolsync.pages.dev/login";
const EMAIL = "contact@evolvoratech.com";
const OG = SITE + "/assets/img/og-image.png";

/* ---------- logo mark ---------- */
const MARK = `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="eg" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#6d28d9"/></linearGradient></defs><g fill="url(#eg)"><path d="M52 14 L26 60 L52 106 L70 106 L47 63 L47 57 L70 14 Z"/><path d="M58 14 H102 L86 40 H42 Z"/><path d="M50 47 H94 L80 73 H36 Z"/><path d="M58 80 H102 L86 106 H42 Z"/></g></svg>`;
const FAVICON = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#0a0e1c"/><g transform="translate(4,4) scale(0.93)"><linearGradient id="e" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="0.45" stop-color="#3b82f6"/><stop offset="1" stop-color="#6d28d9"/></linearGradient><g fill="url(#e)"><path d="M52 14 L26 60 L52 106 L70 106 L47 63 L47 57 L70 14 Z"/><path d="M58 14 H102 L86 40 H42 Z"/><path d="M50 47 H94 L80 73 H36 Z"/><path d="M58 80 H102 L86 106 H42 Z"/></g></g></svg>`);

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
};
const svg = (name) => `<svg viewBox="0 0 24 24">${I[name]}</svg>`;

const NAV_MOBILE_CRITICAL = `<style>@media(max-width:1000px){.nav-links:not(.open){display:none!important}.nav-links.open{display:flex!important;position:fixed;top:var(--nav-h);left:0;right:0;bottom:0;z-index:99;flex-direction:column;background:var(--nav-mobile-bg);overflow-y:auto}.nav-toggle{display:grid!important}.nav-toggle .icon-menu{display:block!important}.nav-toggle:not(.open) .icon-close{display:none!important}.nav-toggle.open .icon-menu{display:none!important}.nav-toggle.open .icon-close{display:block!important}}</style>`;

const NAV_TOGGLE = `<button class="nav-toggle" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false"><svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;

const THEME_TOGGLE = `<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to light mode"><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg></button>`;

/* ---------- browser mockup ---------- */
const shot = (img, label, alt, eager) =>
  `<div class="browser"><div class="browser-bar"><span></span><span></span><span></span><i>${label}</i></div><img src="/assets/img/${img}" alt="${alt || label || "Evolvora software screenshot"}"${eager?' loading="eager"':' loading="lazy"'} width="1400" height="720" draggable="false"></div>`;

const WHY_PILLARS = [
  {
    phase: "01",
    image: "product.jpg",
    label: "Product discovery",
    title: "Product mindset",
    alt: "Product discovery workshop: defining user goals and product outcomes",
    desc: "We think about your users and outcomes, not just tickets, because we run our own products too.",
    points: ["User-first discovery and clear scope", "Outcomes and metrics, not ticket counts", "We ship and operate our own software"]
  },
  {
    phase: "02",
    image: "code.jpg",
    label: "Engineering craft",
    title: "Senior craftsmanship",
    alt: "Software engineer reviewing clean, maintainable code on a laptop",
    desc: "Clean, maintainable code and thoughtful design: software built to last, not just to demo.",
    points: ["Clean architecture and readable code", "Design systems that scale with you", "Built to maintain, not just to launch"]
  },
  {
    phase: "03",
    image: "demos.jpg",
    label: "Project visibility",
    title: "Transparent & reliable",
    alt: "Team presenting a weekly product demo with clear project progress",
    desc: "Clear scope, regular demos and honest timelines. You always know where things stand.",
    points: ["Weekly demos and honest progress updates", "Clear scope, milestones and timelines", "No surprises: you always know what's next"]
  },
  {
    phase: "04",
    image: "partner.jpg",
    label: "Long-term support",
    title: "Long-term partner",
    alt: "Long-term partnership: collaborating on software support and growth after launch",
    desc: "We stay after launch, maintaining, improving and scaling your software as you grow.",
    points: ["Post-launch maintenance and support", "Iterative improvements as you grow", "A team that stays with you long after go-live"]
  }
];

function whyVisualPhoto(pillar) {
  return `<figure class="why-visual-float-item"><img src="/assets/img/${pillar.image}" alt="${pillar.alt || pillar.title}" loading="lazy" width="1200" height="1500" draggable="false"></figure>`;
}

function whyStoryVisualStack() {
  const slides = WHY_PILLARS.map((p) => `
    <figure class="why-visual-photo-slide">
      <img src="/assets/img/${p.image}" alt="${p.alt || p.title}" loading="lazy" width="1200" height="1500" draggable="false">
    </figure>`).join("");

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
function head({ title, desc, url, jsonld }) {
  const canonical = SITE + url;
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#070b16">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Evolvora Technologies">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${OG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${OG}">
<link rel="icon" href="${FAVICON}">
<link rel="apple-touch-icon" href="/assets/img/evolvora-mark.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="/assets/js/theme-init.js"></script>
${NAV_MOBILE_CRITICAL}
<link rel="stylesheet" href="/assets/css/styles.css?v=37">
${(jsonld ? (Array.isArray(jsonld) ? jsonld : [jsonld]) : []).map(o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join("\n")}`;
}

/* ---------- header ---------- */
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
        <div><h5>Our products</h5>
          <a href="/products/evolvora-campus/"><span class="di">${svg("cap")}</span><span><strong>Evolvora Campus</strong><span>All-in-one school management system</span></span></a>
          <a href="/products/"><span class="di">${svg("rocket")}</span><span><strong>All products</strong><span>See what's live &amp; coming next</span></span></a>
        </div>
        <div><h5>Campus solutions</h5>
          <a href="/school-management-system/"><span class="di">${svg("layers")}</span><span><strong>School Management System</strong></span></a>
          <a href="/student-attendance-software/"><span class="di">${svg("clock")}</span><span><strong>Attendance Software</strong></span></a>
          <a href="/school-fee-management-software/"><span class="di">${svg("fee")}</span><span><strong>Fee Management</strong></span></a>
          <a href="/school-erp/"><span class="di">${svg("shield")}</span><span><strong>School ERP</strong></span></a>
        </div>
      </div>
    </div>
    <a href="/about/"${on("about")}>About</a>
    <a href="/contact/"${on("contact")}>Contact</a>
    <a href="/contact/" class="btn btn-primary btn-sm">Start a project</a>
  </nav>`;
}

/* ---------- footer ---------- */
function footer() {
  return `<footer class="footer"><div class="container">
  <div class="footer-top">
    <div class="footer-brand">
      <a href="/" class="brand">${MARK}<span class="wm">EVOL<b>VORA</b></span></a>
      <p>Evolvora Technologies, the team behind Evolvora, builds modern software for schools and campuses. Our flagship, Evolvora Campus, brings admissions, attendance, fees, payroll and parent communication into one place.</p>
      <span class="footer-tagline">Innovation never stops</span>
    </div>
    <div><h5>Company</h5><ul>
      <li><a href="/">Home</a></li>
      <li><a href="/services/">Services</a></li>
      <li><a href="/products/">Products</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul></div>
    <div><h5>Product</h5><ul>
      <li><a href="/products/evolvora-campus/">Evolvora Campus</a></li>
      <li><a href="/products/evolvora-campus/#features">Features</a></li>
      <li><a href="/pricing/">Plans &amp; pricing</a></li>
      <li><a href="/contact/">Start a project</a></li>
    </ul></div>
    <div><h5>Solutions</h5><ul>
      <li><a href="/school-management-system/">School Management System</a></li>
      <li><a href="/campus-management-system/">Campus Management System</a></li>
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
<script src="/assets/js/main.js?v=5"></script>
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
    ["campus-management-system","Campus Management System","One connected platform for multi-section campuses and their staff.","globe"],
    ["school-erp","School ERP","Students, staff, payroll and finance unified in a single school ERP.","shield"],
    ["student-attendance-software","Student Attendance Software","Mark and track daily attendance in seconds, with instant parent alerts.","clock"],
    ["school-fee-management-software","Fee Management Software","Track dues, collect fees and reconcile payments without the paperwork.","fee"],
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
  const jsonld = { "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":trail.map((t,i)=>({"@type":"ListItem","position":i+1,"name":t[0],"item":SITE+t[1]})) };
  return { html, jsonld };
}

const orgLD = { "@context":"https://schema.org","@type":"Organization","name":"Evolvora Technologies","alternateName":"Evolvora","url":SITE,"logo":SITE+"/assets/img/evolvora-logo.png","email":EMAIL,"slogan":"Innovation never stops","description":"Evolvora is a software house that designs and builds custom web, mobile and cloud software. Its flagship product is Evolvora Campus, an all-in-one school management system.","knowsAbout":["Custom software development","Web application development","Mobile app development","SaaS product development","UI/UX design","Cloud & DevOps"],"sameAs":[]};

/* =================================================================
   PAGES
   ================================================================= */
const pages = [];

/* ---- HOME (software house) ---- */
pages.push({
  file:"index.html", active:"home", url:"/",
  title:"Evolvora Technologies | Software Development Company",
  desc:"Evolvora is a software development company that designs and builds custom web, mobile and cloud software. Explore Evolvora services, products and Evolvora Campus.",
  jsonld:[orgLD,{ "@context":"https://schema.org","@type":"WebSite","name":"Evolvora Technologies","url":SITE }],
  body:`
<section class="hero hero--visual">
  <div class="hero-bg" aria-hidden="true">
    <video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="/assets/video/video-poster.jpg">
      <source src="/assets/video/video-mobile.mp4" type="video/mp4">
    </video>
    <div class="hero-gradient"></div>
    <div class="hero-orb hero-orb--1"></div>
    <div class="hero-orb hero-orb--2"></div>
    <div class="hero-orb hero-orb--3"></div>
  </div>
  <div class="container hero-inner">
    <div class="hero-copy reveal">
      <span class="eyebrow"><span class="dot"></span> Software house · Innovation never stops</span>
      <h1 class="hero-title">
        <span class="hero-title-brand">Evolvora Technologies</span>
        <span class="hero-title-tagline">Software Development Company</span>
      </h1>
      <p class="lead">Evolvora is a software house. We design, build and ship reliable <strong>web, mobile and cloud</strong> software, turning your ideas into products people love to use. And we build products of our own, like <strong>Evolvora Campus</strong>.</p>
      <div class="hero-cta">
        <a href="/contact/" class="btn btn-primary btn-lg">Start a project</a>
        <a href="/products/" class="btn btn-ghost btn-lg">See our work</a>
      </div>
      <div class="hero-trust">
        <div><strong>End-to-end</strong><span>design · build · launch</span></div>
        <div><strong>Web · Mobile</strong><span>· Cloud &amp; SaaS</span></div>
        <div><strong>Our own products</strong><span>not just client work</span></div>
      </div>
    </div>
  </div>
</section>

<section class="strip"><div class="container"><p>What makes us different: <strong>assign us the work, take that long vacation, and we handle it all.</strong></p></div></section>

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

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">Our products</span><h2>We don't just build for others</h2><p>We build and run our own software, starting with Evolvora Campus, our flagship product.</p></div>
  <div class="feature-row reveal">
    <div class="feature-media tilt-3d" data-tilt-3d tabindex="0" role="img" aria-label="Evolvora Campus dashboard preview: press or drag for 3D view">${shot("stack/new.jpeg","Evolvora Campus","Evolvora Campus preview, a product by Evolvora")}</div>
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
</div></section>

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

${ctaBlock("Have a project in mind?","Tell us what you want to build. We'll help you scope it, design it and ship it, and support it long after launch.")}`
});

/* ---- PRODUCTS INDEX ---- */
{
  const cb = crumb([["Home","/"],["Products","/products/"]]);
  pages.push({
    file:"products/index.html", active:"products", url:"/products/",
    title:"Products | Evolvora | Software We've Built",
    desc:"Products built by Evolvora, the software house. Explore Evolvora Campus (our all-in-one school management system), plus new products on the way.",
    jsonld:[cb.jsonld],
    body:`
<section class="section" style="padding-top:52px"><div class="container">
  ${cb.html}
  <div class="section-head reveal" style="margin-bottom:44px"><span class="kicker">Our products</span><h2>Software we've built &amp; run ourselves</h2><p>Evolvora isn't only a services company; we design and operate our own products. Here's what we've shipped, and what's coming next.</p></div>
</div>
<div class="coverflow" data-coverflow data-set-count="3" aria-label="Our products">
  <div class="coverflow-track">
    <article class="coverflow-card card flagship"><span class="badge-live">Live</span><span class="card-ic">${svg("cap")}</span><h3>Evolvora Campus</h3><p>The complete school management system: admissions, attendance, marks, fee collection, teacher payroll and instant parent communication, in one place.</p><a href="/products/evolvora-campus/" class="card-link">Explore Evolvora Campus ${svg("arrow")}</a></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("book")}</span><h3>Evolvora Learn</h3><p>Assignments, learning resources and online classes: a learning platform that plugs straight into Evolvora Campus.</p></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("chart")}</span><h3>Evolvora Insights</h3><p>School analytics and reporting that turn attendance, results and fee data into decisions you can act on.</p></article>
  </div>
</div></section>
${ctaBlock("Want to be first to know?","Tell us what your school needs and we'll show you what's live today, and what's coming next.")}`
  });
}

/* ---- EVOLVORA CAMPUS (product) ---- */
{
  const cb = crumb([["Home","/"],["Products","/products/"],["Evolvora Campus","/products/evolvora-campus/"]]);
  const appLD = { "@context":"https://schema.org","@type":"SoftwareApplication","name":"Evolvora Campus","applicationCategory":"BusinessApplication","operatingSystem":"Web, iOS, Android","description":"Evolvora Campus is an all-in-one school management system for attendance, marks, fee collection, teacher payroll and parent communication.","url":SITE+"/products/evolvora-campus/","publisher":{"@type":"Organization","name":"Evolvora Technologies"},"offers":{"@type":"Offer","url":SITE+"/pricing/","priceCurrency":"USD","price":"0","description":"Book a demo for tailored pricing"} };
  const feat = (media,tag,tagc,h,items) => `<div class="feature-row${media.rev?' reverse':''} reveal"><div class="feature-media">${shot(media.img,media.label,media.alt)}</div><div class="feature-text"><span class="tag ${tagc}">${tag}</span><h3>${h}</h3><ul class="ticks">${items.map(i=>`<li>${i}</li>`).join("")}</ul></div></div>`;
  pages.push({
    file:"products/evolvora-campus/index.html", active:"products", url:"/products/evolvora-campus/", skipWrite:true, // standalone clone of the original SchoolSync landing (rebranded); do not regenerate
    title:"Evolvora Campus: All-in-One School Management System",
    desc:"Evolvora Campus is an all-in-one school management system: take attendance, enter marks, collect fees, calculate teacher salaries and notify parents, from one simple platform.",
    jsonld:[appLD, cb.jsonld],
    body:`
<section class="hero" style="padding-top:46px"><div class="hero-glow"></div><div class="container">
  ${cb.html}
  <div class="hero-inner" style="margin-top:6px">
  <div class="hero-copy reveal">
    <span class="eyebrow"><span class="dot"></span> Evolvora Campus</span>
    <h1>The all-in-one<br><span class="grad-text">school management system.</span></h1>
    <p class="lead">Run your entire school from one simple screen. Evolvora Campus connects your office, teachers and parents so fees get collected on time, salaries calculate themselves, teachers reach class on schedule, and parents always stay in the loop.</p>
    <div class="hero-cta"><a href="/contact/" class="btn btn-primary btn-lg">Book a free demo</a><a href="#features" class="btn btn-ghost btn-lg">See features</a></div>
  </div>
  <div class="hero-shot reveal">${shot("dashboard.png","app.evolvoratech.com","Evolvora Campus admin dashboard",true)}</div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><span class="kicker">Why schools switch</span><h2>Less paperwork. More teaching.</h2><p>The four things that eat up your week, made effortless.</p></div>
  ${PILLARS}
</div></section>

<section class="section section-alt" id="features"><div class="container">
  <div class="section-head reveal"><span class="kicker">A closer look</span><h2>Built for the way schools actually work</h2><p>Real screens from Evolvora Campus, simple enough for anyone in the office to use on day one.</p></div>
  ${feat({img:"dashboard.png",label:"Dashboard · Fees",alt:"Fee submission status on the Evolvora Campus dashboard"},"Fees","tag-green","Know your fee position at a glance",["Live totals for <strong>paid, pending and under-review</strong> fees","Outstanding amount for the whole school on the home screen","One-tap fee reminders sent straight to parents"])}
  ${feat({img:"staff.png",label:"Staff · Payroll",alt:"Staff directory with salaries in Evolvora Campus",rev:true},"Staff &amp; Payroll","tag-amber","Every teacher, subject and salary in one place",["Store <strong>basic pay, allowances and tax status</strong> per teacher","Monthly salary is <strong>calculated automatically</strong>","See experience, assigned classes and status together"])}
  ${feat({img:"attendance.png",label:"Teacher · Attendance",alt:"Taking class attendance in Evolvora Campus"},"Attendance","tag-blue","A whole class marked in seconds",["Tap <strong>Present, Late or Absent</strong>, clearly colour-coded","\"Swipe present\", then flag only the exceptions","Live totals and a 14-day trend keep classes on schedule"])}
  ${feat({img:"parent-notifications.png",label:"Parent · Updates",alt:"Parent notifications in Evolvora Campus",rev:true},"Communication","tag-cyan","Reach the right parents, instantly",["Send to a <strong>class, section, group or the whole school</strong>","Sorted for parents: Daily Diary, Fees, Marks, Attendance","<strong>Read receipts</strong> show exactly who has seen it"])}
  ${feat({img:"parent-child.png",label:"Parent · My Child",alt:"Parent portal in Evolvora Campus"},"Parent portal","tag-cyan","Parents follow every child's progress",["Attendance, marks, fees and teachers: one tidy profile","Families with siblings see all their children in one login","Everything up to date, anytime, from any phone"])}
  ${feat({img:"bulk-import.png",label:"Admin · Bulk import",alt:"Bulk import students from Excel in Evolvora Campus",rev:true},"Onboarding","tag-purple","Add a whole class in minutes",["Import students straight from a simple <strong>Excel file</strong>","<strong>Parent logins created automatically</strong>, with siblings linked","Download a ready-made template so the format is always right"])}
</div></section>

<section class="section" id="roles"><div class="container">
  <div class="section-head reveal"><span class="kicker">One platform, three views</span><h2>Everyone gets exactly what they need</h2><p>The same up-to-date information, tailored to each person, with no training required.</p></div>
  <div class="role-grid">
    <article class="role-card reveal" style="--rc:#8b5cf6"><span class="role-ic">${svg("gear")}</span><h3>Admin</h3><p class="role-sub">The school office</p><ul class="ticks sm"><li>Set up classes, sections &amp; staff</li><li>Add students one-by-one or in bulk</li><li>Track fees &amp; teacher salaries</li><li>Message anyone in the school</li></ul></article>
    <article class="role-card reveal" style="--rc:#3b82f6"><span class="role-ic">${svg("teacher")}</span><h3>Teacher</h3><p class="role-sub">In the classroom</p><ul class="ticks sm"><li>Take attendance in seconds</li><li>Enter marks with auto percentages</li><li>See students &amp; class performance</li><li>Send notes to parents</li></ul></article>
    <article class="role-card reveal" style="--rc:#22d3ee"><span class="role-ic">${svg("heart")}</span><h3>Parent</h3><p class="role-sub">At home</p><ul class="ticks sm"><li>Follow each child's progress</li><li>See attendance, marks &amp; fees</li><li>Know who teaches their child</li><li>Get instant school updates</li></ul></article>
  </div>
</div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">How it works</span><h2>Set up once, and everything flows from there</h2><p>Enter information a single time and it reaches everyone who needs it, automatically.</p></div>
  <div class="steps">
    <div class="step reveal"><span class="step-num">1</span><h3>Admin sets up the school</h3><p>Add classes, sections, staff and students once. Parent accounts are created for you.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">2</span><h3>Teachers record daily</h3><p>Attendance and marks are entered from the classroom in a few taps.</p></div>
    <div class="step-arrow">→</div>
    <div class="step reveal"><span class="step-num">3</span><h3>Parents stay informed</h3><p>Progress, fees and announcements appear instantly on the parent's phone.</p></div>
  </div>
</div></section>

${ctaBlock("Ready to make your school run itself?","Let us show you Evolvora Campus with your own classes and fee structure: a quick, no-pressure walkthrough.")}`
  });
}

/* ---- PRICING ---- */
{
  const cb = crumb([["Home","/"],["Pricing","/pricing/"]]);
  const faq = faqBlock([
    {q:"How is Evolvora Campus priced?",a:"Pricing is based on your number of active students and the plan you choose. Book a quick demo and we'll prepare a tailored quote for your school. There are no setup fees to get started."},
    {q:"Is there a long-term contract?",a:"No. Evolvora Campus is billed on a simple subscription you can adjust as your school grows. You're never locked into a multi-year contract."},
    {q:"Do you help us move our existing data?",a:"Yes. Our team helps you import students, classes and staff, including bulk import from an Excel file, so you're up and running quickly."},
    {q:"Can parents and teachers use it for free?",a:"Yes. Teacher and parent access is included in every plan at no extra per-user cost. You're billed at the school level, not per parent."},
  ]);
  pages.push({
    file:"pricing/index.html", active:"pricing", url:"/pricing/",
    title:"Pricing | Evolvora Campus School Management System",
    desc:"Simple, school-friendly pricing for Evolvora Campus. Plans scale with your student numbers, with teacher and parent access included. Book a demo for a tailored quote.",
    jsonld:[cb.jsonld, faq.jsonld],
    body:`
<section class="section" style="padding-top:52px"><div class="container">
  ${cb.html}
  <div class="section-head reveal"><span class="kicker">Pricing</span><h2>Simple pricing that grows with your school</h2><p>Every plan includes unlimited teacher and parent access. You're billed at the school level, never per parent. Figures below are indicative; book a demo for a tailored quote.</p></div>
  <div class="price-grid">
    <div class="price reveal"><h3>Starter</h3><p class="p-sub">For small schools getting organised.</p><div class="p-amt">$0.6<small>/student / mo</small></div><p class="p-note">Billed monthly · up to 300 students</p><ul class="ticks sm"><li>Students, classes &amp; sections</li><li>Attendance &amp; marks</li><li>Fee tracking &amp; reminders</li><li>Parent app &amp; notifications</li></ul><a href="/contact/" class="btn btn-ghost">Get started</a></div>
    <div class="price pop reveal"><span class="pop-tag">Most popular</span><h3>Growth</h3><p class="p-sub">For growing schools that want it all.</p><div class="p-amt">$1.0<small>/student / mo</small></div><p class="p-note">Billed monthly · up to 1,500 students</p><ul class="ticks sm"><li>Everything in Starter</li><li>Teacher payroll &amp; salary calculation</li><li>Bulk import &amp; auto parent accounts</li><li>Groups, read receipts &amp; web push</li><li>Priority support</li></ul><a href="/contact/" class="btn btn-primary">Book a demo</a></div>
    <div class="price reveal"><h3>Enterprise</h3><p class="p-sub">For large or multi-campus institutions.</p><div class="p-amt">Custom</div><p class="p-note">Tailored to your size &amp; needs</p><ul class="ticks sm"><li>Everything in Growth</li><li>Multiple campuses</li><li>Custom onboarding &amp; data migration</li><li>Dedicated account manager</li><li>SLAs &amp; custom integrations</li></ul><a href="/contact/" class="btn btn-ghost">Contact sales</a></div>
  </div>
</div></section>
<section class="section section-alt"><div class="container"><div class="section-head reveal"><span class="kicker">Questions</span><h2>Pricing FAQ</h2></div>${faq.html}</div></section>
${ctaBlock("Not sure which plan fits?","Tell us about your school and we'll recommend the right plan and prepare a clear, tailored quote.")}`
  });
}

/* ---- CONTACT ---- */
{
  const cb = crumb([["Home","/"],["Contact","/contact/"]]);
  const ld = { "@context":"https://schema.org","@type":"ContactPage","name":"Contact Evolvora Technologies","url":SITE+"/contact/" };
  pages.push({
    file:"contact/index.html", active:"contact", url:"/contact/",
    title:"Contact Evolvora Technologies: Book a Demo",
    desc:"Get in touch with Evolvora Technologies to book a free demo of Evolvora Campus, ask about pricing, or discuss moving your school onto one connected platform.",
    jsonld:[cb.jsonld, ld],
    body:`
<section class="section" style="padding-top:52px"><div class="container">
  ${cb.html}
  <div class="section-head reveal" style="margin-bottom:40px"><span class="kicker">Contact</span><h2>Let's get your school set up</h2><p>Book a free demo, ask about pricing, or tell us what you need. We usually reply within one business day.</p></div>
  <div class="contact-wrap">
    <form class="reveal" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact/?sent=1">
      <input type="hidden" name="form-name" value="contact">
      <p style="display:none"><label>Don't fill this out: <input name="bot-field"></label></p>
      <div class="field"><label for="name">Your name</label><input id="name" name="name" type="text" required placeholder="e.g. Ayesha Khan"></div>
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required placeholder="you@school.edu"></div>
      <div class="field"><label for="school">School / organisation</label><input id="school" name="school" type="text" placeholder="e.g. The Educators"></div>
      <div class="field"><label for="students">Approx. number of students</label><input id="students" name="students" type="text" placeholder="e.g. 400"></div>
      <div class="field"><label for="message">How can we help?</label><textarea id="message" name="message" required placeholder="Tell us a little about your school and what you're looking for…"></textarea></div>
      <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Send message</button>
      <p style="color:var(--faint);font-size:12.5px;margin-top:12px;text-align:center">Prefer email? Write to <a href="mailto:${EMAIL}" style="color:var(--sky)">${EMAIL}</a></p>
    </form>
    <div class="contact-info reveal">
      <h3>Talk to us</h3>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.mail}</svg></span><div><b>Email</b><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
      <div class="info-row"><span class="ii"><svg viewBox="0 0 24 24">${I.globe}</svg></span><div><b>Already a customer?</b><a href="${APP}" rel="noopener">Log in at schoolsync.pages.dev</a></div></div>
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
    title:"Software Development Services | Evolvora Software House",
    desc:"Evolvora's software services: custom software, web & mobile app development, SaaS product engineering, UI/UX design and cloud & DevOps, from idea to launch and beyond.",
    jsonld:[cb.jsonld, { "@context":"https://schema.org","@type":"Service","serviceType":"Software development","provider":{"@type":"Organization","name":"Evolvora Technologies"},"areaServed":"Worldwide","description":"Custom software, web and mobile app development, SaaS product engineering, UI/UX design and cloud & DevOps." }],
    body:`
<section class="section" style="padding-top:52px;padding-bottom:20px"><div class="container">
  ${cb.html}
  <div class="section-head reveal"><span class="kicker">Services</span><h2>Everything you need to build great software</h2><p>Whether you're starting from a blank page or scaling an existing product, we cover the whole journey: strategy, design, engineering and operations.</p></div>
</div></section>

<section class="section services-coverflow-section" style="padding-top:20px;padding-bottom:56px">
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
    title:"About Evolvora: A Software House Built on Craft",
    desc:"Evolvora is a software house that designs, builds and runs modern web, mobile and cloud software. Learn about our mission, values and products like Evolvora Campus.",
    jsonld:[cb.jsonld, { "@context":"https://schema.org","@type":"AboutPage","name":"About Evolvora Technologies","url":SITE+"/about/" }],
    body:`
<section class="about-hero">
  <div class="about-hero-bg">
    <img class="about-hero-image" src="/assets/img/partner.jpg" alt="Evolvora team collaborating as a long-term software partner" width="1920" height="1080" loading="eager" decoding="async">
    <div class="about-hero-overlay" aria-hidden="true"></div>
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
      <p>What sets us apart is that we build and run our own products too. Our flagship, <strong>Evolvora Campus</strong>, is a full school management system used to run real schools, so we know first-hand what it takes to design, launch and support software that people depend on every single day.</p>
      <p>That product mindset shapes everything we do for clients: clean architecture, thoughtful design, honest timelines, and a commitment to stick around long after launch.</p>
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
<div class="coverflow" data-coverflow data-set-count="3" aria-label="Our products">
  <div class="coverflow-track">
    <article class="coverflow-card card flagship"><span class="badge-live">Live</span><span class="card-ic">${svg("cap")}</span><h3>Evolvora Campus</h3><p>All-in-one school management system for fees, attendance, payroll and parent communication.</p><a href="/products/evolvora-campus/" class="card-link">Explore ${svg("arrow")}</a></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("book")}</span><h3>Evolvora Learn</h3><p>A learning platform for assignments, resources and online classes.</p></article>
    <article class="coverflow-card card soon"><span class="badge-soon">Coming soon</span><span class="card-ic">${svg("chart")}</span><h3>Evolvora Insights</h3><p>Analytics that turn everyday data into clear decisions.</p></article>
  </div>
</div></section>

${ctaBlock("Want to work with us?","Whether it's a new product or an existing one to grow, we'd love to hear what you're building.")}`
  });
}

/* ---- KEYWORD / SOLUTION PAGES ---- */
function solutionPage({file,url,kw,title,desc,h1,intro,whatH,whatP,media,benefits,why,faqItems,related}) {
  const cb = crumb([["Home","/"],["Solutions",related.length?"/products/":"/products/"],[kw,url]]);
  const faq = faqBlock(faqItems);
  const relCards = related.map(([s,t,ic])=>`<a class="card reveal" href="/${s}/"><span class="card-ic">${svg(ic)}</span><h3>${t}</h3><span class="card-link">Learn more ${svg("arrow")}</span></a>`).join("");
  return {
    file, active:"products", url, title, desc,
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
    <div class="hero-shot reveal">${shot(media.img,media.label,media.alt,true)}</div>
  </div>
</div></section>

<section class="section" style="padding-top:20px"><div class="container"><div class="prose reveal">
  <h2>${whatH}</h2>
  ${whatP.map(p=>`<p>${p}</p>`).join("")}
</div></div></section>

<section class="section section-alt"><div class="container">
  <div class="section-head reveal"><span class="kicker">Capabilities</span><h2>What you get with Evolvora Campus</h2></div>
  <div class="benefit-grid">${benefits.map(b=>`<article class="benefit reveal"><span class="benefit-ic ${b.c}">${svg(b.ic)}</span><h3>${b.h}</h3><p>${b.p}</p></article>`).join("")}</div>
</div></section>

<section class="section"><div class="container"><div class="prose reveal">
  <h2>Why schools pick Evolvora Campus</h2>
  <ul>${why.map(w=>`<li>${w}</li>`).join("")}</ul>
  <p style="margin-top:24px"><a href="/contact/" class="btn btn-primary">Book a demo ${svg("arrow")}</a></p>
</div></div></section>

<section class="section section-alt"><div class="container"><div class="section-head reveal"><span class="kicker">FAQ</span><h2>${kw}: common questions</h2></div>${faq.html}</div></section>

<section class="section"><div class="container"><div class="section-head reveal"><span class="kicker">Related</span><h2>Explore related solutions</h2></div><div class="cards">${relCards}</div></div></section>

${ctaBlock(`See Evolvora Campus, your ${kw.toLowerCase()}`,"Book a free walkthrough with your own school data and see how much time Evolvora Campus saves your team.")}`
  };
}

pages.push(solutionPage({
  file:"school-management-system/index.html", url:"/school-management-system/", kw:"School Management System",
  title:"School Management System | Evolvora Campus",
  desc:"Evolvora Campus is a complete school management system for attendance, marks, fee collection, teacher payroll and parent communication, all in one easy platform.",
  h1:"A school management system that <span class=\"grad-text\">does it all</span>",
  intro:"Evolvora Campus is a modern <strong>school management system</strong> that brings admissions, attendance, marks, fee collection, teacher payroll and parent communication into one simple platform so your whole school runs from a single screen.",
  whatH:"What is a school management system?",
  whatP:["A <strong>school management system</strong> is software that replaces the scattered registers, spreadsheets and message groups a school uses day to day. Instead of tracking attendance in one place, fees in another and results somewhere else, everything lives in one connected system that admins, teachers and parents can all access.",
    "Evolvora Campus was built for real schools. Set it up once (your classes, sections, staff and students) and information flows automatically. Teachers record attendance and marks from the classroom, the office tracks fees and salaries, and parents are notified instantly on their phones."],
  media:{img:"dashboard.png",label:"Evolvora Campus",alt:"School management system dashboard in Evolvora Campus"},
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
  file:"campus-management-system/index.html", url:"/campus-management-system/", kw:"Campus Management System",
  title:"Campus Management System | Evolvora Campus",
  desc:"Evolvora Campus is a campus management system that unifies students, staff, attendance, fees and communication for schools and multi-section campuses on one platform.",
  h1:"A campus management system<br><span class=\"grad-text\">that keeps everyone in sync</span>",
  intro:"Evolvora Campus is a complete <strong>campus management system</strong> that connects every part of your campus (students, teachers, sections, fees and parent communication) in one place, so nothing slips through the cracks.",
  whatH:"What is a campus management system?",
  whatP:["A <strong>campus management system</strong> is a single platform for running the academic and administrative life of a campus: enrolment, classes and sections, daily attendance, assessments, fee collection, staff and payroll, and communication with parents.",
    "Evolvora Campus gives admins, teachers and parents their own tailored view of the same live information. Set up your campus structure once and everything, from a teacher marking attendance to a parent checking fees, stays perfectly in sync."],
  media:{img:"teacher-dashboard.png",label:"Evolvora Campus",alt:"Campus management system dashboard in Evolvora Campus"},
  benefits:[
    {c:"ic-purple",ic:"layers",h:"Classes &amp; sections",p:"Define your whole campus structure, from Early Years to Secondary, and everything else follows."},
    {c:"ic-blue",ic:"users",h:"Staff directory",p:"Every teacher, their subjects, assigned classes and salary in one organised directory."},
    {c:"ic-cyan",ic:"bell",h:"Campus-wide messaging",p:"Reach a class, a section, a saved group or the entire campus in one message, with read receipts."},
    {c:"ic-green",ic:"chart",h:"One live picture",p:"Attendance trends, fee status and performance, all visible from a single dashboard."},
  ],
  why:["<strong>Built for scale:</strong> handles multiple sections and large student numbers with ease.",
    "<strong>Everyone connected:</strong> admins, teachers and parents share one live source of truth.",
    "<strong>Instant communication:</strong> announcements and alerts reach the right people immediately.",
    "<strong>Simple to run:</strong> clean, modern interface that staff pick up on day one."],
  faqItems:[
    {q:"What's the difference between a campus and school management system?",a:"They solve the same problem: running an institution from one platform. \"Campus\" often implies larger or multi-section institutions. Evolvora Campus works for both, scaling from a single school to a multi-section campus."},
    {q:"Can it handle multiple sections and large student numbers?",a:"Yes. Evolvora Campus is designed around classes and sections and scales comfortably to large campuses, with an Enterprise plan for multi-campus institutions."},
    {q:"Does it include parent communication?",a:"Yes. Built-in notifications deliver marks, attendance, fee reminders and announcements to parents instantly, with read tracking so you know who has seen each message."},
    {q:"Is training required for staff?",a:"No. The interface is intentionally simple, and we help with onboarding and data import so your team is productive right away."},
  ],
  related:[["school-management-system","School Management System","layers"],["school-erp","School ERP","shield"],["student-attendance-software","Student Attendance Software","clock"]]
}));

pages.push(solutionPage({
  file:"school-erp/index.html", url:"/school-erp/", kw:"School ERP",
  title:"School ERP Software | Evolvora Campus",
  desc:"Evolvora Campus is school ERP software that unifies students, staff, attendance, fees, teacher payroll and communication: one connected system for your whole institution.",
  h1:"School ERP software<br><span class=\"grad-text\">without the complexity</span>",
  intro:"Evolvora Campus is modern <strong>school ERP software</strong> that unifies academics, administration and finance (students, staff, attendance, fees and payroll) in one connected system that's actually easy to use.",
  whatH:"What is school ERP software?",
  whatP:["<strong>School ERP</strong> (Enterprise Resource Planning) software connects every operational part of a school into one system: student information, staff and HR, attendance, examinations, fee collection and finance, and communication. Instead of separate tools that don't talk to each other, an ERP keeps one accurate record shared across the institution.",
    "Traditional school ERPs are powerful but painful to use. Evolvora Campus delivers the same connected control (including automatic teacher salary calculation and a full fee ledger) in a clean, modern interface your staff will actually enjoy using."],
  media:{img:"staff.png",label:"Evolvora Campus",alt:"School ERP staff and payroll module in Evolvora Campus"},
  benefits:[
    {c:"ic-blue",ic:"cap",h:"Student information",p:"A complete, searchable record for every student, class and section."},
    {c:"ic-amber",ic:"salary",h:"HR &amp; payroll",p:"Staff records with basic pay, allowances and tax status, and salaries are calculated automatically."},
    {c:"ic-green",ic:"fee",h:"Finance &amp; fees",p:"Track dues, collect fees and see your whole-school fee position in real time."},
    {c:"ic-purple",ic:"shield",h:"One secure system",p:"Role-based access for admins, teachers and parents. Everyone sees exactly what they should."},
  ],
  why:["<strong>Truly integrated:</strong> academics, HR, finance and communication share one database.",
    "<strong>Modern &amp; usable:</strong> none of the clutter of legacy ERP software.",
    "<strong>Automated payroll:</strong> teacher salaries computed from stored pay and tax settings.",
    "<strong>Grows with you:</strong> from a single school to multiple campuses."],
  faqItems:[
    {q:"What is a school ERP?",a:"A school ERP is software that integrates the core functions of running a school (student records, staff and payroll, attendance, fees and finance, and communication) into one connected system, replacing disconnected spreadsheets and tools."},
    {q:"Does Evolvora Campus handle teacher payroll?",a:"Yes. You store each teacher's basic pay, allowances and tax status, and monthly salary is calculated automatically, with no separate payroll spreadsheet needed."},
    {q:"Is it easier to use than traditional ERP software?",a:"Yes. Evolvora Campus is designed around a clean, modern interface so staff can use it without lengthy training, while still giving you the connected control of an ERP."},
    {q:"Can it manage school finances and fees?",a:"Yes. Evolvora Campus tracks fee dues and collections and shows your whole-school fee position (paid, pending and under review) in real time."},
  ],
  related:[["school-management-system","School Management System","layers"],["school-fee-management-software","Fee Management Software","fee"],["campus-management-system","Campus Management System","globe"]]
}));

pages.push(solutionPage({
  file:"student-attendance-software/index.html", url:"/student-attendance-software/", kw:"Student Attendance Software",
  title:"Student Attendance Software | Evolvora Campus",
  desc:"Evolvora Campus is student attendance software that lets teachers mark a full class present, late or absent in seconds, with live totals, trends and instant parent alerts.",
  h1:"Student attendance software<br><span class=\"grad-text\">that takes seconds a day</span>",
  intro:"Evolvora Campus includes fast, reliable <strong>student attendance software</strong> that lets teachers mark a whole class in seconds, keeps accurate daily records, and notifies parents automatically when it matters.",
  whatH:"What is student attendance software?",
  whatP:["<strong>Student attendance software</strong> replaces paper registers with a digital system for recording who is present, late or absent each day. Good attendance software is quick for teachers, accurate for the office, and transparent for parents.",
    "In Evolvora Campus, a teacher opens their class, taps <strong>Present, Late or Absent</strong> for each student (or marks everyone present and flags the exceptions), and totals update live. Attendance feeds straight into dashboards and the parent app, so families and administrators always have the real picture."],
  media:{img:"attendance.png",label:"Evolvora Campus",alt:"Student attendance software in Evolvora Campus"},
  benefits:[
    {c:"ic-cyan",ic:"clock",h:"Mark in seconds",p:"Tap through a class fast, or \"swipe present\" and flag only the exceptions."},
    {c:"ic-blue",ic:"chart",h:"Trends &amp; reports",p:"Daily totals and a 14-day trend show attendance patterns at a glance."},
    {c:"ic-green",ic:"bell",h:"Instant parent alerts",p:"Parents can be notified about their child's attendance automatically."},
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
  related:[["school-management-system","School Management System","layers"],["campus-management-system","Campus Management System","globe"],["school-fee-management-software","Fee Management Software","fee"]]
}));

pages.push(solutionPage({
  file:"school-fee-management-software/index.html", url:"/school-fee-management-software/", kw:"School Fee Management Software",
  title:"School Fee Management Software | Evolvora Campus",
  desc:"Evolvora Campus is school fee management software to track dues, see paid, pending and outstanding fees at a glance, and send fee reminders to parents in a tap.",
  h1:"School fee management software<br><span class=\"grad-text\">that ends the chasing</span>",
  intro:"Evolvora Campus is powerful <strong>school fee management software</strong> that shows exactly who has paid, who is pending and what's outstanding, and lets you send fee reminders to parents in a single tap.",
  whatH:"What is school fee management software?",
  whatP:["<strong>School fee management software</strong> handles the money side of running a school: recording fee dues, tracking payments, flagging outstanding balances and communicating reminders to parents, without stacks of spreadsheets or manual follow-up calls.",
    "Evolvora Campus gives your office a live, whole-school view of fees: paid, pending and under review, plus the total outstanding amount right on the dashboard. Parents see their own child's fee status in the app, and reminders go out with a tap, so collection is faster and far less stressful."],
  media:{img:"dashboard.png",label:"Evolvora Campus",alt:"School fee management software dashboard in Evolvora Campus"},
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
    {q:"Can we send fee reminders to parents?",a:"Yes. Fee reminders are delivered through the built-in notification system, reaching parents on the app and their phones instantly."},
    {q:"Do parents see their own fee status?",a:"Yes. Each parent sees their child's fee records in the parent portal, so it's always clear what has been paid and what's due."},
    {q:"Is fee management separate or part of the platform?",a:"It's built into Evolvora Campus alongside attendance, marks, payroll and communication, so your fee data connects to the rest of the school."},
  ],
  related:[["school-management-system","School Management System","layers"],["school-erp","School ERP","shield"],["student-attendance-software","Student Attendance Software","clock"]]
}));

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
const today = new Date().toISOString().slice(0,10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u==="/"?"1.0":u.startsWith("/products")?"0.9":"0.8"}</priority></url>`).join("\n")}
</urlset>`;
fs.writeFileSync(path.join(ROOT,"sitemap.xml"), sitemap, "utf8");

/* robots.txt */
fs.writeFileSync(path.join(ROOT,"robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, "utf8");

/* netlify.toml */
fs.writeFileSync(path.join(ROOT,"netlify.toml"), `# Evolvora Technologies static site
[build]
  publish = "."

[[redirects]]
  from = "/login"
  to = "${APP}"
  status = 302
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`, "utf8");

console.log("Wrote " + count + " pages + 404, sitemap, robots, netlify.toml");
console.log(urls.join("\n"));
