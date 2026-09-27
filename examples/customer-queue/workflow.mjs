import { route } from 'jev-recipes/route';
import { routeMany } from 'jev-recipes/route-many';
import { handoff } from 'jev-recipes/handoff';
import { followupLink } from 'jev-recipes/followup-link';
import { responseNeeded } from 'jev-recipes/response-needed';
import { promiseCheck } from 'jev-recipes/promise-check';
import { contactOptOut } from 'jev-recipes/contact-opt-out';
import { followupTiming } from 'jev-recipes/followup-timing';
import { callbackResponsibility } from 'jev-recipes/callback-responsibility';
import { recordDecisions } from '../shared/decisions.mjs';

export async function processCustomerQueue(state, messages, options = {}) {
  const nextState = structuredClone(state);
  const pending = messages.filter((message) => !state.seenMessageIds.includes(message.id));
  if (new Set(messages.map((message) => message.id)).size !== messages.length)
    throw new Error('Message IDs must be unique.');
  const { decide, trace } = recordDecisions(options);
  const proposals = [];
  if (!pending.length) return { state: nextState, proposals, trace };
  let routing;
  try {
    routing = await decide('route-many', routeMany, {
      requests: pending.map(({ id, text }) => ({ id, text })),
      routes: state.routes,
    });
  } catch {
    return {
      state: nextState,
      proposals: pending.map((message) => ({
        messageId: message.id,
        action: 'review',
        reason: 'Batch routing failed.',
      })),
      trace,
    };
  }
  for (const message of pending) {
    try {
      const proposal = await proposeNextStep(
        nextState,
        message,
        routing.items.find((item) => item.id === message.id),
        decide,
      );
      proposals.push({ messageId: message.id, ...proposal });
      if (proposal.action !== 'review') nextState.seenMessageIds.push(message.id);
    } catch {
      proposals.push({
        messageId: message.id,
        action: 'review',
        reason: 'A decision failed. No customer action was taken.',
      });
    }
  }
  return { state: nextState, proposals, trace };
}

async function proposeNextStep(state, message, routing, decide) {
  const context = message.context ?? 'No earlier exchange was supplied.';
  const restriction = await decide('contact-opt-out', contactOptOut, {
    message: message.text,
    context,
  });
  if (restriction.status !== 'ready')
    return { action: 'review', reason: 'Contact preference is unclear.' };
  if (restriction.verdict === 'all_contact') {
    state.contactBlocked = true;
    return { action: 'record_opt_out', scope: 'all_contact', originalMessage: message.text };
  }
  if (restriction.verdict !== 'none')
    return {
      action: 'review',
      reason: 'Map the expressed contact restriction to the exact channel or campaign.',
      scope: restriction.verdict,
      originalMessage: message.text,
    };
  if (state.contactBlocked)
    return {
      action: 'keep_contact_blocked',
      reason: 'The message does not clear a stored opt-out.',
    };

  let linkedRequest;
  if (state.requests.length) {
    const link = await decide('followup-link', followupLink, {
      message: message.text,
      requests: state.requests.map(({ id, text }) => ({ id, text })),
      context,
    });
    if (link.status !== 'ready')
      return { action: 'review', reason: 'The earlier request is ambiguous.' };
    linkedRequest = state.requests.find((request) => request.id === link.selection);
  }
  const reply = await decide('response-needed', responseNeeded, { message: message.text, context });
  if (reply.status !== 'ready') return { action: 'review', reason: 'Reply need is unclear.' };
  if (reply.verdict === 'no_reply_needed')
    return {
      action: 'acknowledgment',
      requestId: linkedRequest?.id,
      owner: linkedRequest?.owner ?? null,
      reason: 'No substantive reply is needed; preserve the current handover.',
    };

  let owner = linkedRequest?.owner ?? routing?.route;
  if (linkedRequest) {
    const rerouted = await decide('route', route, {
      request: `${linkedRequest.text}\nFollow-up: ${message.text}`,
      routes: state.routes,
    });
    if (rerouted.status !== 'ready')
      return { action: 'review', reason: 'The contextual route is unclear.' };
    owner = linkedRequest.owner ?? rerouted.route;
  } else if (routing?.status !== 'ready')
    return { action: 'review', reason: 'The queue route is unclear.' };

  if (!linkedRequest?.handoverCompleted) {
    const transfer = await decide('handoff', handoff, {
      request: message.text,
      context,
      rules: state.handoffRules,
    });
    if (transfer.status !== 'ready')
      return { action: 'review', reason: 'Handover need is unclear.' };
    if (transfer.decision === 'human')
      return {
        action: 'propose_handover',
        owner,
        requestId: linkedRequest?.id,
        matchedRules: transfer.matchedRules,
      };
  }

  const timing = await decide('followup-timing', followupTiming, {
    message: message.text,
    context,
  });
  const callback = await decide('callback-responsibility', callbackResponsibility, {
    conversation: `${context}\nCustomer: ${message.text}`,
    roles: message.roles ?? 'Business is the business representative. Customer is the customer.',
  });
  if (timing.status !== 'ready' || callback.status !== 'ready')
    return { action: 'review', reason: 'Follow-up timing or callback ownership is unclear.' };
  if (message.proposedReply) {
    const promise = await decide('promise-check', promiseCheck, {
      reply: message.proposedReply,
      allowedCommitments: state.allowedCommitments,
    });
    if (promise.status !== 'ready' || promise.verdict !== 'within_commitments')
      return {
        action: 'review',
        reason: 'The proposed reply contains an unsupported or unclear commitment.',
      };
  }
  return {
    action: 'propose_next_step',
    owner,
    requestId: linkedRequest?.id,
    followup: timing.verdict,
    callback: callback.verdict,
    draft: message.proposedReply ?? null,
  };
}
