import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'narrative-consistency',
  title: 'Check a narrative for internal contradictions',
  description:
    'Are the statements within narrative consistent with each other in timeline, cause, and extent, with no statement contradicting another in the same account?',
  category: 'knowledge',
  tags: ['insurance', 'claims', 'consistency', 'contradiction', 'narrative', 'gate'],
  useWhen:
    'A claims, incident, or intake system receives a single free-form account and needs to flag accounts that contradict themselves before a person reviews them or a downstream step relies on them.',
  related: [
    {
      id: 'evidence-conflict',
      reason:
        'Use evidence-conflict when you have two separate passages and need to know whether they conflict about a question; this recipe checks one account against itself.',
    },
    {
      id: 'answer-consistency',
      reason:
        'Use answer-consistency to compare two discrete statements rather than to scan a single narrative for internal contradictions.',
    },
  ],
  limitations: [
    'Checks internal consistency only. A narrative can be perfectly consistent and false, or contain a contradiction that is an innocent slip; it does not judge truth, credibility, or intent.',
    'Judges wording. Exact date arithmetic, unit conversions, and comparisons against external records belong in application code.',
  ],
} satisfies RecipeMetadata;
