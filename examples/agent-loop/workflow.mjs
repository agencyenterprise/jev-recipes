import { modelRoute } from 'jev-recipes/model-route';
import { contextPrune } from 'jev-recipes/context-prune';
import { progressStall } from 'jev-recipes/progress-stall';
import { retryWorthwhile } from 'jev-recipes/retry-worthwhile';
import { toolCallGate } from 'jev-recipes/tool-call-gate';
import { completionGate } from 'jev-recipes/completion-gate';
import { recordDecisions } from '../shared/decisions.mjs';

export async function advanceAgent(state, options = {}) {
  validateContext(state);
  const { decide, trace } = recordDecisions(options);
  const finish = (nextAction, details = {}) => ({
    nextAction,
    state: structuredClone(state),
    trace,
    ...details,
  });
  if (state.attempts >= state.maxAttempts && !state.completion)
    return finish('stop', { reason: 'Application attempt limit reached.' });
  try {
    const routing = await decide('model-route', modelRoute, {
      request: state.objective,
      models: state.models,
    });
    if (routing.status !== 'ready' || !routing.selection)
      return finish('review', { reason: 'No model can be selected confidently.' });

    const pruning = await decide('context-prune', contextPrune, {
      objective: state.objective,
      items: state.context.map(({ id, text }) => ({ id, text })),
      recent: state.transcript,
    });
    const retained = retainDependencies(state.context, pruning.keep);
    const progress = await decide('progress-stall', progressStall, {
      objective: state.objective,
      transcript: state.transcript,
    });
    if (progress.status !== 'ready') return finish('review', { reason: 'Progress is uncertain.' });
    if (progress.verdict === 'stalled') {
      if (!state.lastFailure)
        return finish('review', {
          reason: 'The loop stalled without a failure that can justify retrying.',
        });
      const retry = await decide('retry-worthwhile', retryWorthwhile, {
        failure: state.lastFailure,
        attempt: state.transcript,
      });
      if (retry.status !== 'ready')
        return finish('review', { reason: 'Retry value is uncertain.' });
      if (retry.verdict === 'stop')
        return finish('stop', { reason: 'Repeating the attempt is not worthwhile.' });
    }

    if (state.completion) {
      const completion = await decide('completion-gate', completionGate, {
        task: state.objective,
        ...state.completion,
      });
      if (completion.status !== 'ready')
        return finish('review', { reason: 'Completion needs review.' });
      if (completion.verdict === 'complete') return finish('complete');
      return finish('verify', { reason: completion.verdict, retainedContext: retained });
    }

    if (state.toolCall) {
      const permission = await decide('tool-call-gate', toolCallGate, {
        request: state.objective,
        toolCall: state.toolCall,
        context: state.transcript,
        policy: state.policy,
      });
      if (permission.status !== 'ready' || permission.action === 'ask')
        return finish('review', { reason: 'The proposed tool call needs approval.' });
      if (permission.action === 'deny')
        return finish('stop', { reason: 'The proposed tool call is denied.' });
      return finish('execute_tool', {
        toolCall: state.toolCall,
        retainedContext: retained,
        state: { ...structuredClone(state), attempts: state.attempts + 1 },
      });
    }
    return finish('generate', {
      model: routing.selection,
      effort: routing.effort,
      retainedContext: retained,
      state: { ...structuredClone(state), attempts: state.attempts + 1 },
    });
  } catch {
    return finish('review', { reason: 'A decision failed. The application paused before acting.' });
  }
}

export function retainDependencies(items, keep) {
  const retained = new Set(keep);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      if (!retained.has(item.id)) continue;
      const dependencies = [
        ...(item.requires ?? []),
        ...items.filter((other) => item.pair && other.pair === item.pair).map((other) => other.id),
      ];
      for (const id of dependencies)
        if (!retained.has(id)) {
          retained.add(id);
          changed = true;
        }
    }
  }
  return items.filter((item) => retained.has(item.id));
}

function validateContext(state) {
  if (
    !Number.isInteger(state.attempts) ||
    !Number.isInteger(state.maxAttempts) ||
    state.attempts < 0 ||
    state.maxAttempts < 1
  )
    throw new Error(
      'Application attempt limits must be nonnegative integers with maxAttempts at least one.',
    );
  const ids = new Set(state.context.map((item) => item.id));
  if (ids.size !== state.context.length) throw new Error('Context IDs must be unique.');
  for (const item of state.context)
    for (const id of item.requires ?? [])
      if (!ids.has(id)) throw new Error(`Missing context dependency: ${id}`);
}
