'use client';

import { useRef, useState } from 'react';
import { scenarios, supportRoutes } from '../../scenarios.mjs';

type Scenario = keyof typeof scenarios;
type Decision = {
  mode: string;
  status: 'ready' | 'review';
  route: string | null;
  source: string;
  reason: string;
  trace: { stage: string; status: string; route: string | null; confidence?: number }[];
};

const explanations: Record<string, string> = {
  'primary-ready': 'Jev selected a queue above the review threshold.',
  'no-clear-route': 'No single queue clearly fits. Ask for more context before routing.',
  'low-confidence': 'The suggestion needs review. No fallback is configured.',
  'primary-failed': 'The decision service failed. Keep this request for review.',
  'fallback-ready': 'The first suggestion was uncertain. A second decision selected a queue.',
  'fallback-review': 'The second decision also needs review.',
  'fallback-failed': 'The second decision failed. Keep this request for review.',
};

export default function RoutingDesk({ mode }: { mode: 'fixture' | 'live' }) {
  const [scenario, setScenario] = useState<Scenario>('ready');
  const [request, setRequest] = useState<string>(scenarios.ready.request);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);

  function selectScenario(value: Scenario) {
    setScenario(value);
    setRequest(scenarios[value].request);
    setDecision(null);
    setError('');
  }

  async function routeRequest(event: React.FormEvent) {
    event.preventDefault();
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setDecision(null);
    setError('');
    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, request }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Routing is unavailable.');
      setDecision(result);
    } catch (failure) {
      setError(
        controller.signal.aborted
          ? 'Cancelled. No queue was assigned.'
          : failure instanceof Error
            ? failure.message
            : 'Could not connect. Try again.',
      );
    } finally {
      active.current = null;
      setBusy(false);
    }
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
          Where should it go?
        </h1>
        <p>Follow one support decision, including the moment it needs a second look.</p>
      </section>
      <section className="desk" aria-label="Support routing example">
        <form onSubmit={routeRequest}>
          <h2>The request</h2>
          {mode === 'fixture' && (
            <fieldset disabled={busy}>
              <legend>Choose a saved scenario</legend>
              <div className="scenarios">
                {(['ready', 'escalation', 'review', 'failure'] as Scenario[]).map((value) => (
                  <button
                    type="button"
                    aria-pressed={scenario === value}
                    key={value}
                    onClick={() => selectScenario(value)}
                  >
                    {
                      {
                        ready: 'Clear match',
                        escalation: 'Second look',
                        review: 'Needs context',
                        failure: 'Service failure',
                      }[value]
                    }
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
              setDecision(null);
            }}
          />
          <p className="hint">
            {mode === 'fixture'
              ? 'These fixed responses demonstrate control flow. They do not measure model accuracy.'
              : 'This text goes to the configured model providers. Use a sample without private customer information.'}
          </p>
          <div className="actions">
            <button className="submit" disabled={busy || !request.trim()}>
              {busy ? 'Evaluating…' : mode === 'fixture' ? 'Run this example' : 'Propose a queue'}
            </button>
            {busy && (
              <button type="button" onClick={() => active.current?.abort()}>
                Cancel
              </button>
            )}
          </div>
        </form>
        <section className="decision" aria-live="polite" aria-busy={busy}>
          <h2>The decision</h2>
          {!decision && !error && (
            <div className="empty">
              <span className="branch" aria-hidden="true">
                ↳
              </span>
              <p>{busy ? 'Checking the request…' : 'Run a request to see the route it takes.'}</p>
            </div>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {decision && (
            <>
              <p className={`outcome ${decision.status}`}>
                {decision.status === 'ready' ? `Propose ${decision.route}` : 'Keep for review'}
              </p>
              <p>{explanations[decision.reason]}</p>
              <ol className="trace">
                {decision.trace.map((step) => (
                  <li key={step.stage}>
                    <strong>
                      {step.stage === 'primary' ? 'First decision' : 'Second decision'}
                    </strong>
                    <span>
                      {step.status === 'failed'
                        ? 'Service failed'
                        : step.route
                          ? `Suggests ${step.route}`
                          : 'Needs review'}
                      {step.confidence !== undefined
                        ? ` · ${Math.round(step.confidence * 100)}% confidence`
                        : ''}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="hint">
                A proposal only. No ticket was moved and no customer was contacted.
              </p>
            </>
          )}
        </section>
      </section>
      <section className="queues">
        <h2>The available queues</h2>
        <div>
          {Object.entries(supportRoutes).map(([id, description]) => (
            <article className={decision?.route === id ? 'selected' : ''} key={id}>
              <h3>{id}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <footer>
        <a href="https://github.com/agencyenterprise/jev-recipes/tree/main/examples/support-routing">
          Read the workflow and evidence
        </a>
        <p>Your application owns the queues, review policy, and next action.</p>
      </footer>
    </main>
  );
}
