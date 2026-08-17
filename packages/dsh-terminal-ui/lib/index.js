// dsh-terminal-ui host half: serves the desktop wallpaper to the browser at
// /terminal-ui/wallpaper so the client theme can use it as a background,
// plus a read-only JSON bridge at /terminal-ui/json/<source> that feeds the
// client-side system-status dock (tui-jsondock feature in client.js).
//
// The bridge runs only whitelisted commands (argv arrays straight into
// execFile — no shell interpolation), keeps a TTL cache for slow/remote
// sources, and answers {"ok":true,"source":..,"data":..} on success or
// {"ok":false,"source":..,"error":..} on failure.

import { readFileSync, existsSync, readdirSync, readlinkSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";

const inject = ["webServer", "commands"];

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

/* ── JSON bridge ─────────────────────────────────────────────────────── */

const DSH_HOME = homedir();

// Run a whitelisted command; resolve to trimmed stdout. Rejects on spawn
// error, non-zero exit, or timeout.
function run(cmd, args, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout: timeoutMs, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err !== null) {
        const detail = (stderr ?? "").trim() || (err.stderr ?? "").trim() || err.message;
        reject(new Error(`${cmd} failed: ${detail}`));
        return;
      }
      resolve(String(stdout).trim());
    });
  });
}

async function runJson(cmd, args, timeoutMs = 4000) {
  const out = await run(cmd, args, timeoutMs);
  return out === "" ? null : JSON.parse(out);
}

// hyprctl: monitors / workspaces / clients / active window in one snapshot.
async function hyprState() {
  const [monitors, workspaces, clients, activewindow] = await Promise.all([
    runJson("hyprctl", ["-j", "monitors"], 3000),
    runJson("hyprctl", ["-j", "workspaces"], 3000),
    runJson("hyprctl", ["-j", "clients"], 3000),
    runJson("hyprctl", ["-j", "activewindow"], 3000),
  ]);
  return { monitors, workspaces, clients, activewindow };
}

// systemd: running + failed service tables.
async function systemState() {
  const [running, failed] = await Promise.all([
    runJson("systemctl", ["-o", "json", "list-units", "--type=service", "--state=running"], 4000),
    runJson("systemctl", ["-o", "json", "list-units", "--type=service", "--state=failed"], 4000),
  ]);
  return {
    running: running ?? [],
    failed: failed ?? [],
    counts: { running: (running ?? []).length, failed: (failed ?? []).length },
  };
}

// NixOS generations: the system profile dir is world-readable (the lock
// file is not, so `nix-env --list-generations` is unavailable to us).
function readlinkSafe(p) {
  try {
    return readlinkSync(p);
  } catch {
    return null;
  }
}

function statSyncSafe(p) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}

function generations() {
  const dir = "/nix/var/nix/profiles";
  const out = [];
  for (const name of readdirSync(dir)) {
    const m = /^system-(\d+)-link$/.exec(name);
    if (m === null) continue;
    const linkPath = join(dir, name);
    let version = null;
    try {
      version = readFileSync(join(linkPath, "nixos-version"), "utf8").trim();
    } catch {
      /* old generation without nixos-version file */
    }
    const st = statSyncSafe(linkPath);
    out.push({
      generation: Number(m[1]),
      target: readlinkSafe(linkPath),
      version,
      mtime: st === null ? null : st.mtimeMs,
    });
  }
  out.sort((a, b) => b.generation - a.generation);
  return out;
}

// MPD: mpc status is plain text, mpc current gives the track line.
async function mpcState() {
  const [status, current] = await Promise.all([
    run("mpc", ["status"], 3000),
    run("mpc", ["current", "--format", "%artist% — %title%"], 3000),
  ]);
  return { status, current };
}

// TTL cache for slow/remote sources; a failed promise is cached briefly too
// so a flaky source does not hammer the host on every poll.
const cache = new Map();
function withCache(source, ttlMs, fn) {
  const hit = cache.get(source);
  if (hit !== undefined && Date.now() - hit.at < hit.ttl) return hit.promise;
  const promise = Promise.resolve()
    .then(fn)
    .catch((error) => ({ __error: String(error.message ?? error) }));
  cache.set(source, { at: Date.now(), ttl: ttlMs, promise });
  return promise;
}

