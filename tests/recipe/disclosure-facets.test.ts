import { disclosureFacets } from '../../recipes/disclosure-facets/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(
  disclosureFacets,
  {
    disclosure:
      "Seller's Property Disclosure - 27 Birchwood Lane\n\nRoof: Seller is aware of a leak at the chimney flashing that appears during heavy rain; a stain is visible on the upstairs hallway ceiling. Not yet repaired.\nPlumbing: Water heater replaced in March 2024 (receipt available). Kitchen drain line snaked in 2023.\nBasement: Occasional dampness on the north wall after spring thaw; no standing water observed.\nEnvironmental: Radon test in 2022 measured 3.1 pCi/L; no mitigation system installed. House built in 1968; seller has no knowledge of lead-based paint testing.\nHeating: Furnace original to 1998 addition, serviced annually.",
  },
  [
    'statesKnownDefects',
    'statesPriorRepairs',
    'statesEnvironmentalHazards',
    'statesBoundaryIssues',
    'statesAssociationRules',
  ],
);
