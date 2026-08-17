/**
 * Slash commands for the SSH engine: /ssh, /ssh-hosts, /ssh-tunnel,
 * /ssh-cluster. They drive the same engine as the sidebar panel and the
 * agent tools, so a host configured once works from everywhere — no
 * clicking in the panel needed. Commands are registered through the host
 * `commands` service and surface in the GUI chat input when the user types
 * a leading slash.
 */

import type { CommandDefinition } from '@deepseek-ai/dsh-commands'
import type { SshEngine } from './engine.ts'
import type { TunnelInfo } from './protocol.ts'
import { renderCluster, renderExec, renderHosts, renderTunnel } from './tools.ts'

/** Usage lines shown on argument errors. */
const USAGE = {
  ssh: '/ssh <alias> <command>',
  'ssh-hosts': '/ssh-hosts [query]',
  'ssh-tunnel': '/ssh-tunnel start <alias> <remotePort> [localPort] | list | stop <id> | stop-all [alias]',
  'ssh-cluster': '/ssh-cluster <command> [--alias a[,b]] [--env <environment>] [--tag <tag>]',
} as const

/** Split "<alias> <rest...>" — the alias is the first whitespace token. */
function splitAlias(rawInput: string): { alias: string | undefined; rest: string } {
  const trimmed = rawInput.trim()
  const space = trimmed.indexOf(' ')
  if (space === -1) return { alias: undefined, rest: trimmed }
  return { alias: trimmed.slice(0, space), rest: trimmed.slice(space + 1).trim() }
}

/** Render tunnels one per line (multi-line when several). */
function renderTunnels(tunnels: TunnelInfo[]): string {
  if (tunnels.length === 0) return 'no tunnels'
  return tunnels.map(renderTunnel).join('\n')
}

/** Human-readable failure text for an engine throw. */
function failureText(action: string, error: unknown): string {
  return `${action}: ${error instanceof Error ? error.message : String(error)}`
}

/**
 * Build the SSH slash commands over one engine. Registration order matches
 * the order the GUI menu shows for equal-scope commands.
 */
export function sshCommandDefinitions(engine: SshEngine): CommandDefinition[] {
  return [
    {
      name: 'ssh',
      description: 'выполнить команду на SSH-хосте',
      input: { hint: '<alias> <command>' },
      handler: async ({ rawInput }) => {
        const { alias, rest } = splitAlias(rawInput)
        if (alias === undefined || rest === '') return { kind: 'error', text: `usage: ${USAGE.ssh}` }
        try {
          const result = await engine.exec(alias, rest)
          return result.error !== undefined
            ? { kind: 'error', text: renderExec(result) }
            : { kind: 'success', text: renderExec(result) }
        } catch (error) {
          return { kind: 'error', text: failureText(`ssh ${alias}`, error) }
        }
      },
    },
    {
      name: 'ssh-hosts',
      description: 'список настроенных SSH-хостов',
      input: { hint: '[query]' },
      handler: ({ rawInput }) => {
        const query = rawInput.trim()
        return { kind: 'success', text: renderHosts(engine.list(query === '' ? undefined : query)) }
      },
    },
    {
      name: 'ssh-tunnel',
      description: 'локальный проброс порта через SSH-хост',
      input: { hint: 'start <alias> <remotePort> [localPort] | list | stop <id> | stop-all [alias]' },
      handler: async ({ rawInput }) => {
        const [verb, ...args] = rawInput.trim().split(/\s+/)
        switch (verb) {
          case 'start': {
            const [alias, remotePort, localPort] = args
            if (alias === undefined || remotePort === undefined) {
              return { kind: 'error', text: `usage: ${USAGE['ssh-tunnel']}` }
            }
            const remote = Number(remotePort)
            if (!Number.isInteger(remote) || remote <= 0 || remote > 65535) {
              return { kind: 'error', text: `invalid remote port: ${remotePort}` }
            }
            const local = Number(localPort)
            try {
              const tunnel = await engine.startTunnel(alias, {
                remotePort: remote,
                ...(localPort !== undefined && Number.isInteger(local) && local > 0 && local <= 65535 ? { localPort: local } : {}),
              })
              return tunnel.state === 'failed'
                ? { kind: 'error', text: renderTunnel(tunnel) }
                : { kind: 'success', text: renderTunnel(tunnel) }
            } catch (error) {
              return { kind: 'error', text: failureText(`ssh-tunnel start ${alias}`, error) }
            }
          }
          case 'list':
            return { kind: 'success', text: renderTunnels(engine.listTunnels()) }
          case 'stop': {
            const id = args[0]
            if (id === undefined) return { kind: 'error', text: `usage: ${USAGE['ssh-tunnel']}` }
            return engine.stopTunnel(id)
              ? { kind: 'success', text: `tunnel ${id} stopped` }
              : { kind: 'error', text: `tunnel ${id} not found` }
          }
          case 'stop-all': {
            const count = engine.stopAllTunnels(args[0])
            return { kind: 'success', text: `stopped ${count} tunnel${count === 1 ? '' : 's'}` }
          }
          default:
            return { kind: 'error', text: `usage: ${USAGE['ssh-tunnel']}` }
        }
      },
    },
    {
      name: 'ssh-cluster',
      description: 'выполнить команду на группе SSH-хостов',
      input: { hint: '<command> [--alias a[,b]] [--env <environment>] [--tag <tag>]' },
      handler: async ({ rawInput }) => {
        const tokens = rawInput.trim().split(/\s+/).filter(token => token !== '')
        const aliases: string[] = []
        const tags: string[] = []
        let environment: string | undefined
        const command: string[] = []
        let index = 0
        while (index < tokens.length) {
          const token = tokens[index]
          if (token === '--alias' || token === '--env' || token === '--tag') {
            const value = tokens[index + 1]
            if (value === undefined) return { kind: 'error', text: `${token} requires a value` }
            const parts = value.split(',').map(part => part.trim()).filter(part => part !== '')
            if (token === '--alias') aliases.push(...parts)
            if (token === '--tag') tags.push(...parts)
            if (token === '--env') environment = value
            index += 2
          } else {
            command.push(token)
            index += 1
          }
        }
        const text = command.join(' ')
        if (text === '') return { kind: 'error', text: `usage: ${USAGE['ssh-cluster']}` }
        try {
          const results = await engine.cluster({
            command: text,
            ...(aliases.length > 0 ? { aliases } : {}),
            ...(environment !== undefined ? { environment } : {}),
            ...(tags.length > 0 ? { tags } : {}),
          })
          return { kind: 'success', text: renderCluster(results) }
        } catch (error) {
          return { kind: 'error', text: failureText('ssh-cluster', error) }
        }
      },
    },
  ]
}
