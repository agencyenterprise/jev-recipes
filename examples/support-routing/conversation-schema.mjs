import { z } from 'zod';
import { routeInputSchema } from 'jev-recipes/route';
import { clarifyInputSchema } from 'jev-recipes/clarify';
import { supportRequestSchema } from './schema.mjs';

const text = z.string().trim().min(1).max(12000);
const requirement = clarifyInputSchema.shape.requirements.element.extend({ question: text });

export const supportConfigSchema = z
  .object({
    routes: routeInputSchema.shape.routes,
    requirements: z
      .array(requirement)
      .max(50)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        'Requirement IDs must be unique.',
      ),
    minConfidence: z.number().min(0).max(1),
    maxQuestions: z.number().int().min(0).max(5),
  })
  .strict();

export const conversationInputSchema = z
  .object({
    request: text,
    answers: z
      .array(z.object({ requirementId: text, text }).strict())
      .max(5)
      .default([]),
  })
  .strict();

export function prepareConversation(value, configuration) {
  const config = supportConfigSchema.parse(configuration);
  const input = conversationInputSchema
    .superRefine((conversation, ctx) => {
      const ids = new Set();
      for (const [index, answer] of conversation.answers.entries()) {
        if (
          ids.has(answer.requirementId) ||
          !config.requirements.some((item) => item.id === answer.requirementId)
        )
          ctx.addIssue({
            code: 'custom',
            path: ['answers', index, 'requirementId'],
            message: 'Answers must reference distinct configured requirements.',
          });
        ids.add(answer.requirementId);
      }
      if (conversation.answers.length > config.maxQuestions)
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: 'The conversation exceeds the configured question limit.',
        });
    })
    .parse(value);
  // Questions come from application configuration, never browser-supplied text.
  const followups = input.answers.map((answer) => ({
    question: config.requirements.find((item) => item.id === answer.requirementId).question,
    answer: answer.text,
  }));
  const request = supportRequestSchema.shape.request.parse(
    followups.length ? JSON.stringify({ request: input.request, followups }) : input.request,
  );
  return { input, config, request };
}

const trace = z.array(
  z.object({
    stage: z.enum(['clarification', 'primary', 'fallback']),
    status: z.enum(['ready', 'review', 'failed']),
    model: z.string().optional(),
    route: z.string().nullable().optional(),
    checks: z
      .array(
        z.object({
          id: z.string(),
          verdict: z.enum(['present', 'missing', 'ambiguous']),
          status: z.enum(['ready', 'review']),
        }),
      )
      .optional(),
  }),
);

const common = {
  reason: z.enum([
    'missing-information',
    'ambiguous-information',
    'clarification-uncertain',
    'clarification-failed',
    'unresolved-answer',
    'question-limit',
    'primary-ready',
    'no-clear-route',
    'low-confidence',
    'primary-failed',
    'fallback-ready',
    'fallback-review',
    'fallback-failed',
  ]),
  trace,
};

export const conversationOutcomeSchema = z.discriminatedUnion('action', [
  z.object({
    ...common,
    action: z.literal('propose_route'),
    route: text,
    question: z.null(),
    requirementId: z.null(),
  }),
  z.object({
    ...common,
    action: z.literal('propose_question'),
    route: z.null(),
    question: text,
    requirementId: text,
  }),
  z.object({
    ...common,
    action: z.literal('review'),
    route: z.null(),
    question: z.null(),
    requirementId: z.null(),
  }),
]);
