# Evolvora Technologies — Website

Multi-page static marketing site for **Evolvora Technologies** and its flagship product **Evolvora Campus**. Pure HTML/CSS/JS — no build step required to deploy.

---

## 🗂 Pages

| URL | Purpose | SEO target |
|-----|---------|-----------|
| `/` | Home — **software house** (services, products, process) | brand "Evolvora", software house |
| `/services/` | Software development services | software development services |
| `/products/` | Product portfolio | — |
| `/products/evolvora-campus/` | Full product page | "Evolvora Campus" |
| `/about/` | Company / about | brand "Evolvora" |
| `/pricing/` | Evolvora Campus plans & pricing | pricing |
| `/contact/` | Contact + project/demo form | — |
| `/school-management-system/` | SEO landing | **school management system** |
| `/campus-management-system/` | SEO landing | **campus management system** |
| `/school-erp/` | SEO landing | **school erp** |
| `/student-attendance-software/` | SEO landing | **student attendance software** |
| `/school-fee-management-software/` | SEO landing | **school fee management software** |
| `/login` | Redirects → `app.evolvoratech.com` | (via `netlify.toml`) |

Plus `404.html`, `sitemap.xml`, `robots.txt`, `netlify.toml`.

---

## 👀 Preview locally

**Do not double-click `index.html`** — the site uses root-absolute paths (`/assets/...`) and clean folder URLs, so opening the raw file shows an unstyled page (a giant logo). It must be *served* from a small local server (this is exactly how Netlify serves it).

**Easiest:** double-click **`serve.bat`** (needs [Node.js](https://nodejs.org) installed). A browser tab opens at `http://localhost:8080/`. Keep the window open; close it or press Ctrl+C to stop.

Equivalent commands, from inside this folder:
```bash
node serve.js          # the bundled zero-dependency server
# or
npx serve .            # if you prefer the 'serve' package
# or
python -m http.server 8080
```

---

## 🚀 Deploy to Netlify

**Drag & drop:** go to <https://app.netlify.com/drop> and drop the whole `evolvora-website` folder. Done.

**From Git (recommended):** connect the repo, set **Publish directory** to `evolvora-website`. No build command needed.

### Connect your domain
1. In Netlify → **Domain settings**, add `evolvoratech.com` (and `www`).
2. Point your DNS to Netlify (they show the exact records).
3. For the app: create an `app` subdomain (`app.evolvoratech.com`) pointing to wherever your **application** is hosted (this is separate from this marketing site). The **Login** button and `/login` already point there.

---

## 🔎 SEO — what's already built in

- **Unique title + meta description** on every page, keyword-optimised.
- **Canonical URLs**, Open Graph + Twitter Card tags, social share image (`assets/img/og-image.png`).
- **Structured data (JSON-LD):** `Organization` + `WebSite` (home), `SoftwareApplication` (product), `BreadcrumbList` (every sub-page), `FAQPage` (pricing + all 5 solution pages → eligible for FAQ rich results in Google).
- **Dedicated keyword landing pages** with the target phrase in the URL, `<title>`, `<h1>`, first paragraph, headings and FAQ.
- **Internal linking:** every page links to all 5 solution pages (header dropdown + footer), which builds topical authority.
- `sitemap.xml` + `robots.txt` (sitemap referenced for crawlers).
- Semantic HTML, one `<h1>` per page, fast & fully mobile-responsive.

### Do this after launch (important for ranking)
1. **Google Search Console** — verify `evolvoratech.com`, then submit `https://evolvoratech.com/sitemap.xml`.
2. **Bing Webmaster Tools** — same.
3. Add a **Google Business Profile** for Evolvora Technologies (helps brand searches).
4. Get a few real backlinks/mentions (directories, socials) — put those profile URLs into the `sameAs: []` array in `build-site.js` (`orgLD`) and rebuild.
5. Keep the domain consistent everywhere: always "Evolvora Technologies" / "Evolvora Campus".

> SEO note: ranking for competitive terms like "school management system" takes time and ongoing content/backlinks — this site gives you a technically strong, keyword-targeted foundation, but no site can *guarantee* rank #1.

---

## ✏️ Editing content

The HTML is generated from **`build-site.js`** (plain Node, no dependencies) so the shared nav/footer stay consistent across all pages.

```bash
node build-site.js        # regenerates all HTML + sitemap + robots + netlify.toml
```

Edit page copy/structure in `build-site.js`, or tweak styling in `assets/css/styles.css`. You *can* also edit the generated `.html` files directly, but a change to the nav/footer would then need repeating on every page — the generator avoids that.

`brand-assets.js` regenerates the logo/social images (needs `npm i sharp`).

---

## 🎨 Logo

The logo is a crisp inline **SVG** (defined once in `build-site.js`, used in the nav, footer and favicon). It's a recreation of your Evolvora "E" mark in the blue→purple gradient. To use your exact official artwork instead, either replace the `MARK` SVG string in `build-site.js`, or drop your PNG into `assets/img/` and swap the `${MARK}` usages for an `<img>`.

---

## 📬 Contact form

The contact form uses **Netlify Forms** (`data-netlify="true"`). Once deployed to Netlify it works automatically — submissions appear in your Netlify dashboard under **Forms**. Turn on notifications there to forward them to **contact@evolvoratech.com**. Locally the form won't submit (Netlify processes it at deploy). A `mailto:` fallback is shown too.

---

## 💲 Pricing

The prices on `/pricing/` are **indicative placeholders** ($0.6 / $1.0 per student, Custom). Edit them in `build-site.js` (the Pricing section) and rebuild before sending to clients.
"# Evolvora" 
