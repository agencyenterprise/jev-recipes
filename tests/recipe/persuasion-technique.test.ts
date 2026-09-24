import { persuasionTechnique } from '../../recipes/persuasion-technique/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  persuasionTechnique,
  { message: 'Only 3 seats left at this price, and the offer closes at midnight tonight.' },
  ['authority', 'scarcity', 'social_proof', 'reciprocity', 'emotional_appeal', 'none', 'unclear'],
  ['context'],
);
