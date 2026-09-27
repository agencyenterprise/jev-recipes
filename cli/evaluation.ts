import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { compare, evaluate, readEvaluationCases, readRun, replay } from '../evaluation/index.js';
import { evaluationPolicySchema, priceSchema } from '../evaluation/schema.js';

export async function runEvaluationCommand(args: string[]): Promise<unknown> {
  const command = args[0];
  if (command === 'evaluate') return evaluateFromFile(args.slice(1));
  if (command === 'replay') return replayArchive(args.slice(1));
  if (command === 'compare' && args.length === 3)
    return compare(await readRun(args[1]!), await readRun(args[2]!));
  throw new Error('Invalid evaluation command. Run jev-recipes --help for usage.');
}

async function evaluateFromFile(args: string[]) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      cases: { type: 'string' },
      out: { type: 'string' },
      model: { type: 'string' },
      concurrency: { type: 'string' },
      'max-cases': { type: 'string' },
      'max-requests': { type: 'string' },
      'min-confidence': { type: 'string' },
      split: { type: 'string' },
      policy: { type: 'string' },
      prices: { type: 'string' },
    },
  });
  if (positionals.length !== 1 || !values.cases || !values.out)
    throw new Error(
      'Usage: jev-recipes evaluate <recipe> --cases <file.jsonl> --out <new-directory>',
    );
  if (values.policy && values['min-confidence'] !== undefined)
    throw new Error('Use --policy or --min-confidence, not both.');
  const policy = values.policy
    ? evaluationPolicySchema.parse(JSON.parse(await readFile(values.policy, 'utf8')))
    : values['min-confidence'] === undefined
      ? {}
      : { minConfidence: Number(values['min-confidence']) };
  const price = values.prices
    ? priceSchema.parse(JSON.parse(await readFile(values.prices, 'utf8')))
    : undefined;
  if (!process.env.TYPESAFE_API_KEY?.trim())
    throw new Error(
      'Set TYPESAFE_API_KEY before live evaluation. Replay and compare work offline.',
    );
  const run = await evaluate(positionals[0]!, await readEvaluationCases(values.cases), {
    out: values.out,
    policy,
    ...(values.model === undefined ? {} : { model: values.model }),
    ...(price === undefined ? {} : { price }),
    ...(values.split === undefined ? {} : { split: values.split as 'development' | 'held-out' }),
    ...(values.concurrency === undefined ? {} : { concurrency: Number(values.concurrency) }),
    ...(values['max-cases'] === undefined ? {} : { maxCases: Number(values['max-cases']) }),
    ...(values['max-requests'] === undefined
      ? {}
      : { maxRequests: Number(values['max-requests']) }),
  });
  return { archive: values.out, runId: run.runId, report: run.report };
}

async function replayArchive(args: string[]) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      'min-confidence': { type: 'string' },
      out: { type: 'string' },
    },
  });
  if (positionals.length !== 1)
    throw new Error(
      'Usage: jev-recipes replay <archive> [--min-confidence <number>] [--out <new-directory>]',
    );
  const source = await readRun(positionals[0]!);
  const policy =
    values['min-confidence'] === undefined
      ? source.policy
      : { minConfidence: Number(values['min-confidence']) };
  const run = await replay(source, policy, values.out);
  return {
    ...(values.out ? { archive: values.out } : {}),
    sourceRun: source.runId,
    policy: run.policy,
    report: run.report,
  };
}
