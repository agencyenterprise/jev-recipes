import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instruction-clarity',
  title: 'Grade instruction clarity',
  description:
    'How unambiguous is instruction for a delegate who has only context, on a five-level rubric?',
  category: 'workflow',
  tags: ['agent', 'delegation', 'instruction', 'clarity', 'score'],
  useWhen:
    'You need to grade an instruction before sending it to a sub-agent or teammate, so an orchestrator can rewrite it or ask a question instead of letting the delegate guess.',
  related: [
    {
      id: 'query-specificity',
      reason:
        'Use query-specificity to grade how narrowly a search query pins down what is wanted, rather than how clearly an instruction directs work.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to list the specific questions a delegate would need answered when the instruction grades below clear.',
    },
  ],
  limitations: [
    "Grades ambiguity from the delegate's point of view using only instruction and context. It cannot know what the delegate already knows unless context says so.",
    "Reports how clear the instruction is, not whether the instructed work is sensible, safe, or within the delegate's abilities.",
  ],
} satisfies RecipeMetadata;
