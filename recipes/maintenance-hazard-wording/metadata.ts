import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'maintenance-hazard-wording',
  title: 'Flag a maintenance request that describes a safety hazard',
  description:
    'Does request describe a safety hazard such as a gas smell, active water intrusion, exposed wiring, structural damage, no heat in cold weather, or a blocked exit?',
  category: 'support',
  tags: ['property-management', 'maintenance', 'safety', 'triage', 'gate', 'hazard'],
  useWhen:
    'You need to pull tenant maintenance requests that describe a hazard out of the routine queue for immediate dispatch, based on what the request says before anyone inspects.',
  related: [
    {
      id: 'urgency-signal',
      reason:
        'Use urgency-signal to detect whether the tenant explicitly asks for urgent attention, rather than whether the described problem is a hazard regardless of how it is asked.',
    },
    {
      id: 'issue-impact',
      reason:
        'Use issue-impact to grade how badly a reported problem affects the reporter, rather than whether it is a safety hazard.',
    },
  ],
  limitations: [
    'Judges the wording of the request, not the actual condition of the property. Only an inspection establishes whether a hazard exists.',
    'Applies a fixed set of hazard types drawn from common habitability standards; local codes and lease obligations belong in application rules.',
    'Does not rank hazards against each other or decide dispatch timing.',
  ],
} satisfies RecipeMetadata;
