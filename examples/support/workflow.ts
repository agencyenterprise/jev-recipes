import { handoff } from '../../recipes/handoff/index.js';
import { clarify } from '../../recipes/clarify/index.js';
import { route } from '../../recipes/route/index.js';
import { rerank } from '../../recipes/rerank/index.js';
import { answerability } from '../../recipes/answerability/index.js';
import { verify } from '../../recipes/verify/index.js';
import type { RecipeOptions } from '../../src/schema.js';
import { supportInputSchema, supportDraftSchema } from './schema.js';
import type {
  SupportInput,
  SupportDraftContext,
  SupportDraft,
  SupportDecisions,
  SupportResult,
} from './schema.js';

export async function answerSupportRequest(
  input: SupportInput,
  draftAnswer: (context: SupportDraftContext) => Promise<SupportDraft>,
  options: RecipeOptions = {},
): Promise<SupportResult> {
  const request = supportInputSchema.parse(input);
  const { minConfidence = 0.8, minRelevance = 0.5, topK = 5 } = request;
  const context = request.context ?? '';
  const decisions: SupportDecisions = {};

  decisions.handoff = await handoff(
    {
      request: request.request,
      ...(context ? { context } : {}),
      rules: request.handoffRules,
      minConfidence,
    },
    options,
  );
  if (decisions.handoff.decision !== 'continue') {
    return { outcome: decisions.handoff.decision, stage: 'handoff', decisions };
  }

  decisions.clarify = await clarify(
    {
      request: request.request,
      ...(context ? { context } : {}),
      requirements: request.requirements,
      minConfidence,
    },
    options,
  );
  if (!decisions.clarify.canProceed) {
    return {
      outcome: decisions.clarify.status === 'review' ? 'review' : 'clarification',
      stage: 'clarify',
      decisions,
    };
  }

  const question = context
    ? `${request.request}\n\nConversation context:\n${context}`
    : request.request;
  decisions.route = await route(
    { request: question, routes: request.routes, minConfidence },
    options,
  );
  if (decisions.route.route === null) return { outcome: 'review', stage: 'route', decisions };
  if (request.evidence.length === 0) return { outcome: 'no_evidence', stage: 'rerank', decisions };

  decisions.rerank = await rerank(
    { query: question, items: request.evidence, minRelevance, topK },
    options,
  );
  if (decisions.rerank.items.length === 0)
    return { outcome: 'no_evidence', stage: 'rerank', decisions };
  const evidence = decisions.rerank.items.map(({ id, text }) => ({ id, text }));

  decisions.answerability = await answerability({ question, evidence, minConfidence }, options);
  if (!decisions.answerability.canAnswer) {
    return {
      outcome: decisions.answerability.status === 'review' ? 'review' : 'cannot_answer',
      stage: 'answerability',
      decisions,
    };
  }

  const draftContext = {
    request: request.request,
    ...(context ? { context } : {}),
    route: decisions.route.route,
    evidence,
  };
  const draft = validateDraftEvidence(await draftAnswer(draftContext), evidence);
  decisions.verify = await verify(
    { claims: pairClaimsWithEvidence(draft, evidence), minConfidence },
    options,
  );
  if (!decisions.verify.allSupported) return { outcome: 'unverified', stage: 'verify', decisions };

  return {
    outcome: 'answered',
    answer: draft.claims.map((claim) => claim.claim).join('\n\n'),
    draft,
    decisions,
  };
}

function validateDraftEvidence(
  draft: unknown,
  evidence: SupportDraftContext['evidence'],
): SupportDraft {
  const selectedIds = new Set(evidence.map((item) => item.id));
  return supportDraftSchema
    .refine(
      (candidate) =>
        candidate.claims.every((claim) => claim.evidenceIds.every((id) => selectedIds.has(id))),
      'Draft claims may reference only selected evidence IDs.',
    )
    .parse(draft);
}

function pairClaimsWithEvidence(draft: SupportDraft, evidence: SupportDraftContext['evidence']) {
  const evidenceById = new Map(evidence.map((item) => [item.id, item.text]));
  return draft.claims.map(({ id, claim, evidenceIds }) => ({
    id,
    claim,
    evidence: evidenceIds.map((evidenceId) => evidenceById.get(evidenceId)).join('\n\n'),
  }));
}
