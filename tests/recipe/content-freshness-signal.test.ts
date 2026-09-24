import { contentFreshnessSignal } from '../../recipes/content-freshness-signal/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  contentFreshnessSignal,
  {
    content:
      'Getting started with Node.js\n\nThe latest LTS release, Node 22, ships with built-in test runner support and a stable fetch API. Download the installer from nodejs.org; the current version is 22.11.0. Hosting on a small VPS costs around $6 per month with most providers this year. Once installed, run node --version to confirm the install.',
  },
  ['perishable', 'evergreen'],
);
