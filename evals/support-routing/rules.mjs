export function routeWithRules(input, rules) {
  const text = input.request.toLowerCase();
  const matches = Object.entries(rules).filter(
    ([id, terms]) =>
      Object.hasOwn(input.routes, id) && terms.some((term) => text.includes(term.toLowerCase())),
  );
  return matches.length === 1
    ? { status: 'ready', route: matches[0][0] }
    : { status: 'review', route: null };
}
