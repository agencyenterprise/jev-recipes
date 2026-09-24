import { appealGroundsKind } from '../../recipes/appeal-grounds-kind/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  appealGroundsKind,
  {
    appeal:
      "I am appealing the denial dated September 3. The letter says my household income is $4,200 per month, which is over the limit. That number includes my adult son's wages, but he moved out in March and no longer lives with me; I told the office this at my interview. My actual household income is my own $2,600 per month. Please correct the income figure and reconsider my application.",
  },
  [
    'factual_error',
    'procedural_error',
    'new_evidence',
    'hardship',
    'misapplied_rule',
    'other',
    'unclear',
  ],
);
