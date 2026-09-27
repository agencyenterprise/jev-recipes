# Inspect retained document text

Run `node examples/ingestion/run.mjs` after building. This uses explicit offline fixtures; it does not measure accuracy.

Read `workflow.mjs` in order: preserve the input, request a bounded judgment, apply the review policy, and return a proposal. A block classification never removes text. A paragraph join requires a ready `continue` verdict. Ambiguity, low confidence, and provider failure preserve the boundary. Original objects, text, and offsets remain available in the result.

The caller owns extraction, reading order, native tags, exact offsets, whitespace, and the final merge. Use reliable native structure before requesting a model judgment. The helpers intentionally propose changes without executing them. Both recipes are experimental; their guides describe the saved evidence and its limits.
