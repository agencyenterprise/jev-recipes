import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { invoiceFacetsInputSchema, invoiceFacetsResultSchema } from './schema.js';
import type { InvoiceFacetsInput, InvoiceFacetsResult } from './schema.js';

export async function invoiceFacets(
  input: InvoiceFacetsInput,
  options: RecipeOptions = {},
): Promise<InvoiceFacetsResult> {
  const { minConfidence = 0.8, ...state } = invoiceFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesVendor: {
        instruction:
          'Does invoice state who issued it, such as a business name, sender name, or seller identity?',
        criteria: {
          true: 'The text names the business or person issuing the invoice.',
          false: 'The text does not identify who issued the invoice.',
        },
      },
      statesInvoiceNumber: {
        instruction:
          'Does invoice state an invoice number or reference identifier for the invoice itself?',
        criteria: {
          true: 'The text gives an invoice number, reference number, or similar identifier for this invoice.',
          false:
            'The text gives no identifier for the invoice; order or account numbers alone do not count.',
        },
      },
      statesDueDate: {
        instruction:
          'Does invoice state when payment is due, as a date or as payment terms that fix one?',
        criteria: {
          true: 'The text states a due date or payment terms such as a number of days from the invoice date.',
          false: 'The text does not say when payment is due.',
        },
      },
      statesLineItems: {
        instruction: 'Does invoice list one or more individual items or services being billed?',
        criteria: {
          true: 'The text itemizes at least one product, service, or charge separately from the total.',
          false: 'The text gives only a lump amount or no breakdown of what is billed.',
        },
      },
      statesTotals: {
        instruction:
          'Does invoice state a total amount due, with or without a tax or subtotal breakdown?',
        criteria: {
          true: 'The text states a total amount due, a subtotal plus tax, or an equivalent summary of what is owed.',
          false: 'The text does not state a total or summary amount owed.',
        },
      },
    },
    options,
  );
  return invoiceFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  invoiceFacetsInputSchema,
  invoiceFacetsResultSchema,
  invoiceFacetsLabelSchema,
} from './schema.js';
export type { InvoiceFacetsInput, InvoiceFacetsResult, InvoiceFacetsLabel } from './schema.js';
