/**
 * Official session event projection — pure. Maps the durable DSH session
 * vocabulary onto the pet's visual phases and carries an optional completed-
 * turn reward for the ledger. Holds no state of its own; callers keep a
 * {@link ProjectionRuntime} per session and feed events in arrival order.
 * @module @linxin666/dsh-pet/event-projection
 */

import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { PetStateInput } from './state.ts'

/** Runtime shape of the optional legacy activity event. */
export interface ActivityStatusEventLike {
  phase?: string
  line?: string
  phrase?: string
}

/** Per-session facts needed to project the official event stream. */
export interface ProjectionRuntime {
  activeTools: Set<string>
  officialEventsSeen: boolean
  stepHadFailure: boolean
}

/** One official event projection, optionally carrying a completed turn reward. */
export interface PetActivityTransition {
  input: PetStateInput
  completedTurn?: number
}

/** Fresh projection runtime for a newly seen session. */
export function emptyProjectionRuntime(): ProjectionRuntime {
  return { activeTools: new Set(), officialEventsSeen: false, stepHadFailure: false }
}

/** Keep tool names readable inside the compact status bubble. */
function displayToolName(name: string): string {
  const compact = name.replace(/\s+/g, ' ').trim() || 'Tool'
  return compact.length <= 24 ? compact : `${compact.slice(0, 21)}...`
}

/** Whether a legacy phase is part of the pet's supported vocabulary. */
export function isActivityPhase(phase: string): phase is PetStateInput['phase'] {
  return ['idle', 'waiting', 'thinking', 'tool', 'review', 'done', 'failed'].includes(phase)
}

/**
 * Project the durable DSH session vocabulary into the pet's visual phases.
 * Unknown and log-only events do not disturb the last meaningful activity.
 */
export function projectOfficialEvent(
  event: SessionEvent,
  runtime: ProjectionRuntime,
): PetActivityTransition | undefined {
  switch (event.type) {
    case 'turn/start':
      runtime.activeTools.clear()
      runtime.stepHadFailure = false
      return { input: { phase: 'waiting', line: 'Getting ready' } }
    case 'step/start':
      runtime.activeTools.clear()
      runtime.stepHadFailure = false
      return { input: { phase: 'waiting', line: 'Waiting for the model' } }
    case 'assistant/chunk': {
      const { chunk } = event.data
      if (chunk.type === 'reasoning-delta' && chunk.text.length > 0) {
        return { input: { phase: 'thinking', line: 'Thinking' } }
      }
      if (chunk.type === 'text-delta' && chunk.text.length > 0) {
        return { input: { phase: 'review', line: 'Assembling reply' } }
      }
      return undefined
    }
    case 'assistant/message':
      return { input: { phase: 'review', line: 'Assembling reply' } }
    case 'tool/call':
      runtime.activeTools.add(String(event.data.callId))
      return {
        input: {
          phase: 'tool',
          line: `Using ${displayToolName(event.data.name)}`,
        },
      }
    case 'tool/result': {
      const block = event.data.message.content[0]
      runtime.activeTools.delete(String(event.data.message.source.callId))
      runtime.stepHadFailure ||= event.data.error !== undefined || block.isError === true
      if (runtime.activeTools.size > 0) {
        return {
          input: {
            phase: 'tool',
            line: `${runtime.activeTools.size} tools still running`,
          },
        }
      }
      return runtime.stepHadFailure
        ? { input: { phase: 'failed', line: 'Tool failed' } }
        : { input: { phase: 'thinking', line: 'Processing tool result' } }
    }
    case 'turn/end': {
      runtime.activeTools.clear()
      switch (event.data.reason.kind) {
        case 'completed':
          return {
            input: { phase: 'done', line: 'Done!' },
            completedTurn: event.data.turn,
          }
        case 'error':
          return { input: { phase: 'failed', line: 'Execution failed' } }
        case 'max-tokens':
          return { input: { phase: 'failed', line: 'Output limit reached' } }
        case 'interrupted':
          return { input: { phase: 'failed', line: 'Execution interrupted' } }
        case 'blocked':
          return { input: { phase: 'waiting', line: 'Waiting to continue' } }
        case 'aborted':
          return { input: { phase: 'idle', line: 'Stopped' } }
        default:
          // TurnEndReasonMap is merge-extensible; a newer ending must not
          // leave the pet showing stale in-progress work.
          return { input: { phase: 'idle' } }
      }
    }
    default:
      return undefined
  }
}
