import { contactOptOut } from '../../recipes/contact-opt-out/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  contactOptOut,
  { message: 'Please stop texting me. Email about my open support case is fine.' },
  ['all_contact', 'channel', 'campaign', 'none', 'unclear'],
  ['context'],
);
