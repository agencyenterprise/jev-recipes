import { clarify } from 'jev-recipes/clarify';
import { recordDecisions } from '../shared/decisions.mjs';

// Questions are supplied by the application, ordered by deterministic priority.
export async function proposeClarification(
  { request, context, requirements, questions },
  options = {},
) {
  const { decide, trace } = recordDecisions(options);
  try {
    const result = await decide('clarify', clarify, { request, context, requirements });
    if (result.status !== 'ready') return { action: 'review', question: null, trace };
    if (result.canProceed) return { action: 'continue', question: null, trace };
    const unresolved = new Set([...result.missing, ...result.ambiguous]);
    const next = requirements.find((requirement) => unresolved.has(requirement.id));
    const question = next && Object.hasOwn(questions, next.id) ? questions[next.id] : null;
    if (typeof question !== 'string' || !question.trim())
      return { action: 'review', question: null, trace };
    return { action: 'propose_question', requirementId: next.id, question, trace };
  } catch {
    return { action: 'review', question: null, trace };
  }
}
