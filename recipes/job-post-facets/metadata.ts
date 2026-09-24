import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'job-post-facets',
  title: 'Label what a job posting states',
  description:
    'Which of these does posting state: salary or range, work location, remote policy, experience level, required qualifications?',
  category: 'workflow',
  tags: ['recruiting', 'job-posting', 'labels', 'multi-label', 'completeness'],
  useWhen:
    'You check job postings for completeness before publishing, or normalize scraped postings into structured fields.',
  related: [
    {
      id: 'clarify',
      reason: 'Use clarify to list which required details are missing or ambiguous in free text.',
    },
    {
      id: 'requirement-testability',
      reason:
        'Use requirement-testability to check whether a stated qualification can be verified.',
    },
  ],
  limitations: [
    'Labels report that a facet is stated, not its value. Extract the salary or location in code.',
    'Labels are independent, so a posting can carry several or none.',
    'Does not judge whether the stated details are lawful or accurate for the jurisdiction.',
  ],
} satisfies RecipeMetadata;
