import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useTeam } from '../context/TeamContext';
import Logo from '../components/Logo';
import TeamBadge from '../components/TeamBadge';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import QuestionPalette from '../components/QuestionPalette';
import Spinner from '../components/Spinner';

const ATTEMPT_KEY = 'qc_attempt_id';

export default function Quiz() {
  const { team } = useTeam();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' | '' }
  const [attemptId, setAttemptId] = useState(null);
  const [current, setCurrent] = useState(0); // index into questions

  const [endsAt, setEndsAt] = useState(0);
  const [clockOffset, setClockOffset] = useState(0);
  const [now, setNow] = useState(Date.now());

  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  // ---- Load (or resume) the attempt on mount ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let data = null;
        const savedId = localStorage.getItem(ATTEMPT_KEY);
        if (savedId) {
          try {
            data = await api.getAttempt(savedId);
          } catch (e) {
            if ([400, 401, 403, 404].includes(e.status)) {
              localStorage.removeItem(ATTEMPT_KEY);
              data = null;
            } else {
              throw e;
            }
          }
        }
        if (!data) {
          data = await api.startAttempt({ round: 1 });
        }
        if (cancelled) return;

        if (data.attempt.status === 'submitted') {
          submittedRef.current = true;
          localStorage.removeItem(ATTEMPT_KEY);
          navigate('/done', { replace: true });
          return;
        }

        localStorage.setItem(ATTEMPT_KEY, data.attempt._id);
        const ansMap = {};
        data.questions.forEach((q) => {
          ansMap[q._id] = data.answers[q._id] || '';
        });
        setQuestions(data.questions);
        setAnswers(ansMap);
        setAttemptId(data.attempt._id);
        setClockOffset(data.serverTime - Date.now());
        setEndsAt(data.attempt.startedAt + data.attempt.timeLimitSeconds * 1000);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        if (e.status === 409) {
          localStorage.removeItem(ATTEMPT_KEY);
          navigate('/done', { replace: true });
          return;
        }
        setFatalError(e.message || 'Failed to load the quiz.');
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ---- Ticking clock ----
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const remainingMs = endsAt ? Math.max(0, endsAt - (now + clockOffset)) : 0;

  // ---- Auto-submit on expiry ----
  useEffect(() => {
    if (!endsAt || submitting || submittedRef.current) return;
    if (remainingMs > 0) return;
    submittedRef.current = true;
    setSubmitting(true);
    (async () => {
      try {
        const id = localStorage.getItem(ATTEMPT_KEY);
        if (id) await api.submitAttempt(id, {});
      } catch {
        /* server will auto-close on its side regardless */
      }
      localStorage.removeItem(ATTEMPT_KEY);
      navigate('/done', { replace: true });
    })();
  }, [remainingMs, endsAt, submitting, navigate]);

  // ---- Answer selection (immediate save) ----
  const selectOption = async (optionKey) => {
    const q = questions[current];
    if (!q || !attemptId) return;
    const previous = answers[q._id];
    setAnswers((a) => ({ ...a, [q._id]: optionKey }));
    setSaveState('saving');
    try {
      await api.saveAnswer(attemptId, { questionId: q._id, selectedOption: optionKey });
      setSaveState('saved');
      setTimeout(() => setSaveState((s) => (s === 'saved' ? 'idle' : s)), 1400);
    } catch (e) {
      if (e.status === 410 || e.status === 409) {
        submittedRef.current = true;
        localStorage.removeItem(ATTEMPT_KEY);
        navigate('/done', { replace: true });
        return;
      }
      setAnswers((a) => ({ ...a, [q._id]: previous }));
      setSaveState('error');
    }
  };

  const clearResponse = () => {
    const q = questions[current];
    if (!q || !attemptId) return;
    if (answers[q._id]) selectOption('');
  };

  const handleSubmit = async () => {
    if (submitting || submittedRef.current) return;
    const answered = Object.values(answers).filter(Boolean).length;
    const unanswered = questions.length - answered;
    const msg =
      unanswered > 0
        ? `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit Round 1 anyway? This cannot be undone.`
        : 'Submit Round 1? This cannot be undone.';
    if (!window.confirm(msg)) return;

    setSubmitting(true);
    submittedRef.current = true;
    try {
      await api.submitAttempt(attemptId, {});
      localStorage.removeItem(ATTEMPT_KEY);
      navigate('/done', { replace: true });
    } catch (e) {
      setSubmitting(false);
      submittedRef.current = false;
      setFatalError(e.message || 'Submission failed. Please try again.');
    }
  };

  const answersByOrder = useMemo(() => {
    const map = {};
    questions.forEach((q) => {
      map[q.order] = answers[q._id] || '';
    });
    return map;
  }, [questions, answers]);

  const answeredCount = Object.values(answersByOrder).filter(Boolean).length;

  if (fatalError) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="card w-full p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">!</div>
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mt-2 text-slate-400">{fatalError}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-6">Try again</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Preparing your quiz…" />
      </div>
    );
  }

  const q = questions[current];
  const isFirst = current === 0;
  const isLast = current === questions.length - 1;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
      {/* Top bar */}
      <header className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Logo subtitle={false} />
          <div className="hidden h-8 w-px bg-slate-800 sm:block" />
          <div className="hidden sm:block">
            <TeamBadge team={team} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Timer remainingMs={remainingMs} />
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary px-4 py-2.5 text-sm">
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </header>

      {/* Mobile team row */}
      <div className="mt-3 sm:hidden">
        <TeamBadge team={team} />
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-400">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      {/* Main grid */}
      <div className="mt-4 grid flex-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuestionCard
            question={q}
            total={questions.length}
            selected={answers[q._id] || ''}
            onSelect={selectOption}
            locked={submitting}
          />

          {/* Save indicator + Clear */}
          <div className="mt-3 flex items-center justify-between">
            <SaveIndicator state={saveState} />
            {answers[q._id] ? (
              <button onClick={clearResponse} className="btn-ghost px-3 py-2 text-xs">
                Clear response
              </button>
            ) : (
              <span />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={isFirst} className="btn-ghost">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              Previous
            </button>

            {isLast ? (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                Review &amp; Submit
              </button>
            ) : (
              <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} className="btn-primary">
                Next
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <QuestionPalette
            total={questions.length}
            answersByOrder={answersByOrder}
            currentOrder={q.order}
            onJump={(order) => setCurrent(order - 1)}
            locked={submitting}
          />
          <div className="card p-4 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Auto-submit:</span> the round closes by
            itself when the timer reaches zero. Your saved answers are always safe if you refresh.
          </div>
        </aside>
      </div>

      {submitting && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <Spinner label="Submitting your round…" />
        </div>
      )}
    </div>
  );
}

function SaveIndicator({ state }) {
  if (state === 'saving')
    return <span className="text-xs text-slate-400">Saving…</span>;
  if (state === 'saved')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Answer saved
      </span>
    );
  if (state === 'error')
    return <span className="text-xs text-rose-400">Save failed — retrying on next change</span>;
  return null;
}
