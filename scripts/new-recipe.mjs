import { mkdir, writeFile, access, rm, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import ts from 'typescript';
import { z } from 'zod';
import { projectRoot, recipeIdPattern } from './lib/recipes.mjs';

export const recipeKinds = ['choice', 'score', 'gate', 'comparison', 'labels'];

const text = z.string().trim().min(1);
const label = z.string().regex(/^[a-z][a-z0-9_]*$/, 'Labels are lower snake_case.');
const camel = z.string().regex(/^[a-z][A-Za-z0-9]*$/, 'Names are camelCase.');
const probability = z.number().min(0).max(1);
const yesNo = z.object({ true: text, false: text });
const baseSpec = z.object({
  id: z.string().regex(recipeIdPattern, 'Recipe IDs are kebab-case.'),
  title: text,
  description: text,
  category: z.enum([
    'retrieval',
    'conversation',
    'workflow',
    'answer-quality',
    'support',
    'memory',
    'knowledge',
  ]),
  tags: z.array(text).min(1),
  useWhen: text,
  related: z.array(z.object({ id: text, reason: text })),
  limitations: z.array(text).min(1),
  inputs: z
    .record(camel, z.enum(['required', 'optional']))
    .refine(
      (inputs) => Object.keys(inputs).length >= 1 && !('minConfidence' in inputs),
      'Provide at least one input; minConfidence is added automatically.',
    ),
  instruction: text,
  readme: z.object({ result: text.optional(), limits: text.optional() }).default({}),
  demoInput: z.record(camel, z.union([text, z.record(z.string(), z.unknown())])),
});
export const recipeSpecSchema = z.discriminatedUnion('kind', [
  baseSpec.extend({
    kind: z.literal('score'),
    labelField: camel,
    rubric: z.array(z.object({ label, description: text })).min(2),
    demoProbabilities: z.array(probability).min(2),
  }),
  baseSpec.extend({
    kind: z.literal('gate'),
    verdicts: z.object({ yes: label, no: label }),
    criteria: yesNo,
    demoProbability: probability,
  }),
  baseSpec
    .extend({
      kind: z.literal('choice'),
      criteria: z
        .record(label, text)
        .refine((c) => Object.keys(c).length >= 2, 'Two or more labels.'),
      reviewVerdict: label.nullable().default('unclear'),
      demoProbabilities: z.record(label, probability),
    })
    .refine(
      (spec) => spec.reviewVerdict === null || spec.reviewVerdict in spec.criteria,
      'reviewVerdict must be one of the criteria labels, or null for no review verdict.',
    ),
  baseSpec.extend({
    kind: z.literal('comparison'),
    criteria: z.object({ first: text, second: text, tie: text, neither: text }),
    demoProbabilities: z.record(
      z.enum(['first', 'second', 'tie', 'neither', 'unclear']),
      probability,
    ),
  }),
  baseSpec.extend({
    kind: z.literal('labels'),
    labels: z
      .record(camel, z.object({ instruction: text, criteria: yesNo }))
      .refine((l) => Object.keys(l).length >= 1, 'One or more labels.'),
    demoProbabilities: z.record(camel, probability),
  }),
]);

export function starterSpec(id, kind) {
  const common = {
    id,
    title: id.replaceAll('-', ' '),
    category: 'workflow',
    related: [],
    limitations: ['Only evaluates the supplied input.'],
    inputs: { text: 'required', requirement: 'required' },
    demoInput: { text: 'Please send the invoice.', requirement: 'The text requests an invoice.' },
  };
  const starters = {
    choice: {
      ...common,
      kind: 'choice',
      description: 'Check text against a supplied requirement.',
      tags: ['requirement'],
      useWhen: 'You need to check text against an explicit requirement.',
      instruction: 'Does text meet the supplied requirement?',
      criteria: {
        matched: 'The text meets the requirement.',
        unmatched: 'The text does not meet the requirement.',
        unclear: 'The supplied facts do not establish a decision.',
      },
      demoProbabilities: { matched: 0.9, unmatched: 0.05, unclear: 0.05 },
    },
    score: {
      ...common,
      kind: 'score',
      description: 'How well does text meet a supplied requirement, on a three-level rubric?',
      tags: ['requirement', 'rubric', 'score'],
      useWhen: 'You need a graded result rather than a single label.',
      instruction: 'How well does text meet the supplied requirement?',
      labelField: 'grade',
      rubric: [
        { label: 'none', description: 'The text does not address the requirement.' },
        {
          label: 'partial',
          description: 'The text partly addresses the requirement with major gaps.',
        },
        { label: 'full', description: 'The text fully addresses the requirement.' },
      ],
      demoProbabilities: [0.05, 0.05, 0.9],
    },
    gate: {
      ...common,
      kind: 'gate',
      description: 'Does text meet a supplied requirement?',
      tags: ['requirement', 'gate'],
      useWhen: 'You need a yes/no gate on text.',
      instruction: 'Does text meet the supplied requirement?',
      verdicts: { yes: 'present', no: 'absent' },
      criteria: {
        true: 'The text meets the requirement.',
        false: 'The text does not meet the requirement.',
      },
      demoProbability: 0.93,
    },
    comparison: {
      ...common,
      kind: 'comparison',
      description: 'Which candidate better meets requirement?',
      tags: ['comparison', 'pairwise'],
      useWhen: 'You need to pick between two candidates under one requirement.',
      inputs: { requirement: 'required', firstCandidate: 'required', secondCandidate: 'required' },
      demoInput: {
        requirement: 'The text requests an invoice.',
        firstCandidate: 'Please send the invoice.',
        secondCandidate: 'Thanks for the update.',
      },
      instruction: 'Which candidate better meets requirement?',
      criteria: {
        first: 'Only the first candidate meets the requirement, or it clearly meets it better.',
        second: 'Only the second candidate meets the requirement, or it clearly meets it better.',
        tie: 'Both candidates meet the requirement about equally.',
        neither: 'Neither candidate meets the requirement.',
      },
      demoProbabilities: { first: 0.9, second: 0.03, tie: 0.03, neither: 0.02, unclear: 0.02 },
    },
    labels: {
      ...common,
      kind: 'labels',
      description: 'Which of several independent properties does text have?',
      tags: ['labels', 'multi-label'],
      useWhen: 'You need several yes/no labels on one text in a single call.',
      inputs: { text: 'required' },
      demoInput: { text: 'Could you send the invoice today?' },
      instruction: 'Label the independent properties of text.',
      labels: {
        asksQuestion: {
          instruction: 'Does text ask a question that expects an answer?',
          criteria: { true: 'The text asks a question.', false: 'The text asks no question.' },
        },
        requestsAction: {
          instruction: 'Does text ask the reader to do something?',
          criteria: { true: 'The text requests an action.', false: 'The text requests no action.' },
        },
      },
      demoProbabilities: { asksQuestion: 0.94, requestsAction: 0.91 },
    },
  };
  if (!recipeKinds.includes(kind))
    throw new Error(`Unknown recipe kind "${kind}". Use one of: ${recipeKinds.join(', ')}.`);
  return starters[kind];
}

export function renderRecipe(rawSpec) {
  const spec = recipeSpecSchema.parse(rawSpec);
  const functionName = spec.id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
  const typeName = functionName[0].toUpperCase() + functionName.slice(1);
  const names = { functionName, typeName, fn: functionName, T: typeName };
  const kind = kinds[spec.kind];
  const optionalInputs = Object.entries(spec.inputs)
    .filter(([, mode]) => mode === 'optional')
    .map(([name]) => name);
  const inputFields = Object.entries(spec.inputs)
    .map(([name, mode]) => `${name}: nonEmptyText${mode === 'optional' ? '.optional()' : ''}`)
    .concat('minConfidence: probability.optional()')
    .join(', ');
  const demoInput = { ...spec.demoInput, minConfidence: 0.8 };
  const testInput = Object.fromEntries(
    Object.entries(spec.demoInput).filter(([name]) => !optionalInputs.includes(name)),
  );
  const files = new Map([
    ['index.ts', kind.index(spec, names)],
    ['schema.ts', kind.schema(spec, names, inputFields)],
    ['metadata.ts', renderMetadata(spec)],
    [
      'demo.json',
      JSON.stringify({
        input: demoInput,
        response: {
          model: 'demo-fixture',
          answers: kind.demoAnswers(spec),
          usage: { input_tokens: 0, output_tokens: 0 },
        },
      }),
    ],
    ['README.md', renderReadme(spec, kind, optionalInputs)],
  ]);
  return { spec, files, test: kind.test(spec, names, testInput, optionalInputs) };
}

const kinds = {
  score: {
    helper: 'score',
    index: (spec, { fn, T }) => `import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${fn}InputSchema, ${fn}ResultSchema, ${fn}VerdictSchema } from './schema.js';
import type { ${T}Input, ${T}Result } from './schema.js';

export async function ${fn}(input: ${T}Input, options: RecipeOptions = {}): Promise<${T}Result> {
  const { minConfidence = 0.8, ...state } = ${fn}InputSchema.parse(input);
  const decision = await evaluateScore(state, ${q(spec.instruction)}, [
${spec.rubric.map((level) => `    ${q(level.description)},`).join('\n')}
  ], options);
  return ${fn}ResultSchema.parse({
    ...decision,
    ${spec.labelField}: ${fn}VerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { ${fn}InputSchema, ${fn}ResultSchema, ${fn}VerdictSchema } from './schema.js';
export type { ${T}Input, ${T}Result, ${T}Verdict } from './schema.js';
`,
    schema: (spec, { fn, T }, inputFields) => `import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const ${fn}VerdictSchema = z.enum([${spec.rubric.map((l) => q(l.label)).join(', ')}]);
export const ${fn}InputSchema = z.object({ ${inputFields} });
export const ${fn}ResultSchema = scoreResultSchema.extend({ ${spec.labelField}: ${fn}VerdictSchema });

export type ${T}Verdict = z.infer<typeof ${fn}VerdictSchema>;
export type ${T}Input = z.infer<typeof ${fn}InputSchema>;
export type ${T}Result = z.infer<typeof ${fn}ResultSchema>;
`,
    demoAnswers: (spec) => {
      const p = spec.demoProbabilities;
      if (p.length !== spec.rubric.length)
        throw new Error(`${spec.id}: demoProbabilities must have one entry per rubric level.`);
      assertMass(spec.id, p);
      const score = Math.round(p.reduce((sum, value, index) => sum + index * value, 0) * 100) / 100;
      return {
        score: {
          type: 'score',
          score,
          confidence: Math.max(...p),
          probabilities: Object.fromEntries(p.map((value, index) => [String(index), value])),
        },
      };
    },
    result: (spec) =>
      `\`${spec.labelField}\` is one of ${spec.rubric.map((l) => `\`${l.label}\``).join(', ')}, taken from the most likely rubric level. \`level\` is that level's index from 0 to ${spec.rubric.length - 1}. \`score\` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.\n\nA result is \`ready\` when \`confidence\` meets \`minConfidence\`. Otherwise it is \`review\` and still carries the graded values for inspection. \`probabilities\` is keyed by level index.`,
    test: (
      spec,
      { fn },
      input,
      optional,
    ) => `import { ${fn} } from '../../recipes/${spec.id}/index.js';
import { testScore } from './helpers/score.js';

testScore(${fn}, ${j(input)}, [${spec.rubric.map((l) => q(l.label)).join(', ')}], ${q(spec.labelField)}${optional.length ? `, ${j(optional)}` : ''});
`,
  },
  gate: {
    helper: 'gate',
    index: (spec, { fn, T }) => `import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${fn}InputSchema, ${fn}ResultSchema } from './schema.js';
import type { ${T}Input, ${T}Result } from './schema.js';

export async function ${fn}(input: ${T}Input, options: RecipeOptions = {}): Promise<${T}Result> {
  const { minConfidence = 0.8, ...state } = ${fn}InputSchema.parse(input);
  const decision = await evaluateGate(state, ${q(spec.instruction)}, {
    true: ${q(spec.criteria.true)},
    false: ${q(spec.criteria.false)},
  }, options);
  return ${fn}ResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? ${q(spec.verdicts.yes)} : ${q(spec.verdicts.no)},
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { ${fn}InputSchema, ${fn}ResultSchema, ${fn}VerdictSchema } from './schema.js';
export type { ${T}Input, ${T}Result, ${T}Verdict } from './schema.js';
`,
    schema: (spec, { fn, T }, inputFields) => `import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const ${fn}VerdictSchema = z.enum([${q(spec.verdicts.yes)}, ${q(spec.verdicts.no)}]);
export const ${fn}InputSchema = z.object({ ${inputFields} });
export const ${fn}ResultSchema = gateResultSchema.extend({ verdict: ${fn}VerdictSchema });

export type ${T}Verdict = z.infer<typeof ${fn}VerdictSchema>;
export type ${T}Input = z.infer<typeof ${fn}InputSchema>;
export type ${T}Result = z.infer<typeof ${fn}ResultSchema>;
`,
    demoAnswers: (spec) => ({ gate: { type: 'noul', noul: spec.demoProbability } }),
    result: (spec) =>
      `\`verdict\` is \`${spec.verdicts.yes}\` when Jev's yes probability is at least 0.5 and \`${spec.verdicts.no}\` otherwise. \`probability\` is that yes probability. \`confidence\` is the probability of the chosen side, so a 0.1 yes probability yields \`${spec.verdicts.no}\` with 0.9 confidence.\n\nA result is \`ready\` when \`confidence\` meets \`minConfidence\`. Otherwise it is \`review\`. Treat a review result as unknown and fall back to your safe default.`,
    test: (
      spec,
      { fn },
      input,
      optional,
    ) => `import { ${fn} } from '../../recipes/${spec.id}/index.js';
import { testGate } from './helpers/gate.js';

testGate(${fn}, ${j(input)}, [${q(spec.verdicts.yes)}, ${q(spec.verdicts.no)}]${optional.length ? `, 'verdict', ${j(optional)}` : ''});
`,
  },
  choice: {
    helper: 'choice',
    index: (spec, { fn, T }) => `import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${fn}InputSchema, ${fn}ResultSchema } from './schema.js';
import type { ${T}Input, ${T}Result } from './schema.js';

export async function ${fn}(input: ${T}Input, options: RecipeOptions = {}): Promise<${T}Result> {
  const { minConfidence = 0.8, ...state } = ${fn}InputSchema.parse(input);
  const decision = await evaluateChoice(state, ${q(spec.instruction)}, {
${Object.entries(spec.criteria)
  .map(([name, description]) => `    ${name}: ${q(description)},`)
  .join('\n')}
  }, options);
  return ${fn}ResultSchema.parse({
    ...decision,
    status: decision.confidence < minConfidence${spec.reviewVerdict ? ` || decision.verdict === ${q(spec.reviewVerdict)}` : ''} ? 'review' : 'ready',
  });
}

export { ${fn}InputSchema, ${fn}ResultSchema, ${fn}VerdictSchema } from './schema.js';
export type { ${T}Input, ${T}Result, ${T}Verdict } from './schema.js';
`,
    schema: (spec, { fn, T }, inputFields) => `import { z } from 'zod';
import { decisionStatusSchema, nonEmptyText, probability, resultMetadataSchema } from '../../src/schema.js';

export const ${fn}VerdictSchema = z.enum([${Object.keys(spec.criteria).map(q).join(', ')}]);
export const ${fn}InputSchema = z.object({ ${inputFields} });
export const ${fn}ResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: ${fn}VerdictSchema,
  confidence: probability,
  probabilities: z.record(${fn}VerdictSchema, probability),
});

export type ${T}Verdict = z.infer<typeof ${fn}VerdictSchema>;
export type ${T}Input = z.infer<typeof ${fn}InputSchema>;
export type ${T}Result = z.infer<typeof ${fn}ResultSchema>;
`,
    demoAnswers: (spec) =>
      choiceAnswer(spec.id, spec.demoProbabilities, Object.keys(spec.criteria)),
    result: (spec) =>
      `\`verdict\` is one of ${Object.keys(spec.criteria)
        .map((l) => `\`${l}\``)
        .join(
          ', ',
        )}.${spec.reviewVerdict ? ` \`${spec.reviewVerdict}\` means the supplied facts do not establish a decision and always requires review.` : ''}\n\nA result is \`ready\` when \`confidence\` meets \`minConfidence\`${spec.reviewVerdict ? ` and the verdict is not \`${spec.reviewVerdict}\`` : ''}. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. \`probabilities\` covers every verdict.`,
    test: (
      spec,
      { fn },
      input,
      optional,
    ) => `import { ${fn} } from '../../recipes/${spec.id}/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(${fn}, ${j(input)}, [${Object.keys(spec.criteria).map(q).join(', ')}]${optional.length || spec.reviewVerdict !== 'unclear' ? `, ${j(optional)}` : ''}${spec.reviewVerdict !== 'unclear' ? `, ${spec.reviewVerdict === null ? 'null' : q(spec.reviewVerdict)}` : ''});
`,
  },
  comparison: {
    helper: 'comparison',
    index: (spec, { fn, T }) => `import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${fn}InputSchema, ${fn}ResultSchema } from './schema.js';
import type { ${T}Input, ${T}Result } from './schema.js';

export async function ${fn}(input: ${T}Input, options: RecipeOptions = {}): Promise<${T}Result> {
  const { minConfidence = 0.8, ...state } = ${fn}InputSchema.parse(input);
  const decision = await evaluateComparison(state, ${q(spec.instruction)}, {
    first: ${q(spec.criteria.first)},
    second: ${q(spec.criteria.second)},
    tie: ${q(spec.criteria.tie)},
    neither: ${q(spec.criteria.neither)},
  }, options);
  return ${fn}ResultSchema.parse({
    ...decision,
    status: decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { ${fn}InputSchema, ${fn}ResultSchema, ${fn}VerdictSchema } from './schema.js';
export type { ${T}Input, ${T}Result, ${T}Verdict } from './schema.js';
`,
    schema: (spec, { fn, T }, inputFields) => `import { z } from 'zod';
import { comparisonResultSchema, comparisonVerdictSchema, nonEmptyText, probability } from '../../src/schema.js';

export const ${fn}VerdictSchema = comparisonVerdictSchema;
export const ${fn}InputSchema = z.object({ ${inputFields} });
export const ${fn}ResultSchema = comparisonResultSchema;

export type ${T}Verdict = z.infer<typeof ${fn}VerdictSchema>;
export type ${T}Input = z.infer<typeof ${fn}InputSchema>;
export type ${T}Result = z.infer<typeof ${fn}ResultSchema>;
`,
    demoAnswers: (spec) =>
      choiceAnswer(spec.id, spec.demoProbabilities, [
        'first',
        'second',
        'tie',
        'neither',
        'unclear',
      ]),
    result: () =>
      '`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the preferred candidate. `tie` means both fit about equally. `neither` means no candidate fits, which is a confident answer rather than a failure.\n\nA result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.',
    test: (
      spec,
      { fn },
      input,
      optional,
    ) => `import { ${fn} } from '../../recipes/${spec.id}/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(${fn}, ${j(input)}${optional.length ? `, ${j(optional)}` : ''});
`,
  },
  labels: {
    helper: 'labels',
    index: (
      spec,
      { fn, T },
    ) => `import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ${fn}InputSchema, ${fn}ResultSchema } from './schema.js';
import type { ${T}Input, ${T}Result } from './schema.js';

export async function ${fn}(input: ${T}Input, options: RecipeOptions = {}): Promise<${T}Result> {
  const { minConfidence = 0.8, ...state } = ${fn}InputSchema.parse(input);
  const evaluation = await evaluateLabels(state, {
${Object.entries(spec.labels)
  .map(
    ([name, def]) => `    ${name}: {
      instruction: ${q(def.instruction)},
      criteria: { true: ${q(def.criteria.true)}, false: ${q(def.criteria.false)} },
    },`,
  )
  .join('\n')}
  }, options);
  return ${fn}ResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export { ${fn}InputSchema, ${fn}ResultSchema, ${fn}LabelSchema } from './schema.js';
export type { ${T}Input, ${T}Result, ${T}Label } from './schema.js';
`,
    schema: (spec, { fn, T }, inputFields) => `import { z } from 'zod';
import { labelCheckSchema, labelsResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const ${fn}LabelSchema = z.enum([${Object.keys(spec.labels).map(q).join(', ')}]);
export const ${fn}InputSchema = z.object({ ${inputFields} });
export const ${fn}ResultSchema = labelsResultSchema.extend({
  detected: z.array(${fn}LabelSchema),
  labels: z.object({ ${Object.keys(spec.labels)
    .map((name) => `${name}: labelCheckSchema`)
    .join(', ')} }),
});

export type ${T}Label = z.infer<typeof ${fn}LabelSchema>;
export type ${T}Input = z.infer<typeof ${fn}InputSchema>;
export type ${T}Result = z.infer<typeof ${fn}ResultSchema>;
`,
    demoAnswers: (spec) => {
      const names = Object.keys(spec.labels);
      const missing = names.filter((name) => !(name in spec.demoProbabilities));
      if (missing.length)
        throw new Error(`${spec.id}: demoProbabilities missing ${missing.join(', ')}.`);
      return Object.fromEntries(
        names.map((name) => [name, { type: 'noul', noul: spec.demoProbabilities[name] }]),
      );
    },
    result: (spec) =>
      `\`labels\` holds one check per label: ${Object.keys(spec.labels)
        .map((l) => `\`${l}\``)
        .join(
          ', ',
        )}. Each check has a \`verdict\` of \`present\` or \`absent\`, the yes \`probability\`, \`confidence\` for the chosen side, and its own \`status\`. \`detected\` lists the present labels in declaration order.\n\nThe overall \`status\` is \`review\` when any single label falls below \`minConfidence\`. Labels that are individually \`ready\` remain usable in that case.`,
    test: (
      spec,
      { fn },
      input,
      optional,
    ) => `import { ${fn} } from '../../recipes/${spec.id}/index.js';
import { testLabels } from './helpers/labels.js';

testLabels(${fn}, ${j(input)}, ${j(Object.keys(spec.labels))}${optional.length ? `, ${j(optional)}` : ''});
`,
  },
};

