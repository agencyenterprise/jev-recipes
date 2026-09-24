import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'trip-purpose-kind',
  title: 'Identify the purpose of a trip',
  description:
    "What purpose does the traveler's message express for the trip: business, leisure, a family visit, medical care, relocation, or attending an event?",
  category: 'conversation',
  tags: ['travel', 'hospitality', 'intent', 'classification', 'conversation', 'trip-purpose'],
  useWhen:
    "A travel assistant needs to route a traveler's message to the right search defaults, policy, or recommendations based on why they are traveling, using only what the message and any prior context say.",
  related: [
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent to classify what a message is doing conversationally, such as requesting or correcting, rather than why the person is traveling.',
    },
    {
      id: 'buying-intent',
      reason:
        'Use buying-intent to judge how close the traveler is to booking; this recipe identifies only the reason for the trip.',
    },
  ],
  limitations: [
    'Names the primary purpose the wording expresses. Mixed trips return the dominant purpose or unclear; it does not split a trip into segments.',
    'Does not verify the stated purpose or infer one the traveler did not express. Corporate travel policy and eligibility decisions belong in application code.',
  ],
} satisfies RecipeMetadata;
