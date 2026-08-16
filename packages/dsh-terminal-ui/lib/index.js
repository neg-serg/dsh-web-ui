// dsh-terminal-ui host half:
//  1. serves the desktop wallpaper to the browser at /terminal-ui/wallpaper
//     (the client theme uses it as a background);
//  2. tracks the live session cost: a session projection folds the per-session
//     token usage (input/output/cacheRead/cacheWrite) from the event log and
//     prices it with the DeepSeek ledger prices; the current session's cost
//     line is served at /terminal-ui/session-cost.
// The cost line used to come from the dsh-cost-meter plugin; this module
// re-implements just the session-cost values (usage buckets + price table →
// dollar cost) so the theme can render the line itself.

import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const inject = ["webServer", "sessions", "sessionProjections"];

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

function bucketsOf(usage) {
  return {
    input: Number(usage.inputTokens) || 0,
    output: Number(usage.outputTokens) || 0,
    cacheRead: Number(usage.cacheReadTokens) || 0,
    cacheWrite: Number(usage.cacheWriteTokens) || 0,
  };
}

/** Cost of one bucket set at a price tier (USD). */
function costOf(buckets, tier) {
  const input = Math.max(0, Number(buckets.input) || 0);
  const output = Math.max(0, Number(buckets.output) || 0);
  const cache = Math.max(0, Number(buckets.cacheRead) || 0) + Math.max(0, Number(buckets.cacheWrite) || 0);
  return (input * tier.cacheMiss + output * tier.output + cache * tier.cacheHit) / 1_000_000;
}

/** Dollar cost of a session's totals, priced per model with default fallback. */
function sessionCost(totals, byModel, prices) {
  const models = prices?.models ?? LEDGER_PRICES.models;
  const fallback = prices?.default ?? LEDGER_PRICES.default;
  let total = 0;
  for (const [modelId, buckets] of Object.entries(byModel)) {
    const entry = models[modelId] ?? fallback;
    total += costOf(buckets, entry);
  }
  const modeled = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  for (const buckets of Object.values(byModel)) {
    modeled.input += buckets.input;
    modeled.output += buckets.output;
    modeled.cacheRead += buckets.cacheRead;
    modeled.cacheWrite += buckets.cacheWrite;
  }
  const leftover = {
    input: Math.max(0, totals.input - modeled.input),
    output: Math.max(0, totals.output - modeled.output),
    cacheRead: Math.max(0, totals.cacheRead - modeled.cacheRead),
    cacheWrite: Math.max(0, totals.cacheWrite - modeled.cacheWrite),
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

/** Session projection: fold token usage from the event log (same events the
 *  cost-meter projection watched), keyed by the session it is driven for. */
/** Plain-JSON projection schema. The session-projection registry calls
 *  `schema.parse(view)` when serving snapshots, so the schema must be
 *  defined; the view output is already plain JSON, this shim passes it
 *  through unchanged (no zod dependency). */
const plainJsonSchema = {
  parse(value) {
    return value;
  },
};

const costUsageProjection = {
  key: "tui-costUsage",
  schema: plainJsonSchema,
  stateVersion: 1,
  init: () => ({ model: "default", totals: zeroBuckets(), byModel: {}, last: null }),
  apply(state, event) {
    if (event.type === "request/header") {
      const model = event.data?.header?.config?.model;
      const next = typeof model === "string" && model.length > 0 ? model : "default";
      return next === state.model ? state : { ...state, model: next };
    }
    let usage = null;
    let turn = 0;
    let step = 0;
    if (event.type === "assistant/chunk" && event.data?.chunk?.type === "usage" && event.data.chunk.usage !== undefined) {
      usage = event.data.chunk.usage;
      turn = event.data.turn;
      step = event.data.step;
    } else if (event.type === "assistant/message" && event.data?.usage !== undefined) {
      usage = event.data.usage;
      turn = event.data.turn;
      step = event.data.step;
    } else {
      return state;
    }
    const buckets = bucketsOf(usage);
    const key = `${turn}:${step}`;
    const prev = state.last !== null && state.last.key === key ? state.last : null;
    if (
      prev !== null &&
      prev.model === state.model &&
      prev.buckets.input === buckets.input &&
      prev.buckets.output === buckets.output &&
      prev.buckets.cacheRead === buckets.cacheRead &&
      prev.buckets.cacheWrite === buckets.cacheWrite
    ) {
      return state;
    }
    const totals = { ...state.totals };
    const byModel = { ...state.byModel };
    const shift = (model, b, sign) => {
      totals.input += sign * b.input;
      totals.output += sign * b.output;
      totals.cacheRead += sign * b.cacheRead;
      totals.cacheWrite += sign * b.cacheWrite;
      const current = byModel[model] ?? zeroBuckets();
      byModel[model] = {
        input: current.input + sign * b.input,
        output: current.output + sign * b.output,
        cacheRead: current.cacheRead + sign * b.cacheRead,
        cacheWrite: current.cacheWrite + sign * b.cacheWrite,
      };
    };
    if (prev !== null) shift(prev.model, prev.buckets, -1);
    shift(state.model, buckets, 1);
    return { model: state.model, totals, byModel, last: { key, model: state.model, buckets } };
  },
  view(state) {
    return {
      input: state.totals.input,
      output: state.totals.output,
      cacheRead: state.totals.cacheRead,
      cacheWrite: state.totals.cacheWrite,
      byModel: state.byModel,
    };
  },
};

let prices = loadLedgerPrices();

/** Session id of the most recent llm/stream activity (the one on screen). */
let lastActiveSessionId = null;

function apply(ctx) {
  // Remember which session is active: a minimal llm/stream wrapper that only
  // records the sessionId (the token counting lives in the projection, which
  // replays the full event log).
  ctx.on("llm/stream", (options, next) => {
    const sid = options?.sessionId ?? null;
    if (sid !== null && sid !== lastActiveSessionId) lastActiveSessionId = sid;
    return next();
  });

  // Register the cost projection so every session's log folds into it.
  ctx.effect(() => {
    const sessionProjections = ctx.get("sessionProjections");
    if (sessionProjections === void 0) return;
    const dispose = sessionProjections.register(costUsageProjection);
    return () => { try { dispose(); } catch { /* already gone */ } };
  }, "tui: cost usage projection");

  // Refresh the ledger prices once after boot (and on demand per request).
  prices = loadLedgerPrices();

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

  // Serve the session cost line: JSON for the client theme to render next to
  // the stats line. Reads the projection snapshot of the requested (or the
  // most recently active) session, so values replay the full event log —
  // including history that predates this dsh boot.
  ctx.effect(() =>
    ctx.webServer.register({
      kind: "exact",
      path: "/terminal-ui/session-cost",
      handler(req, res) {
        try {
          const url = new URL(req.url ?? "", "http://localhost");
          const sid = url.searchParams.get("session") ?? lastActiveSessionId;
          const session = sid === null ? undefined : ctx.get("sessions")?.get(sid);
          const block = session !== undefined ? ctx.get("sessionProjections")?.snapshot(session) : undefined;
          const usage = block?.values?.tuiCostUsage;
          const totals = usage ?? zeroBuckets();
          const byModel = usage?.byModel ?? {};
          const cost = usage ? sessionCost(totals, byModel, prices) : 0;
          const body = JSON.stringify({
            session: sid,
            cost,
            input: totals.input ?? 0,
            cache: (totals.cacheRead ?? 0) + (totals.cacheWrite ?? 0),
            output: totals.output ?? 0,
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
