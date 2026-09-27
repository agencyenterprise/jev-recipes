export function fixture(answers, confidence = 0.98) {
  return (request) => ({
    model: 'workflow-fixture',
    usage: { input_tokens: 0, output_tokens: 0 },
    answers: Object.fromEntries(
      Object.entries(request.questions).map(([name, question]) => {
        const value = Object.hasOwn(answers, name) ? answers[name] : answers.default;
        if (value === undefined) throw new Error(`Missing fixture answer: ${name}`);
        if (question.type === 'noul') return [name, { type: 'noul', noul: value }];
        const keys =
          question.type === 'score'
            ? question.criteria.map((_, index) => String(index))
            : Object.keys(question.criteria);
        const selected = String(value);
        if (!keys.includes(selected))
          throw new Error(`Fixture ${selected} is not a supplied option for ${name}.`);
        const probabilities = Object.fromEntries(
          keys.map((key) => [key, key === selected ? 1 : 0]),
        );
        return [
          name,
          question.type === 'score'
            ? { type: 'score', score: value, confidence, probabilities }
            : { type: 'choice', choice: value, confidence, probabilities },
        ];
      }),
    ),
  });
}
