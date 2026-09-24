import { causalLanguageStrength } from '../../recipes/causal-language-strength/index.js';
import { testScore } from './helpers/score.js';

testScore(
  causalLanguageStrength,
  {
    statement:
      'Adolescents who reported more screen time in the hour before bed also reported poorer sleep quality (r = 0.31, p < .001). Because the data are cross-sectional, our design does not permit causal conclusions.',
  },
  ['none', 'association', 'suggestive', 'hedged', 'asserted'],
  'causality',
);
