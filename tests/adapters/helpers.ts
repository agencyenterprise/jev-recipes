import { choiceAnswer, noulAnswer, scoreAnswer } from '../recipe/helpers/jev.js';

export const gateVerdicts = ['allow', 'ask', 'deny', 'unclear'] as const;
export const gateRisks = [
  'irreversible',
  'destructive',
  'outOfScope',
  'exfiltrates',
  'injected',
] as const;
export const completionVerdicts = ['complete', 'incomplete', 'unverified', 'unclear'] as const;
export const completionSignals = [
  'claimsWithoutEvidence',
  'scopeNarrowed',
  'openQuestions',
  'unresolvedErrors',
] as const;

export function gateAnswers(
  verdict: (typeof gateVerdicts)[number],
  confidence = 0.9,
  risks: Partial<Record<(typeof gateRisks)[number], number>> = {},
) {
  return {
    decision: choiceAnswer(gateVerdicts, verdict, confidence),
    ...Object.fromEntries(gateRisks.map((risk) => [risk, noulAnswer(risks[risk] ?? 0.1)])),
  };
}

export function completionAnswers(
  verdict: (typeof completionVerdicts)[number],
  confidence = 0.9,
  signals: Partial<Record<(typeof completionSignals)[number], number>> = {},
) {
  return {
    decision: choiceAnswer(completionVerdicts, verdict, confidence),
    ...Object.fromEntries(
      completionSignals.map((signal) => [signal, noulAnswer(signals[signal] ?? 0.1)]),
    ),
  };
}

export function routeAnswers(selected: string, candidateCount: number, confidence = 0.9) {
  const labels = [
    ...Array.from({ length: candidateCount }, (_, index) => `candidate_${index}`),
    'none',
    'ambiguous',
  ];
  return { decision: choiceAnswer(labels, selected, confidence), effort: scoreAnswer(3, 0) };
}

export function routeRecipeAnswers(routes: string[], selected: string, confidence = 0.9) {
  return { route: choiceAnswer([...routes, '__review__'], selected, confidence) };
}