const PROFILE_DIR = join(DSH_HOME, ".dsh/profiles/web");

// Source registry: name -> () => JSON-serializable data.
const SOURCES = {
  // sensors -j: {"chip":{"label":{"temp1_input":49.0,...}}}
  sensors: () => runJson("sensors", ["-j"], 3000),
  // systemd service tables
  system: () => systemState(),
  // networkctl --json=short: {"Interfaces":[...]}
  net: () => runJson("networkctl", ["--json=short"], 3000),
  // hyprctl monitors/workspaces/clients/activewindow
  hypr: () => hyprState(),
  // duf --json: array of mount rows
  duf: () => runJson("duf", ["--json"], 4000),
  // transmission RPC list (JSON)
  torrents: () => runJson("transmission-remote", ["-j", "-l"], 4000),
  // MPD status + current track
  mpc: () => mpcState(),
  // nix flake metadata (slow — cached 60s)
  flake: () => withCache("flake", 60_000, () => runJson("nix", ["flake", "metadata", "--json", "/etc/nixos"], 8000)),
  // NixOS generations from /nix/var/nix/profiles (cached 60s)
  generations: () => withCache("generations", 60_000, () => generations()),
  // fastfetch system summary (cached 5 min)
  fastfetch: () => withCache("fastfetch", 300_000, () => runJson("fastfetch", ["--format", "json"], 8000)),
  // weather: wttr.in JSON (cached 10 min; needs network). Uses Node's own
  // fetch — the harness process already reaches the network for LLM calls,
  // and a curl spawned from it can break on the GUI session's LD_LIBRARY_PATH
  // (nghttp3/re2 libs), so execFile is not used here.
  weather: () => withCache("weather", 600_000, async () => {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 8000);
    try {
      const res = await fetch("https://wttr.in/?format=j1", { signal: ac.signal });
      if (!res.ok) throw new Error(`wttr.in http ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }),
  // pet.json — dshmarket pet state
  pet: () => {
    const p = join(DSH_HOME, ".dsh/pet.json");
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  },
  // dshmarket plugin registry snapshot (categories, counts)
  registry: () => {
    const p = join(PROFILE_DIR, "node_modules/dshmarket/data/registry-snapshot.json");
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  },
};

// /terminal-ui/json/<name> — single path segment, no traversal.
function matchJsonSource(pathname) {
  const prefix = "/terminal-ui/json/";
  if (!pathname.startsWith(prefix)) return null;
  const name = pathname.slice(prefix.length);
  if (name === "" || name.includes("/") || name.includes("..")) return null;
  return Object.prototype.hasOwnProperty.call(SOURCES, name) ? name : null;
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
  });
  res.end(payload);
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

  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: "prefix",
        path: "/terminal-ui/json",
        handler(req, res) {
          const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
          const source = matchJsonSource(pathname);
          if (source === null) {
            sendJson(res, 404, { ok: false, error: "unknown json source" });
            return;
          }
          const started = Date.now();
          Promise.resolve()
            .then(() => SOURCES[source]())
            .then((data) => {
              sendJson(res, 200, { ok: true, source, at: started, ms: Date.now() - started, data });
            })
            .catch((error) => {
              sendJson(res, 200, { ok: false, source, error: String(error.message ?? error) });
            });
        },
      }),
    "terminal-ui: json bridge",
  );

  // /export-md: Markdown export slash command. The browser half observes
  // "command/executed" and clicks the (CSS-hidden) "⬇ md" header button, so
  // the export handler itself stays in the client bundle unchanged.
  ctx.effect(
    () =>
      ctx.commands.register({
        name: "export-md",
        description: "Export this conversation as Markdown",
        handler: () =>
          Promise.resolve({ kind: "success", text: "Markdown export started." }),
      }),
    "terminal-ui: /export-md command",
  );
}

export { apply, inject };
