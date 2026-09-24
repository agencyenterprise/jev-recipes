import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'sound-match',
  title: 'Check a patch against a requested sound',
  description:
    'Does the patch or preset described in patch deliver the sound character asked for in request?',
  category: 'knowledge',
  tags: ['music', 'synth', 'presets', 'sound-design', 'gate', 'matching'],
  useWhen:
    'You are building a preset browser, sound search, or patch recommender and need to check whether a candidate patch description actually delivers what the user asked for before showing or loading it.',
  related: [
    {
      id: 'product-match',
      reason:
        'Use product-match to check a product listing against a shopping request, rather than a synth patch against a described sound.',
    },
    {
      id: 'audience-fit',
      reason:
        'Use audience-fit to judge whether content suits a described audience, rather than whether a patch produces a described sound.',
    },
  ],
  limitations: [
    'Judges the patch as described in text, not as it sounds. A description can be inaccurate or incomplete, and parameter values only imply a sound.',
    'A mismatched verdict does not say which quality is missing or how to adjust the patch.',
    'Does not consider the synth, plugin, or sample library the patch needs, or whether the user has it.',
  ],
} satisfies RecipeMetadata;
