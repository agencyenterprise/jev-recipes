import { inspectTextBlock, proposeParagraphJoin } from './workflow.mjs';
import { fixture } from '../shared/fixtures.mjs';

const left = { id: 'line-1', text: 'Install the package using', offset: 0 };
const right = { id: 'line-2', text: 'the following command.', offset: 26 };
const block = await inspectTextBlock(
  left,
  { after: right.text },
  { client: { systemOne: fixture({ decision: 'body' }) } },
);
const join = await proposeParagraphJoin(left, right, {
  client: { systemOne: fixture({ decision: 'continue' }) },
});
console.log(JSON.stringify({ mode: 'fixture', block, join }, null, 2));
