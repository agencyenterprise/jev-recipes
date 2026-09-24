import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'itinerary-feasibility',
  title: 'Check whether an itinerary is feasible in sequence',
  description:
    'Can the consecutive items in itinerary be carried out in the order described: enough transfer time between them, each location reachable from the previous one, and no overlapping commitments?',
  category: 'workflow',
  tags: ['travel', 'itinerary', 'scheduling', 'feasibility', 'hospitality', 'gate'],
  useWhen:
    'A travel or concierge assistant has drafted or received a day-by-day itinerary in plain language and needs a yes/no sanity check that the sequence hangs together before presenting or booking it.',
  related: [
    {
      id: 'slot-fit',
      reason:
        'Use slot-fit to check one proposed time against stated availability constraints rather than a whole sequence of items against each other.',
    },
    {
      id: 'clause-conflict',
      reason:
        'Use clause-conflict when the question is whether two written requirements can both be satisfied, rather than whether a sequence of timed items can be carried out.',
    },
  ],
  limitations: [
    'Judges the wording of the itinerary: stated times, places, and durations. Compute exact travel times, distances, and time zone conversions in application code; the recipe does not know real transit schedules.',
    'Takes the itinerary as written. It does not know about opening hours, booking availability, or delays not mentioned in itinerary.',
  ],
} satisfies RecipeMetadata;
