import { objectiveFit } from '../../recipes/objective-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  objectiveFit,
  {
    objective: 'Apply Newton’s second law to compute net force from mass and acceleration.',
    question: 'A 4 kg cart accelerates at 2.5 m/s². What is the net force acting on it?',
  },
  ['assesses', 'misses'],
);
