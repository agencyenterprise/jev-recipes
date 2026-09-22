import { mkdtemp, readdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, relative, dirname, basename } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';
import { z } from 'zod';
import { TypeSafeClient } from '@typesafe-ai/sdk';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const recipeIdPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export async function readRecipes(root = projectRoot) {
  const entries = await readdir(join(root, 'recipes'), { withFileTypes: true });
  const ids = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (!ids.length) throw new Error('At least one recipe is required.');
  const files = [];
  for (const id of ids) {
    if (!recipeIdPattern.test(id) || id === 'catalog') throw new Error(`Invalid recipe ID: ${id}`);
    for (const name of ['index.ts', 'schema.ts', 'metadata.ts', 'demo.json', 'README.md']) {
      await readFile(join(root, 'recipes', id, name));
      if (name.endsWith('.ts')) files.push(join(root, 'recipes', id, name));
    }
    await readFile(join(root, 'tests/recipe', `${id}.test.ts`));
  }
  const temporary = await mkdtemp(join(tmpdir(), 'jev-recipes-generate-'));
  const previousFetch = globalThis.fetch;
  const previousSystemOne = TypeSafeClient.prototype.systemOne;
  const rejectLiveCall = () => {
    throw new Error('Generation is offline. Supply a fixture client.');
  };
  try {
    globalThis.fetch = rejectLiveCall;
    TypeSafeClient.prototype.systemOne = rejectLiveCall;
    await writeFile(join(temporary, 'package.json'), '{"type":"module"}');
    await symlink(join(projectRoot, 'node_modules'), join(temporary, 'node_modules'), 'dir');
    const configuration = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile);
    if (configuration.error)
      throw new Error(ts.flattenDiagnosticMessageText(configuration.error.messageText, '\n'));
    const { options } = ts.parseJsonConfigFileContent(configuration.config, ts.sys, root);
    const program = ts.createProgram(files, {
      ...options,
      rootDir: root,
      outDir: temporary,
      declaration: false,
      noEmit: false,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length) {
      throw new Error(
        ts.formatDiagnosticsWithColorAndContext(diagnostics, {
          getCanonicalFileName: (file) => file,
          getCurrentDirectory: () => root,
          getNewLine: () => '\n',
        }),
      );
    }
    const checker = program.getTypeChecker();
    const exportedNames = new Set([
      'createClient',
      'listRecipes',
      'describeRecipe',
      'RecipeOptions',
      'DecisionClient',
      'DecisionStatus',
      'ResultMetadata',
      'RecipeMetadata',
      'RecipeCategory',
      'RecipeFilters',
      'RecipeName',
      'CatalogRecipe',
      'RecipeDescription',
    ]);
    const definitions = ids.map((id) => {
      const source = program.getSourceFile(join(root, 'recipes', id, 'index.ts'));
      const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(source));
      const values = [];
      const types = [];
      const functions = [];
      for (const exported of exports) {
        const symbol =
          exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
        const name = exported.getName();
        if (exportedNames.has(name)) throw new Error(`Duplicate public export ${name} in ${id}.`);
        exportedNames.add(name);
        if (symbol.flags & ts.SymbolFlags.Value) values.push(name);
        else types.push(name);
        if (symbol.flags & ts.SymbolFlags.Function) functions.push(name);
      }
      const inputs = values.filter((name) => name.endsWith('InputSchema'));
      const results = values.filter((name) => name.endsWith('ResultSchema'));
      if (functions.length !== 1 || inputs.length !== 1 || results.length !== 1) {
        throw new Error(
          `${id} must export one recipe function, one InputSchema, and one ResultSchema.`,
        );
      }
      return {
        id,
        functionName: functions[0],
        inputName: inputs[0],
        resultName: results[0],
        values: values.sort(),
        types: types.sort(),
      };
    });
    const dependencies = inspectImports(program, root, ids);
    const emitted = program.emit();
    if (emitted.emitSkipped) throw new Error('Could not compile recipe sources for generation.');
    const { recipeMetadataSchema } = await import(pathToFileURL(join(temporary, 'src/schema.js')));
    const authorMetadataSchema = recipeMetadataSchema
      .strict()
      .required({ useWhen: true, related: true });
    const records = [];
    for (const definition of definitions) {
      const { id } = definition;
      const recipe = await import(pathToFileURL(join(temporary, 'recipes', id, 'index.js')));
      const { metadata: rawMetadata } = await import(
        pathToFileURL(join(temporary, 'recipes', id, 'metadata.js'))
      );
      const metadata = authorMetadataSchema.parse(rawMetadata);
      if (metadata.id !== id)
        throw new Error(`Recipe folder ${id} disagrees with metadata ID ${metadata.id}.`);
      const fixture = JSON.parse(await readFile(join(root, 'recipes', id, 'demo.json'), 'utf8'));
      recipe[definition.inputName].parse(fixture.input);
      const result = await recipe[definition.functionName](fixture.input, {
        client: { systemOne: async () => fixture.response },
      });
      recipe[definition.resultName].parse(result);
      records.push({
        ...definition,
        metadata,
        fixture,
        result,
        dependencies: dependencies.get(id),
        inputSchema: z.toJSONSchema(recipe[definition.inputName], { io: 'input' }),
        resultSchema: z.toJSONSchema(recipe[definition.resultName]),
      });
    }
    validateRecipeGraph(records);
    return records;
  } finally {
    globalThis.fetch = previousFetch;
    TypeSafeClient.prototype.systemOne = previousSystemOne;
    await rm(temporary, { recursive: true, force: true });
  }
}

