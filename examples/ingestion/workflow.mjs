import { paragraphBoundary } from 'jev-recipes/paragraph-boundary';
import { textBlockRole } from 'jev-recipes/text-block-role';

export async function inspectTextBlock(block, neighbors = {}, options = {}) {
  const original = structuredClone(block);
  try {
    const decision = await textBlockRole({ text: original.text, ...neighbors }, options);
    return { original, decision, needsReview: decision.status === 'review' };
  } catch {
    return { original, decision: null, needsReview: true, reason: 'evaluation-failed' };
  }
}

export async function proposeParagraphJoin(left, right, options = {}) {
  const originals = structuredClone([left, right]);
  try {
    const decision = await paragraphBoundary({ left: left.text, right: right.text }, options);
    const canJoin = decision.status === 'ready' && decision.verdict === 'continue';
    return { originals, decision, operation: canJoin ? 'join' : 'preserve-boundary' };
  } catch {
    return {
      originals,
      decision: null,
      operation: 'preserve-boundary',
      reason: 'evaluation-failed',
    };
  }
}
