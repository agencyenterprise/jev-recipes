import { answerGrade } from '../../recipes/answer-grade/index.js';
import { testScore } from './helpers/score.js';

testScore(
  answerGrade,
  {
    question: 'Explain why the sky appears blue during the day.',
    answer:
      'Gas molecules in the atmosphere scatter shorter wavelengths like blue more than longer ones, so blue reaches our eyes from all directions.',
    rubric:
      'Full credit: sunlight has many wavelengths; molecules scatter light; shorter wavelengths scatter more; explains why violet is not dominant.',
  },
  ['none', 'minimal', 'partial', 'mostly', 'full'],
  'grade',
);