const reuse = {
  score:
    'Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy.',
  gate: 'Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy.',
  choice:
    'Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy.',
  comparison:
    'Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions.',
  labels:
    'Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions.',
};

function renderMetadata(spec) {
  return `import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: ${q(spec.id)},
  title: ${q(spec.title)},
  description: ${q(spec.description)},
  category: ${q(spec.category)},
  tags: [${spec.tags.map(q).join(', ')}],
  useWhen: ${q(spec.useWhen)},
  related: [
${spec.related.map((r) => `    { id: ${q(r.id)}, reason: ${q(r.reason)} },`).join('\n')}
  ],
  limitations: [
${spec.limitations.map((l) => `    ${q(l)},`).join('\n')}
  ],
} satisfies RecipeMetadata;
`;
}

function renderReadme(spec, kind, optionalInputs) {
  const optionalNote = optionalInputs.length
    ? ` ${optionalInputs.map((name) => `\`${name}\``).join(' and ')} ${optionalInputs.length === 1 ? 'is' : 'are'} optional and ${optionalInputs.length === 1 ? 'is' : 'are'} omitted from the request when absent.`
    : '';
  return `# ${spec.title}

<!-- BEGIN GENERATED: usage -->
<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->
<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.${optionalNote}

## Result

${spec.readme.result ?? kind.result(spec)}

