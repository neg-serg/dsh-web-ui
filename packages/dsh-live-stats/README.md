# @linxin666/dsh-live-stats

English | [中文](README.zh.md)

Live input/output token estimates for DSH Web. It feeds the built-in session status row: input and output token totals update while a response streams:

```text
1 turns · 3 steps Input ~7.9K tok · Output ~12 tok
```

`~` marks a heuristic estimate. Provider usage replaces the estimate when it arrives; exact cache accounting continues to come from DSH's durable token-usage projection. A retry replaces the prior estimate for that step, and an aborted turn removes its unsettled estimate.

## What it does

- **Host half**: registers the replayable `liveTokenUsage` session projection (`ctx.sessionProjections`). The fold estimates input tokens from the surface log plus header/tool framing, estimates output tokens from streaming chunks, and replaces estimates with provider usage as soon as a `usage` chunk or final message lands. TPS is derived from output tokens over wall-clock time of the active step, and the rate is resident: once any step measured one, the projection keeps reporting it (falling back to the last measured value while a new step has not produced output yet, or after a rate-less step), so the rate never flickers out.
- **Client half**: mounts nothing. The `TpsLine` component stays exported for integrators but is not registered into the `conversation.composer.dock` slot; ui-conversation reads the `liveTokenUsage` projection directly for the session stats line.

## Installation

Install the family aggregate package `@linxin666/dsh-web-ui-all` (all plugins and skins in one) or this plugin alone:

```sh
# Recommended: install directly from npm
dsh plugin --profile web add @linxin666/dsh-live-stats

# Or from the repository (development loop)
git clone https://github.com/zhu1090093659/dsh-web-ui.git
cd dsh-web-ui
pnpm install && pnpm -r build
dsh plugin --profile web add link:$(pwd)/packages/dsh-live-stats

```

Restart `dsh web`, and the live input/output token totals update the session status line.

Alternatively, as a plain overlay row in the personal DSH overlay (`~/.dsh/config.yaml`), hot-reloaded on save:

```yaml
- insert:
    - id: live-stats
      name: '@linxin666/dsh-live-stats'
      config:
        charsPerToken: 4
        blockOverhead: 4
        roleOverhead: 4
```

All three estimator values are optional (defaults shown).

## Configuration

| Key | Type | Default | Meaning |
|---|---|---|---|
| `charsPerToken` | `number` | `4` | Approximate text characters represented by one token |
| `blockOverhead` | `number` | `4` | Fixed framing tokens assigned to each content block |
| `roleOverhead` | `number` | `4` | Fixed framing tokens assigned to each message or assistant response |

## Export shape

A function/namespace plugin: `inject` / `Config` / `apply`, no default export. The estimator (`./estimator`) and the projection fold (`./projection`) are pure and unit-tested; the client exports `TpsLine` (rendered through the runtime's projection hook; not mounted by default). The invariant companion registers under `./invariant`.

## Model Experience

### Prompt and tool surface

#### What the model sees

Nothing. The plugin injects no prompt sections, registers no tools, and emits no `session` events of its own — it only consumes the durable stream and the projection carrier's wire path.

#### Token effect

Zero per request.

#### KV Cache effect

No system-prompt contribution, so no cache-stability effect.

## Known Limitations and Deferred Work

- **Heuristic estimates**: input/output totals are character-count heuristics (`~`) until provider usage arrives; exact cache accounting always comes from DSH's durable token-usage projection.
- **TPS row not mounted**: the `TpsLine` component is exported for integrators but does not register into DSH Web's composer dock; no TUI equivalent exists.
- **Single active step**: the projection tracks one active step per session and reports that session's view; concurrent sessions each get their own projection.
- **Density assumption**: `charsPerToken` defaults to 4 characters, which undercounts CJK text and overcounts pure ASCII; tune it per deployment if estimates drift.
