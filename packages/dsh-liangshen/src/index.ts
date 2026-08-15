/**
 * dsh-liangshen — LiangShen (梁神) agent preset plugin.
 *
 * Host half only: on startup it syncs the bundled `presets/` tree into the
 * harness-home agent-presets root (`~/.dsh/.agent-presets`), making the
 * LiangShen preset selectable for new sessions without copying files by hand,
 * and announces the capability through a system-prompt section. No browser
 * half, no routes, no agent tools — the preset itself provides the tools.
 *
 * The preset is the "anchored-standard" idea shipped as a named mode: the
 * first model request sees only the builtin Minimal preset's exact two tools
 * (persistent `bash` plus `str_replace_editor`), and after the anchor the
 * wire switches to Code Mode (PTC). Derived from
 * https://github.com/xiaobright/dsh-anchored-standard (MIT).
 */

import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'
import z from 'schemastery'
import { dshHome } from './dsh-home.ts'
import { syncPresetTrees } from './sync.ts'

/** Stable cordis plugin name. */
export const name = 'liangshen'

/** Prompt assembly must exist before the announcement section can register. */
export const inject = ['systemPrompt']

/** Plugin config, validated by the same-named schemastery schema. */
export interface Config {
  /** Master switch: when false, neither sync nor announcement runs. */
  enabled?: boolean
  /** When true (default), a system-prompt section announces the plugin. */
  announceToAgent?: boolean
}

export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  announceToAgent: z.boolean().default(true),
})

/** Schema default, re-read for hand-built test contexts. */
const DEFAULT_ANNOUNCE = true

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 150

/** Model-facing announcement: plugin presence, principle, and limits. */
export const LIANGSHEN_GUIDANCE = 'The dsh-liangshen plugin is installed (LiangShen-mode agent preset): the "LiangShen mode" option appears in the preset selector of new sessions. How it works: two-stage anchoring — the first model request exposes only the official Minimal exact two tools (persistent bash and str_replace_editor; file tools inherit the host sandbox), keeps a single persona line, clears the runtime context, and lets through only the user\'s direct message, anchoring the Minimal reasoning trajectory; promotion is gated on first-block anchoring (first block contains "we" and no "let me", with a four-step fallback); a tool-free first turn auto-promotes after the response, after which the wire switches to Code Mode (PTC, single run_code) and appends the selected workspace path to the persona, with workspace directives and skill directories injected one delayed step later. The preset file is maintained by the plugin at ~/.dsh/.agent-presets and auto-updates on plugin upgrades; the default preset is the user\'s own choice. When the user mentions "LiangShen mode / anchoring mode / anchored standard", they mean this plugin — coordinate accordingly.'
// The harness-home resolution (DSH_HOME override with the platform-home
// fallback and ~ expansion) lives in the family-shared copy ./dsh-home.ts.
// Re-export it so the plugin surface stays stable while the implementation is
// shared across packages. A relative DSH_HOME resolves against the process CWD
// (absolute), which is the shared contract.
export { dshHome } from './dsh-home.ts'

/** Absolute path of the bundled preset tree inside this package. */
export function bundledPresetsRoot(): string {
  return fileURLToPath(new URL('../presets/', import.meta.url))
}

/**
 * Mount the plugin: sync bundled presets into the harness-home agent-presets
 * root, then announce through a system-prompt section.
 * @param ctx - host plugin context carrying systemPrompt.
 * @param config - resolved plugin config (schema defaults applied by the loader).
 */
export function apply(ctx: Context, config?: Config): void {
  const resolve = (): Config => ({
    announceToAgent: config?.announceToAgent ?? DEFAULT_ANNOUNCE,
    enabled: config?.enabled ?? true,
  })

  const sync = (): void => {
    const targetRoot = join(dshHome(), '.agent-presets')
    try {
      mkdirSync(targetRoot, { recursive: true })
      const result = syncPresetTrees(bundledPresetsRoot(), targetRoot, ['liangshen-exact'])
      for (const { id, error } of result.failed) {
        ctx.logger?.warn?.(`dsh-liangshen: preset ${id} sync failed: ${error}`)
      }
      if (result.synced.length > 0) {
        ctx.logger?.info?.(`dsh-liangshen: presets synced into ${targetRoot}: ${result.synced.join(', ')}`)
      }
      if (result.retired.length > 0) {
        ctx.logger?.info?.(`dsh-liangshen: retired stale presets from ${targetRoot}: ${result.retired.join(', ')}`)
      }
    } catch (error) {
      ctx.logger?.warn?.(`dsh-liangshen: preset sync failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  let disposeSection: (() => void) | undefined
  const refresh = (): void => {
    disposeSection?.()
    disposeSection = undefined
    if (!resolve().enabled) return
    sync()
    if (resolve().announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-liangshen',
        order: SECTION_ORDER,
        text: LIANGSHEN_GUIDANCE,
      })
    }
  }

  refresh()
  ctx.effect(() => () => { disposeSection?.(); disposeSection = undefined }, 'dsh-liangshen: announcement')
}