## Reuse and calls

${reuse[spec.kind]} A live invocation makes one logical Jev request.

## Limits

${spec.readme.limits ?? spec.limitations.join(' ')}

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing \`jev-recipes\`, \`npx jev-recipes demo ${spec.id}\` shows an offline illustration, not an accuracy measurement. Use \`npx jev-recipes describe ${spec.id}\` to inspect the input and result schemas.
`;
}

function choiceAnswer(id, probabilities, labels) {
  const missing = labels.filter((name) => !(name in probabilities));
  const extra = Object.keys(probabilities).filter((name) => !labels.includes(name));
  if (missing.length || extra.length)
    throw new Error(`${id}: demoProbabilities must cover exactly ${labels.join(', ')}.`);
  assertMass(id, Object.values(probabilities));
  const [choice, confidence] = Object.entries(probabilities).reduce((best, entry) =>
    entry[1] > best[1] ? entry : best,
  );
  return { decision: { type: 'choice', choice, confidence, probabilities } };
}

function assertMass(id, values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 0.001)
    throw new Error(`${id}: demo probabilities sum to ${total}, not 1.`);
}

const q = (value) =>
  JSON.stringify(value).replace(/'/g, "\\'").replace(/^"|"$/g, "'").replace(/\\"/g, '"');
const j = (value) => JSON.stringify(value);

export async function scaffoldRecipe(root, id, kind = 'choice') {
  if (!recipeIdPattern.test(id ?? '') || id === 'catalog')
    throw new Error('Supply a new kebab-case recipe ID: make new RECIPE=my-recipe');
  return scaffoldFromSpec(root, starterSpec(id, kind));
}

export async function scaffoldFromSpec(root, rawSpec) {
  const { spec, files, test } = renderRecipe(rawSpec);
  if (spec.id === 'catalog')
    throw new Error('Supply a new kebab-case recipe ID: make new RECIPE=my-recipe');
  const source = files.get('index.ts');
  if (ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest).parseDiagnostics.length)
    throw new Error('The recipe ID must produce a valid TypeScript function name.');
  const directory = join(root, 'recipes', spec.id);
  const testPath = join(root, 'tests/recipe', `${spec.id}.test.ts`);
  for (const path of [directory, testPath]) {
    try {
      await access(path);
      throw new Error(`Already exists: ${path}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  await mkdir(join(root, 'recipes'), { recursive: true });
  await mkdir(directory);
  try {
    for (const [name, content] of files)
      await writeFile(
        join(directory, name),
        await format(content, { filepath: name, singleQuote: true, printWidth: 100 }),
        { flag: 'wx' },
      );
    await mkdir(join(root, 'tests/recipe'), { recursive: true });
    await writeFile(
      testPath,
      await format(test, { filepath: testPath, singleQuote: true, printWidth: 100 }),
      { flag: 'wx' },
    );
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
  return spec;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args[0] === '--spec') {
      const paths = args.slice(1);
      if (!paths.length)
        throw new Error('Usage: node scripts/new-recipe.mjs --spec <spec.json> [more.json ...]');
      for (const path of paths) {
        const spec = await scaffoldFromSpec(projectRoot, JSON.parse(await readFile(path, 'utf8')));
        console.log(
          `Created recipes/${spec.id}/ (${spec.kind}) and tests/recipe/${spec.id}.test.ts from ${path}.`,
        );
      }
      console.log('Review the generated guide prose, then run make docs and make ci.');
    } else {
      const id = args[0] ?? process.env.RECIPE;
      const kind = args[1] ?? process.env.KIND ?? 'choice';
      await scaffoldRecipe(projectRoot, id, kind);
      console.log(
        `Created recipes/${id}/ (${kind}) and tests/recipe/${id}.test.ts.\nReplace the starter decision, metadata, and fixture; add boundary tests. Then run make docs and make ci.`,
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