export function validateRecipeGraph(records) {
  const byId = new Map(records.map((recipe) => [recipe.id, recipe]));
  if (byId.size !== records.length) throw new Error('Duplicate recipe IDs.');
  for (const recipe of records) {
    const uses = recipe.metadata.uses ?? [];
    const related = recipe.metadata.related ?? [];
    if (
      new Set(uses).size !== uses.length ||
      new Set(related.map((item) => item.id)).size !== related.length
    ) {
      throw new Error(`Duplicate dependency or related recipe in ${recipe.id}.`);
    }
    for (const target of [...uses, ...related.map((item) => item.id)]) {
      if (target === recipe.id || !byId.has(target))
        throw new Error(`Invalid recipe reference: ${recipe.id} -> ${target}`);
    }
    if (JSON.stringify([...uses].sort()) !== JSON.stringify([...recipe.dependencies].sort())) {
      throw new Error(
        `${recipe.id}: metadata.uses must match its imports (${recipe.dependencies.join(', ') || 'none'}).`,
      );
    }
  }
  const completed = new Set();
  const active = new Set();
  function visit(id) {
    if (active.has(id)) throw new Error(`Circular recipe dependency at ${id}.`);
    if (completed.has(id)) return;
    active.add(id);
    for (const dependency of byId.get(id).metadata.uses ?? []) visit(dependency);
    active.delete(id);
    completed.add(id);
  }
  for (const { id } of records) visit(id);
}

export function inspectImports(program, root, ids) {
  const dependencies = new Map(ids.map((id) => [id, new Set()]));
  for (const source of program.getSourceFiles()) {
    const path = relative(root, source.fileName).replaceAll('\\', '/');
    if (!(path.startsWith('recipes/') || path.startsWith('src/'))) continue;
    const recipeId = path.startsWith('recipes/') ? path.split('/')[1] : null;
    function inspect(node) {
      let specifier;
      let typeOnly = false;
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        specifier = node.moduleSpecifier;
        typeOnly = node.isTypeOnly || node.importClause?.isTypeOnly;
        const bindings = node.importClause?.namedBindings ?? node.exportClause;
        if (
          bindings?.elements?.length &&
          bindings.elements.every((element) => element.isTypeOnly) &&
          !node.importClause?.name
        )
          typeOnly = true;
      } else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword
      ) {
        specifier = node.arguments[0];
        if (!specifier || !ts.isStringLiteral(specifier))
          throw new Error(`Use a literal import in ${path}.`);
      }
      if (
        specifier &&
        ts.isStringLiteral(specifier) &&
        (specifier.text === 'jev-recipes' || specifier.text.startsWith('jev-recipes/'))
      ) {
        throw new Error(
          `${path} must use relative recipe or shared helper imports, not the package barrel.`,
        );
      }
      if (specifier && ts.isStringLiteral(specifier) && specifier.text.startsWith('.')) {
        const target = relative(root, resolve(dirname(source.fileName), specifier.text)).replaceAll(
          '\\',
          '/',
        );
        if (
          !(target.startsWith('src/') || target.startsWith('recipes/')) ||
          target === 'src/index.js'
        ) {
          throw new Error(`${path} must not depend on ${target}.`);
        }
        if (!recipeId && target.startsWith('recipes/'))
          throw new Error(`Shared helpers must not depend on recipes: ${path}`);
        if (recipeId && target.startsWith('recipes/')) {
          const targetId = target.split('/')[1];
          if (targetId !== recipeId) {
            if (!ids.includes(targetId) || basename(target) !== 'index.js')
              throw new Error(`${path} must use another recipe's public index.js export.`);
            if (!typeOnly) dependencies.get(recipeId).add(targetId);
          }
        }
      }
      ts.forEachChild(node, inspect);
    }
    inspect(source);
  }
  return new Map([...dependencies].map(([id, values]) => [id, [...values].sort()]));
}
