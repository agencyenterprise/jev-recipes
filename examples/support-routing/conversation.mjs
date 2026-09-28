import { clarify } from 'jev-recipes/clarify';
import { proposeSupportRoute } from './workflow.mjs';
import { routingOptionsSchema } from './schema.mjs';
import { conversationOutcomeSchema, prepareConversation } from './conversation-schema.mjs';

// The application supplies the full conversation on every turn and executes proposals itself.
export async function proposeSupportNextStep(value, configuration, options) {
  const { input, config, request } = prepareConversation(value, configuration);
  const settings = routingOptionsSchema.parse(options);
  settings.signal?.throwIfAborted();
  const trace = [];

  if (config.requirements.length) {
    let result;
    try {
      result = await clarify(
        {
          request,
          requirements: config.requirements.map(({ id, description }) => ({ id, description })),
          minConfidence: config.minConfidence,
        },
        settings,
      );
    } catch (error) {
      settings.signal?.throwIfAborted();
      if (error?.name === 'AbortError') throw error;
      trace.push({ stage: 'clarification', status: 'failed' });
      return review('clarification-failed', trace);
    }
    settings.signal?.throwIfAborted();
    trace.push({
      stage: 'clarification',
      status: result.status,
      model: result.model,
      checks: result.checks.map(({ id, verdict, status }) => ({ id, verdict, status })),
    });
    if (result.status !== 'ready') return review('clarification-uncertain', trace);
    const unresolved = result.checks.filter((check) => check.verdict !== 'present');
    if (
      unresolved.some((check) => input.answers.some((answer) => answer.requirementId === check.id))
    )
      return review('unresolved-answer', trace);
    if (!result.canProceed) {
      if (input.answers.length >= config.maxQuestions) return review('question-limit', trace);
      const next = config.requirements.find((item) =>
        unresolved.some((check) => check.id === item.id),
      );
      return conversationOutcomeSchema.parse({
        action: 'propose_question',
        route: null,
        question: next.question,
        requirementId: next.id,
        reason: result.ambiguous.includes(next.id)
          ? 'ambiguous-information'
          : 'missing-information',
        trace,
      });
    }
  }

  const proposal = await proposeSupportRoute(
    {
      request,
      routes: config.routes,
      minConfidence: config.minConfidence,
    },
    settings,
  );
  trace.push(
    ...proposal.trace.map((attempt) => {
      const failed = Object.hasOwn(attempt, 'error');
      return {
        stage: attempt.stage,
        status: failed ? 'failed' : attempt.result.status,
        model: failed ? undefined : attempt.result.model,
        route: failed ? null : attempt.result.route,
      };
    }),
  );
  return conversationOutcomeSchema.parse({
    action: proposal.status === 'ready' ? 'propose_route' : 'review',
    route: proposal.route,
    question: null,
    requirementId: null,
    reason: proposal.reason,
    trace,
  });
}

function review(reason, trace) {
  return conversationOutcomeSchema.parse({
    action: 'review',
    route: null,
    question: null,
    requirementId: null,
    reason,
    trace,
  });
}
