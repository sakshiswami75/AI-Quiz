import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAdmin } from '../context/AdminContext';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const fmtTime = (v) => (v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAdmin();

  const [overview, setOverview] = useState(null);
  const [teams, setTeams] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null); // action in progress (string key)

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [ov, tm, rk] = await Promise.all([
        api.adminOverview(),
        api.adminTeams(),
        api.adminRankings(),
      ]);
      setOverview(ov);
      setTeams(tm.teams);
      setRankings(rk.rankings);
    } catch (e) {
      setError(e.message || 'Failed to load data');
      if (e.status === 401) navigate('/admin/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 8000); // auto-refresh every 8s during the event
    return () => clearInterval(id);
  }, [loadAll]);

  const doAction = async (key, fn, okMsg) => {
    setBusyId(key);
    try {
      await fn();
      await loadAll();
    } catch (e) {
      setError(e.message || okMsg ? `${okMsg} failed` : 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleForceSubmit = (attemptId, teamNumber) =>
    window.confirm(`Force-submit Team ${teamNumber}? Their current answers will be locked and scored.`) &&
    doAction(`force-${attemptId}`, () => api.adminForceSubmit(attemptId));

  const handleReset = (teamNumber) =>
    window.confirm(`Reset Team ${teamNumber}'s attempt? They will be able to start Round 1 again from scratch (registration is kept).`) &&
    doAction(`reset-${teamNumber}`, () => api.adminResetAttempt(teamNumber));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-4">
          <Logo subtitle={false} />
          <div className="hidden h-8 w-px bg-slate-800 sm:block" />
          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-widest text-slate-400">Admin Dashboard</div>
            <div className="text-sm font-semibold text-white">Signed in as {admin?.username}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAll} className="btn-ghost text-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => {
              logoutAdmin();
              navigate('/admin/login');
            }}
            className="btn-ghost text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>
      )}

      {/* Stats */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Registered" value={overview?.registered ?? 0} sub={`of ${overview?.totalTeams ?? 16}`} tone="indigo" />
        <StatCard label="In progress" value={overview?.inProgress ?? 0} sub="Round 1 live" tone="amber" />
        <StatCard label="Submitted" value={overview?.submitted ?? 0} sub="Round 1 done" tone="emerald" />
        <StatCard label="Top score" value={rankings[0]?.score ?? '—'} sub={rankings[0] ? `Team ${rankings[0].teamNumber}` : 'no data'} tone="fuchsia" />
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Teams table */}
        <section className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h2 className="font-semibold text-white">Teams &amp; Round 1 Scores</h2>
            <span className="text-xs text-slate-400">{teams.length} registered</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Team</th>
                  <th className="px-5 py-3">Members</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      No teams registered yet.
                    </td>
                  </tr>
                )}
                {teams.map((t) => (
                  <tr key={t.teamNumber} className="hover:bg-slate-800/30">
                    <td className="px-5 py-3">
                      <span className="font-mono font-bold text-white">{String(t.teamNumber).padStart(2, '0')}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-slate-200">{t.member1Name}</div>
                      <div className="text-xs text-slate-500">{t.member2Name}</div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge attempt={t.attempt} />
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold text-white">
                      {t.attempt?.status === 'submitted' ? t.attempt.score : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {t.attempt?.status === 'in-progress' && (
                          <button
                            disabled={busyId === `force-${t.attempt.attemptId}`}
                            onClick={() => handleForceSubmit(t.attempt.attemptId, t.teamNumber)}
                            className="btn-ghost px-2.5 py-1.5 text-xs"
                          >
                            {busyId === `force-${t.attempt.attemptId}` ? '…' : 'Force submit'}
                          </button>
                        )}
                        {t.attempt && (
                          <button
                            disabled={busyId === `reset-${t.teamNumber}`}
                            onClick={() => handleReset(t.teamNumber)}
                            className="btn-danger px-2.5 py-1.5 text-xs"
                          >
                            {busyId === `reset-${t.teamNumber}` ? '…' : 'Reset'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rankings */}
        <section className="card overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="font-semibold text-white">Leaderboard</h2>
            <p className="text-xs text-slate-400">Round 1 · sorted by score</p>
          </div>
          <ol className="divide-y divide-slate-800/70">
            {rankings.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-slate-500">No submissions yet.</li>
            )}
            {rankings.map((r) => (
              <li key={r.teamNumber} className="flex items-center gap-3 px-5 py-3">
                <RankMedal rank={r.rank} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white">Team {r.teamNumber}</div>
                  <div className="truncate text-xs text-slate-500">{r.members.filter(Boolean).join(' · ')}</div>
                </div>
                <div className="font-mono text-lg font-bold text-white">{r.score}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Phase 2 note */}
      <div className="card mt-4 flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
        <div className="text-sm text-slate-400">
          <span className="chip mr-2">Phase 2</span>
          Round start/pause/resume controls, Round 2 puzzles, CSV export and AI features arrive next.
        </div>
        <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">View participant site →</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, tone }) {
  const tones = {
    indigo: 'text-indigo-300',
    amber: 'text-amber-300',
    emerald: 'text-emerald-300',
    fuchsia: 'text-fuchsia-300',
  };
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-1 font-mono text-3xl font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function StatusBadge({ attempt }) {
  if (!attempt) return <span className="chip border-slate-700 text-slate-400">Not started</span>;
  if (attempt.status === 'in-progress')
    return <span className="chip border-amber-500/40 bg-amber-500/10 text-amber-300">In progress</span>;
  const map = {
    manual: ['Submitted', 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'],
    auto: ['Auto-submitted', 'border-sky-500/40 bg-sky-500/10 text-sky-300'],
    forced: ['Forced', 'border-rose-500/40 bg-rose-500/10 text-rose-300'],
  };
  const [text, cls] = map[attempt.submissionType] || map.manual;
  return <span className={`chip ${cls}`}>{text}</span>;
}

function RankMedal({ rank }) {
  const styles = {
    1: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    2: 'bg-slate-300/15 text-slate-200 border-slate-300/30',
    3: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
  };
  const cls = styles[rank] || 'bg-slate-800/60 text-slate-400 border-slate-700';
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold ${cls}`}>
      {rank}
    </span>
  );
}
