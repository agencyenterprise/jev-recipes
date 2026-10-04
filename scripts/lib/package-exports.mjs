const entry = (path) => ({ types: `./dist/${path}.d.ts`, import: `./dist/${path}.js` });

export const packageExports = {
  '.': entry('src/index'),
  './client': entry('src/create-client'),
  './catalog': entry('catalog/index'),
  './evaluation': entry('evaluation/index'),
  './ai-sdk': entry('adapters/ai-sdk/index'),
  './langchain': entry('adapters/langchain/index'),
  './package.json': './package.json',
};

export function assertRecipeExportAvailable(id) {
  if (Object.hasOwn(packageExports, `./${id}`))
    throw new Error(`Recipe ID ${id} is reserved for a package export.`);
}
