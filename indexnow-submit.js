/* Tells Bing (and the other IndexNow search engines) that the site's pages
   changed, so they recrawl them within hours instead of weeks.

   Run it AFTER a deploy, once the new pages and the key file are live:
     node indexnow-submit.js

   It reads every URL from the local sitemap.xml. The key must match the one in
   build-site.js, which also writes the <key>.txt file IndexNow checks. */
const fs = require("fs");
const path = require("path");

const HOST = "evolvoratech.com";
const KEY = "32a37914266faa793f69c493c4398d76";

const sitemap = fs.readFileSync(path.join(__dirname, "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
}).then((res) => {
  // 200 = accepted, 202 = accepted and the key is still being checked.
  console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
  if (res.status >= 400) process.exitCode = 1;
}).catch((err) => {
  console.error("IndexNow request failed:", err.message);
  process.exitCode = 1;
});
