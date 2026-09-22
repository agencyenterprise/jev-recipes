import { replyTemplateMatch } from '../../recipes/reply-template-match/index.js';
import { testSelection } from './helpers/selection.js';

testSelection(
  replyTemplateMatch,
  {
    request: 'How do I reset my password?',
    templates: [
      {
        id: 'reset',
        text: 'For password reset requests: Select Forgot password on the sign-in page.',
      },
      {
        id: 'invoice',
        text: 'For invoice requests: Open Billing and select Download invoice.',
      },
    ],
  },
  'templates',
  ['context'],
);
