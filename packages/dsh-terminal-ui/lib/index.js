// dsh-terminal-ui host half: serves the desktop wallpaper to the browser at
// /terminal-ui/wallpaper so the client theme can use it as a background.
// The served file follows the wl wallpaper daemon's current pick
// (~/.cache/quickshell-wallpaper-path), falling back to a fixed path.
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const inject = ["webServer"];

const WALLPAPER_HINT = join(homedir(), ".cache/quickshell-wallpaper-path");
const FALLBACK = "/home/neg/pic/wl/wallhaven-jek6kq.jpg";

function resolveWallpaper() {
  try {
    const p = readFileSync(WALLPAPER_HINT, "utf8").trim();
    if (p && existsSync(p)) return p;
  } catch {
    /* hint file missing or unreadable — fall through */
  }
  return existsSync(FALLBACK) ? FALLBACK : null;
}

function contentTypeOf(path) {
  if (/\.png$/i.test(path)) return "image/png";
  if (/\.webp$/i.test(path)) return "image/webp";
  if (/\.gif$/i.test(path)) return "image/gif";
  return "image/jpeg";
}

function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: "exact",
      path: "/terminal-ui/wallpaper",
      handler(_req, res) {
        try {
          const path = resolveWallpaper();
          if (path === null) {
            res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
            res.end("no wallpaper configured");
            return;
          }
          const body = readFileSync(path);
          res.writeHead(200, {
            "content-type": contentTypeOf(path),
            "content-length": body.length,
            "cache-control": "public, max-age=3600",
          });
          res.end(body);
        } catch (error) {
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
          res.end(String(error));
        }
      },
    }),
  );
}

export { apply, inject };
