import { textBlockRole } from '../../recipes/text-block-role/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  textBlockRole,
  { text: 'Installation' },
  ['heading', 'body', 'list_item', 'code', 'table', 'caption', 'formula', 'other', 'unclear'],
  ['before', 'after', 'context'],
);
