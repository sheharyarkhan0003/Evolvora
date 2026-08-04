// Tiny zero-dependency static server for local preview of the Evolvora site.
// Run with:  node serve.js   (or just double-click serve.bat on Windows)
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const ROOT = __dirname;
// PORT=3000 node serve.js  to override; otherwise we try 8080 and step upward
// if something else is already listening (a previous run left running, etc).
const BASE_PORT = Number(process.env.PORT) || 8080;
const MAX_TRIES = 10;
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon",
  ".xml": "application/xml", ".txt": "text/plain", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".webm": "video/webm",
};

const server = http.createServer((req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    let fp = path.join(ROOT, p);
    // directory -> index.html ; clean URL -> foo.html or foo/index.html
    if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) {
      fp = path.join(fp, "index.html");
    } else if (!path.extname(fp)) {
      if (fs.existsSync(fp + ".html")) fp += ".html";
      else if (fs.existsSync(path.join(fp, "index.html"))) fp = path.join(fp, "index.html");
    }
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      const nf = path.join(ROOT, "404.html");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "404 Not Found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(fp).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end("Server error");
  }
});

let port = BASE_PORT;

server.on("error", (e) => {
  if (e.code !== "EADDRINUSE") throw e;
  if (port - BASE_PORT + 1 >= MAX_TRIES) {
    console.error(`\n  Could not start: ports ${BASE_PORT}-${port} are all in use.`);
    console.error("  Something else is already serving. To find and stop it:\n");
    console.error(`    PowerShell:  Get-NetTCPConnection -LocalPort ${BASE_PORT} -State Listen |`);
    console.error("                 ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }\n");
    process.exit(1);
  }
  console.log(`  Port ${port} is in use (an earlier preview may still be running) - trying ${port + 1}...`);
  port++;
  server.listen(port);
});

server.on("listening", () => {
  const url = `http://localhost:${port}/`;
  console.log("\n  Evolvora site is running at:  " + url);
  console.log("  (leave this window open. Press Ctrl+C to stop)\n");
  try { exec(`start "" ${url}`); } catch (e) {}
});

server.listen(port);
