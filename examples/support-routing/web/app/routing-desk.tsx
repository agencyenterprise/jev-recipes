'use client';

import { useRef, useState } from 'react';
import { scenarios } from '../../scenarios.mjs';
import { supportConfig } from '../../config.mjs';

type Scenario = keyof typeof scenarios;
type Answer = { requirementId: string; text: string };
type Decision = {
  mode: string;
  action: 'propose_route' | 'propose_question' | 'review';
  route: string | null;
  question: string | null;
  requirementId: string | null;
  reason: string;
  trace: {
    stage: string;
    status: string;
    route?: string | null;
    checks?: { id: string; verdict: string; status: string }[];
  }[];
};

const explanations: Record<string, string> = {
  'missing-information': 'One detail is missing. Ask this question before choosing a queue.',
  'ambiguous-information': 'A detail is unclear. Ask this question before continuing.',
  'clarification-uncertain':
    'The information check is uncertain. A person should review this request.',
  'clarification-failed': 'The information check failed. Keep this request for review or retry.',
  'unresolved-answer':
    'The answer did not resolve the issue. Keep the conversation for human review.',
  'question-limit': 'The question limit was reached. A person should review the remaining details.',
  'primary-ready': 'Jev selected a queue above the review threshold.',
  'no-clear-route': 'No single queue clearly fits. Keep this conversation for human review.',
  'low-confidence': 'The suggestion needs review. No fallback is configured.',
  'primary-failed': 'The decision service failed. Keep this request for review or retry.',
  'fallback-ready': 'The first suggestion was uncertain. A second decision selected a queue.',
  'fallback-review': 'The second decision also needs review.',
  'fallback-failed': 'The second decision failed. Keep this request for review or retry.',
};

