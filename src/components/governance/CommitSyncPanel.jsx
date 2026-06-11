import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { GitCommit, RefreshCw, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function CommitSyncPanel() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleSync = async () => {
    if (!owner || !repo) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await base44.functions.invoke('syncGithubCommits', { owner, repo, branch });
    setLoading(false);

    if (response.data?.error) {
      setError(response.data.error);
    } else {
      setResult(response.data);
      setExpanded(true);
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <GitCommit className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">
          GitHub → Governance Engine Sync
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 block">Owner</label>
            <input
              value={owner}
              onChange={e => setOwner(e.target.value)}
              placeholder="e.g. octocat"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 block">Repository</label>
            <input
              value={repo}
              onChange={e => setRepo(e.target.value)}
              placeholder="e.g. amani-matrix"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 block">Branch</label>
          <input
            value={branch}
            onChange={e => setBranch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>

        <button
          onClick={handleSync}
          disabled={loading || !owner || !repo}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs py-2 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'SYNCING COMMITS...' : 'SYNC TO GOVERNANCE ENGINE'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-mono text-rose-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {result.synced} COMMITS SYNCED → {result.workflow}
              </span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-slate-500 hover:text-slate-300 transition"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expanded && (
            <div className="divide-y divide-slate-800/60 bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
              {result.commits.map((c, i) => (
                <div key={i} className="px-3 py-2 flex items-start gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                    {c.sha}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-slate-200 truncate">{c.message}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] font-mono text-slate-600 text-center">
            Logged to governance engine as WorkflowLog entries → {result.repo}@{result.branch}
          </p>
        </div>
      )}
    </section>
  );
}