#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { stdin, stdout, stderr } from 'node:process';
import { z } from 'zod';
import { recipes } from './recipes.js';
import { commandArgumentsSchema, demoFixtureSchema } from './schema.js';
import type { RecipeName } from './schema.js';

async function main(): Promise<void> {
  const command = parseCommandArguments(process.argv.slice(2));

  switch (command[0]) {
    case '--help':
    case '-h':
      return printHelp();
    case '--version':
      return printVersion();
    case 'list':
      return printRecipeList();
    case 'example':
      return printExampleInput(command[1]);
    case 'demo':
      return runOfflineRecipe(command[1]);
    case 'run':
      return runLiveRecipe(command[1], command[2]);
  }
}

function parseCommandArguments(args: string[]) {
  const parsed = commandArgumentsSchema.safeParse(args.length === 0 ? ['--help'] : args);
  if (!parsed.success) throw new Error('Invalid command. Run jev-recipes --help for usage.');
  return parsed.data;
}

function printHelp(): void {
  stdout.write(`jev-recipes

  jev-recipes list                       List recipes
  jev-recipes demo <recipe>              Run an offline fixture (no model call)
  jev-recipes example <recipe>           Print example input as JSON
  jev-recipes run <recipe> <file|->       Run live with a JSON file or stdin
  jev-recipes --version

Live runs send your input to TypeSafe and require TYPESAFE_API_KEY.
Output is JSON. Errors go to stderr and exit with code 1.
Review outcomes are successful evaluations; inspect status before acting.
`);
}

async function printVersion(): Promise<void> {
  const packageJson = await readFile(new URL('../../package.json', import.meta.url), 'utf8');
  const { version } = JSON.parse(packageJson);
  stdout.write(`${version}\n`);
}

function printRecipeList(): void {
  const recipeList = Object.entries(recipes).map(([id, recipe]) => ({
    id,
    description: recipe.description,
  }));
  printJson(recipeList);
}

async function printExampleInput(name: RecipeName): Promise<void> {
  const fixture = await readDemoFixture(name);
  printJson(fixture.input);
}

async function runOfflineRecipe(name: RecipeName): Promise<void> {
  const fixture = await readDemoFixture(name);
  const fixtureClient = { systemOne: async () => fixture.response };
  const result = await recipes[name].run(fixture.input, { client: fixtureClient });

  printJson({
    mode: 'demo',
    note: 'Hand-authored fixture. No model was called; this does not measure accuracy.',
    result,
  });
}

async function runLiveRecipe(name: RecipeName, source: string): Promise<void> {
  const inputJson = source === '-' ? await readStandardInput() : await readFile(source, 'utf8');
  const result = await recipes[name].run(JSON.parse(inputJson));
  printJson({ mode: 'live', result });
}

async function readDemoFixture(name: RecipeName) {
  const fixturePath = new URL(`../../recipes/${name}/demo.json`, import.meta.url);
  const fixtureJson = await readFile(fixturePath, 'utf8');
  return demoFixtureSchema.parse(JSON.parse(fixtureJson));
}

async function readStandardInput(): Promise<string> {
  stdin.setEncoding('utf8');
  let input = '';
  for await (const chunk of stdin) input += chunk;
  return input;
}

function printJson(value: unknown): void {
  stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function reportError(error: unknown): void {
  const message =
    error instanceof z.ZodError
      ? error.issues
          .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
          .join('\n')
      : error instanceof Error
        ? error.message
        : String(error);

  stderr.write(`${message}\n`);
  process.exitCode = 1;
}

main().catch(reportError);
