import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function resolveRequest(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]);
  const normalized = cleanUrl.endsWith("/") ? `${cleanUrl}index.html` : cleanUrl;
  const safePath = path.normalize(normalized).replace(/^(\.\.[/\\])+/, "");
  return path.join(dist, safePath);
}

await build();

createServer(async (request, response) => {
  try {
    let filePath = resolveRequest(request.url || "/");
    if (!existsSync(filePath)) {
      const maybeDir = path.join(dist, decodeURIComponent((request.url || "/").split("?")[0]), "index.html");
      filePath = maybeDir;
    }
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not found");
    const body = await readFile(filePath);
    response.writeHead(200, { "content-type": types[path.extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end("<h1>404</h1>");
  }
}).listen(port, () => {
  console.log(`S&J Studio Lab site running at http://localhost:${port}`);
});
