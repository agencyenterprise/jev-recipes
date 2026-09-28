// Application policy: edit this file to adapt the starter to your support queues.
export const supportConfig = {
  routes: {
    billing: 'Invoice amounts, charges, refunds, and subscription payments.',
    account: 'Sign-in, passwords, account access, and account profile changes.',
    technical: 'Product errors, broken features, crashes, and service outages.',
  },
  requirements: [
    {
      id: 'issue',
      description:
        'The customer describes a concrete problem or requested change. A generic request for help or statement that something is wrong is insufficient.',
      question: 'What were you trying to do, and what happened instead?',
    },
  ],
  minConfidence: 0.8,
  maxQuestions: 2,
};