export default function RoutingDesk({ mode }: { mode: 'fixture' | 'live' }) {
  const [scenario, setScenario] = useState<Scenario>('ready');
  const [request, setRequest] = useState<string>(scenarios.ready.request);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [reply, setReply] = useState('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);
  const saved = scenarios[scenario] as { label: string; request: string; reply?: string };
  const answerText = mode === 'fixture' ? (saved.reply ?? '') : reply;

  function resetConversation() {
    setAnswers([]);
    setReply('');
    setDecision(null);
    setError('');
  }

  function selectScenario(value: Scenario) {
    setScenario(value);
    setRequest(scenarios[value].request);
    resetConversation();
  }

  async function evaluate(nextAnswers: Answer[]) {
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, request, answers: nextAnswers }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Routing is unavailable.');
      setDecision(result);
      setAnswers(nextAnswers);
      setReply('');
    } catch (failure) {
      setError(
        controller.signal.aborted
          ? 'Cancelled. No queue was assigned.'
          : failure instanceof Error
            ? failure.message
            : 'Could not connect. Try again.',
      );
    } finally {
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
      }
    }
  }

  function start(event: React.FormEvent) {
    event.preventDefault();
    resetConversation();
    void evaluate([]);
  }

  function continueConversation(event: React.FormEvent) {
    event.preventDefault();
    if (decision?.action !== 'propose_question' || !decision.requirementId || !answerText.trim())
      return;
    void evaluate([...answers, { requirementId: decision.requirementId, text: answerText }]);
  }

  return (
    <main>
      <header>
        <a className="brand" href="https://github.com/agencyenterprise/jev-recipes">
          jev <span>recipes</span>
        </a>
        <span className="mode">
          {mode === 'fixture' ? 'Saved-response demo' : 'Live Gateway calls'}
        </span>
      </header>
      <section className="introduction">
        <h1>
          A request comes in.
          <br />
          What happens next?
        </h1>
        <p>Get the missing detail, propose a queue, or bring in a person.</p>
      </section>
      <section className="desk" aria-label="Support routing example">
        <form onSubmit={start}>
          <h2>The conversation</h2>
          {mode === 'fixture' && (
            <fieldset disabled={busy}>
              <legend>Choose a saved scenario</legend>
              <div className="scenarios">
                {(Object.keys(scenarios) as Scenario[]).map((value) => (
                  <button
                    type="button"
                    aria-pressed={scenario === value}
                    key={value}
                    onClick={() => selectScenario(value)}
                  >
                    {scenarios[value].label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <label htmlFor="request">Customer message</label>
          <textarea
            id="request"
            value={request}
            maxLength={12000}
            rows={5}
            readOnly={mode === 'fixture'}
            disabled={busy}
            onChange={(event) => {
              setRequest(event.target.value);
              resetConversation();
            }}
          />
          <p className="hint">
            {mode === 'fixture'
              ? 'These fixed responses demonstrate control flow. They do not measure model accuracy.'
              : 'This conversation goes to the configured providers. Use a sample without private customer information.'}
          </p>
          {answers.length > 0 && (
            <ol className="conversation-history">
              {answers.map((answer) => (
                <li key={answer.requirementId}>
                  <strong>
                    {
                      supportConfig.requirements.find((item) => item.id === answer.requirementId)
                        ?.question
                    }
                  </strong>
                  <p>{answer.text}</p>
                </li>
              ))}
            </ol>
          )}
          <div className="actions">
            <button className="submit" disabled={busy || !request.trim()}>
              {busy ? 'Checking…' : decision ? 'Start again' : 'Find the next step'}
            </button>
            {busy && (
              <button type="button" onClick={() => active.current?.abort()}>
                Cancel
              </button>
            )}
          </div>
        </form>
        <section className="decision" aria-live="polite" aria-busy={busy}>
          <h2>The next step</h2>
          {!decision && !error && (
            <div className="empty">
              <span className="branch" aria-hidden="true">
                ↳
              </span>
              <p>{busy ? 'Checking the request…' : 'Run a request to see what happens next.'}</p>
            </div>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {decision && (
            <>
              <p className={`outcome ${decision.action === 'review' ? 'review' : 'ready'}`}>
                {decision.action === 'propose_route'
                  ? `Propose ${decision.route}`
                  : decision.action === 'propose_question'
                    ? 'Ask one question'
                    : 'Keep for review'}
              </p>
              <p>{explanations[decision.reason]}</p>
              {decision.action === 'propose_question' && (
                <form className="follow-up" onSubmit={continueConversation}>
                  <label htmlFor="reply">{decision.question}</label>
                  <textarea
                    id="reply"
                    value={answerText}
                    rows={3}
                    maxLength={12000}
                    readOnly={mode === 'fixture'}
                    disabled={busy}
                    onChange={(event) => setReply(event.target.value)}
                  />
                  <button className="submit" disabled={busy || !answerText.trim()}>
                    {busy
                      ? 'Checking…'
                      : mode === 'fixture'
                        ? 'Use saved answer'
                        : 'Continue with this answer'}
                  </button>
                </form>
              )}
              <ol className="trace">
                {decision.trace.map((step, index) => (
                  <li key={`${step.stage}-${index}`}>
                    <strong>
                      {
                        {
                          clarification: 'Check the details',
                          primary: 'Choose a queue',
                          fallback: 'Second opinion',
                        }[step.stage]
                      }
                    </strong>
                    <span>
                      {step.status === 'failed'
                        ? 'Service failed'
                        : step.stage === 'clarification'
                          ? step.status === 'review'
                            ? 'Uncertain information check'
                            : step.checks?.every((check) => check.verdict === 'present')
                              ? 'Required details are present'
                              : 'More detail is needed'
                          : step.route
                            ? `Suggests ${step.route}`
                            : 'Needs review'}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="hint">
                Proposals only. No ticket was moved and no customer was contacted.
              </p>
            </>
          )}
        </section>
      </section>
      <section className="queues">
        <h2>The available queues</h2>
        <div>
          {Object.entries(supportConfig.routes).map(([id, description]) => (
            <article className={decision?.route === id ? 'selected' : ''} key={id}>
              <h3>{id}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <footer>
        <a href="https://github.com/agencyenterprise/jev-recipes/tree/main/examples/support-routing">
          Read the workflow
        </a>
        <p>Your application owns the queues, review policy, and next action.</p>
      </footer>
    </main>
  );
}
