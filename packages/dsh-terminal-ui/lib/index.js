// dsh-terminal-ui host half:
//  1. serves the desktop wallpaper to the browser at /terminal-ui/wallpaper
//     (the client theme uses it as a background);
//  2. tracks the live session cost: wraps llm/stream, accumulates the
//     per-session token usage (input/output/cacheRead/cacheWrite), prices it
//     with the DeepSeek ledger prices, and serves the current session's cost
//     line at /terminal-ui/session-cost.
// The cost line used to come from the dsh-cost-meter plugin; this module
// re-implements just the session-cost values (usage buckets + price table →
// dollar cost) so the theme can render the line itself.

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

// ── session-cost tracking ──────────────────────────────────────────────────

/** DeepSeek ledger prices (USD per 1M tokens), from the cost-meter ledger. */
const LEDGER_PRICES = {
  models: {
    "deepseek-v4-flash": { cacheHit: 0.0028, cacheMiss: 0.14, output: 0.28 },
    "deepseek-v4-pro": { cacheHit: 0.003625, cacheMiss: 0.435, output: 0.87 },
    "deepseek-chat": { cacheHit: 0.07, cacheMiss: 0.27, output: 1.1 },
    "deepseek-reasoner": { cacheHit: 0.14, cacheMiss: 0.55, output: 2.19 },
  },
  default: { cacheHit: 0.0028, cacheMiss: 0.14, output: 0.28 },
};

const zeroBuckets = () => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });

/** Per-session running totals: model name + token buckets. */
const sessions = new Map();
/** Session id of the most recent llm/stream activity (the one on screen). */
let lastActiveSession = "current";

function bucketsOf(usage) {
  return {
    input: Number(usage.inputTokens) || 0,
    output: Number(usage.outputTokens) || 0,
    cacheRead: Number(usage.cacheReadTokens) || 0,
    cacheWrite: Number(usage.cacheWriteTokens) || 0,
  };
}

/**
 * Apply one usage sample to the per-session totals. The same (turn, step)
 * sample replaces its streaming predecessor (subtract-then-add) so a stream
 * that reports usage more than once does not double-count.
 */
function applyUsage(session, model, usage, turn, step) {
  const buckets = bucketsOf(usage);
  const key = `${turn}:${step}`;
  const prev = session.last !== null && session.last.key === key ? session.last : null;
  if (
    prev !== null &&
    prev.model === model &&
    prev.buckets.input === buckets.input &&
    prev.buckets.output === buckets.output &&
    prev.buckets.cacheRead === buckets.cacheRead &&
    prev.buckets.cacheWrite === buckets.cacheWrite
  ) {
    return;
  }
  const shift = (b, sign) => {
    session.totals.input += sign * b.input;
    session.totals.output += sign * b.output;
    session.totals.cacheRead += sign * b.cacheRead;
    session.totals.cacheWrite += sign * b.cacheWrite;
    const m = session.byModel[model] ?? zeroBuckets();
    session.byModel[model] = {
      input: m.input + sign * b.input,
      output: m.output + sign * b.output,
      cacheRead: m.cacheRead + sign * b.cacheRead,
      cacheWrite: m.cacheWrite + sign * b.cacheWrite,
    };
  };
  if (prev !== null) shift(prev.buckets, -1);
  shift(buckets, 1);
  session.last = { key, model, buckets };
}

/** Cost of one bucket set at a price tier (USD). */
function costOf(buckets, tier) {
  const input = Math.max(0, Number(buckets.input) || 0);
  const output = Math.max(0, Number(buckets.output) || 0);
  const cache = Math.max(0, Number(buckets.cacheRead) || 0) + Math.max(0, Number(buckets.cacheWrite) || 0);
  return (input * tier.cacheMiss + output * tier.output + cache * tier.cacheHit) / 1_000_000;
}

/** Dollar cost of a session's totals, priced per model with default fallback. */
function sessionCost(session, prices) {
  const models = prices?.models ?? LEDGER_PRICES.models;
  const fallback = prices?.default ?? LEDGER_PRICES.default;
  let total = 0;
  for (const [modelId, buckets] of Object.entries(session.byModel)) {
    const entry = models[modelId] ?? fallback;
    total += costOf(buckets, entry);
  }
  const modeled = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  for (const buckets of Object.values(session.byModel)) {
    modeled.input += buckets.input;
    modeled.output += buckets.output;
    modeled.cacheRead += buckets.cacheRead;
    modeled.cacheWrite += buckets.cacheWrite;
  }
  const leftover = {
    input: Math.max(0, session.totals.input - modeled.input),
    output: Math.max(0, session.totals.output - modeled.output),
    cacheRead: Math.max(0, session.totals.cacheRead - modeled.cacheRead),
    cacheWrite: Math.max(0, session.totals.cacheWrite - modeled.cacheWrite),
  };
  total += costOf(leftover, fallback);
  return total;
}

/** Try the cost-meter ledger prices (file survives plugin removal); fall back to the built-in table. */
function loadLedgerPrices() {
  try {
    const path = join(homedir(), ".dsh/storages/cost-meter/ledger.json");
    const data = JSON.parse(readFileSync(path, "utf8"));
    const models = data?.config?.prices?.models;
    const def = data?.config?.prices?.default;
    if (models && typeof models === "object" && Object.keys(models).length > 0) {
      return { models, default: def ?? LEDGER_PRICES.default };
    }
  } catch {
    /* ledger missing or unreadable — use the built-in table */
  }
  return LEDGER_PRICES;
}

let prices = loadLedgerPrices();

function apply(ctx) {
  // Wrap llm/stream: capture the final usage block per request and fold it
  // into the per-session totals. Pure passthrough — the stream protocol is
  // untouched.
  ctx.on("llm/stream", (options, next) => {
    const downstream = next();
    return (async function* costStream() {
      let usage = null;
      let turn = 0;
      let step = 0;
      try {
        for await (const chunk of downstream) {
          if (chunk !== null && chunk !== undefined && chunk.type === "usage" && chunk.usage !== undefined) {
            usage = chunk.usage;
            turn = chunk.turn ?? 0;
            step = chunk.step ?? 0;
          }
          yield chunk;
        }
      } finally {
        if (usage !== null) {
          const sid = options?.sessionId ?? "current";
          lastActiveSession = sid;
          let session = sessions.get(sid);
          if (session === undefined) {
            session = { totals: zeroBuckets(), byModel: {}, last: null };
            sessions.set(sid, session);
          }
          applyUsage(session, options?.model ?? "default", usage, turn, step);
        }
      }
    })();
  });

  // Read the ledger prices again whenever it is rewritten by a future
  // reinstall; harmless when absent.
  try {
    prices = loadLedgerPrices();
  } catch {
    /* ignore */
  }

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

  // Serve the current session's cost line: JSON for the client theme to
  // render next to the stats line.
  ctx.effect(() =>
    ctx.webServer.register({
      kind: "exact",
      path: "/terminal-ui/session-cost",
      handler(req, res) {
        try {
          const url = new URL(req.url ?? "", "http://localhost");
          const sid = url.searchParams.get("session") ?? lastActiveSession;
          const session = sessions.get(sid);
          const totals = session?.totals ?? zeroBuckets();
          const cost = session ? sessionCost(session, prices) : 0;
          const body = JSON.stringify({
            session: sid,
            cost,
            input: totals.input,
            cache: totals.cacheRead + totals.cacheWrite,
            output: totals.output,
          });
          res.writeHead(200, {
            "content-type": "application/json",
            "content-length": Buffer.byteLength(body),
            "cache-control": "no-store",
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
