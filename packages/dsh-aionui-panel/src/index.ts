/**
 * @linxin666/dsh-client-ui-aionui-panel — host half: the workspace-gated
 * filesystem + git services and the /aionui-panel/* HTTP routes (JSON
 * operations + SSE change stream) on the shared webserver. The browser half
 * (exports "./client") is served by client-modules from the same package's
 * dsh.client declaration.
 *
 * The host half also announces the plugin to every agent through the
 * system-prompt section mechanism (the same band task-board uses), so agents
 * know the right-panel system exists and how to cooperate with it.
 *
 * AionUi right-panel design (Apache-2.0, iOfficeAI/AionUi) — re-implemented
 * from measured behavior and architecture, not copied code.
 * @module @linxin666/dsh-client-ui-aionui-panel
 */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-subprocess'
import type {} from '@deepseek-ai/dsh-workspace'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { FsService } from './host/fs-service.ts'
import { GitService, subprocessRunner } from './host/git-service.ts'
import { createWorkspaceGate } from './host/gate.ts'
import { registerPanelRoutes } from './host/routes.ts'

/** Required services: the route registry, the managed subprocess seam, the workspace registry, and the prompt band. */
export const inject = ['webServer', 'subprocess', 'workspaceRegistry', 'systemPrompt']

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 210

/** Model-facing announcement: plugin presence, capabilities, and limits. */
export const AIONUI_PANEL_GUIDANCE = 'The dsh-aionui-panel plugin is installed (right-side panel system for the DSH Web GUI): when a project session is open, "Preview" and "Files/Changes" panels appear on the right of the chat area. Capabilities: Explorer file tree (click a file to open it in the preview panel, click a row to expand a folder, search files by name); Preview with multiple tabs (markdown / html / code / diff / csv / pdf / office / images / text etc., with source/preview switching, split-screen editing, and saving); SCM changes panel (real git stage/unstage/discard); panel widths are draggable (Explorer 220~500px, Preview 340~1200px), double-click a handle to reset the default width, and collapsed state and widths persist per project (localStorage). The data source is the real filesystem and real git repository of the current session working directory, served by the host process via /aionui-panel/* routes. When the user mentions "right panel / preview panel / file tree / changes panel", they mean this plugin — coordinate accordingly.'

/**
 * Mount the panel data services and their routes.
 * @param ctx - context carrying webServer, subprocess, workspaceRegistry, systemPrompt.
 */
export function apply(ctx: Context): void {
  const gate = createWorkspaceGate(ctx)
  const fs = new FsService(gate)
  const git = new GitService(subprocessRunner(ctx), gate, (root, rel) => fs.delete(root, rel))
  ctx.effect(() => registerPanelRoutes(ctx, fs, git), 'dsh-aionui-panel: /aionui-panel routes')
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'plugin:aionui-panel',
    order: SECTION_ORDER,
    text: AIONUI_PANEL_GUIDANCE,
  }), 'dsh-aionui-panel: prompt section')
}
