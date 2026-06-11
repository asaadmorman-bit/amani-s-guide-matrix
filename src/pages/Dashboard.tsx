import React, { useState } from 'react';

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentPersona, setCurrentPersona] = useState('Developer');
  const [keyVerified, setKeyVerified] = useState(false);

  const personas: Record<string, { username: string; role: string; color: string; blueprint: string }> = {
    Developer: { username: 'amani_dev_matrix', role: 'System_Architect', color: 'cyan', blueprint: 'PCI_DSS_v4_Tokenization_Filter' },
    Executive: { username: 'exec_clearance_amani', role: 'Exec_Assistant', color: 'indigo', blueprint: 'SOC2_Type_II_Audit_Pipeline' },
    Family: { username: 'family_lead_amani', role: 'Family_Lead', color: 'emerald', blueprint: 'Household_Pacing_Schedule' }
  };

  const active = personas[currentPersona] || personas.Developer;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans relative select-none">
      
      {/* 🚪 PHASE 1: WELCOME GATEWAY OVERLAY */}
      {!authenticated && (
        <div class="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center p-4">
          <div class="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div class="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-8 text-center relative z-10">
            <div class="space-y-3">
              <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-950 border border-slate-800 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-2xl">🛡️</div>
              <h1 class="text-xl font-black font-mono tracking-widest text-slate-100 uppercase pt-2">Amani Guide Matrix</h1>
              <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">Biometric-Responsive Workflow Orchestration Hub.</p>
            </div>
            <hr class="border-slate-800" />
            <button onClick={() => setAuthenticated(true)} class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-center rounded-xl font-black text-xs py-3.5 tracking-widest uppercase font-mono shadow-lg shadow-cyan-500/15 transition-all">
              Initialize Session Core
            </button>
          </div>
        </div>
      )}

      {/* 🖥️ PHASE 2: CORE MONITOR MATRIX UI */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] ${currentPersona === 'Developer' ? 'bg-cyan-400' : currentPersona === 'Executive' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></div>
          <h1 className="text-base font-bold tracking-wider font-mono text-slate-200">AMANI // WORKSPACE CORE</h1>
        </div>
        
        <div className="bg-slate-950 border border-slate-800 p-1 rounded-lg flex gap-1">
          {['Developer', 'Executive', 'Family'].map((p) => (
            <button key={p} onClick={() => setCurrentPersona(p)} className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === p ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-slate-400'}`}>
              {p}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 uppercase">{active.role}</span>
            <h2 className="text-xl font-black mt-2">Authorized Profile: <span className="font-mono text-cyan-400">@{active.username}</span></h2>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Active Target Execution Matrix</h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">⚠️ PIPELINES_GATED</span>
            </div>
            <div className="bg-slate-950 p-4 border border-slate-800/60 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-slate-200">{active.blueprint}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Deployment Engine Strategy State</div>
              </div>
              <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">PAUSED_HITL</span>
            </div>
          </section>

          <section className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner font-mono text-xs space-y-2">
            <div class="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2">
              <span>SYSTEM LOG STREAM // SUB-LATENCY POLLING</span>
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400 max-h-28 overflow-y-auto pt-1">
              <div>[13:42:01] <span className="text-cyan-400">INFO:</span> Initializing serverless edge execution layers... <span className="text-emerald-400">SUCCESS</span></div>
              <div>[13:45:14] <span className="text-indigo-400">RECV:</span> Ingesting biometric sync webhooks from <span className="text-slate-200">WHOOP_STRAP_4_0</span></div>
              <div>[13:45:15] <span className="text-amber-400">WARN:</span> Recovery value dropped to <span class="text-rose-400 font-bold">42%</span> (Threshold: 45%).</div>
              <div className="text-rose-400 font-bold bg-rose-500/5 p-1 rounded border border-rose-500/10 animate-pulse">
                [INTERCEPT] Gating active execution pipelines. Tripping Human-in-the-Loop circuit breaker token.
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Live Wearable Sync</h3>
            
            <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-slate-200">🦪 Oura Ring Gen3</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded">NOMINAL</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div className="text-[9px] text-slate-500 uppercase">Readiness</div>
                  <div class="font-bold text-emerald-400">78%</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div className="text-[9px] text-slate-500 uppercase">Sleep</div>
                  <div class="font-bold text-slate-200">82</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-slate-200">🚀 WHOOP Strap 4.0</span>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 rounded">WARNING</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div className="text-[9px] text-slate-500 uppercase">Recovery</div>
                  <div class="font-bold text-rose-400">42%</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div className="text-[9px] text-slate-500 uppercase">Strain</div>
                  <div class="font-bold text-slate-200">14.2</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
            <h4 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">Trigger Logic Diagnostics</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Pipelines gate if WHOOP recovery drops under <span class="text-rose-400 font-bold">45%</span>.</p>
            <div className="p-3 rounded-lg border text-center text-xs font-mono font-black tracking-wider uppercase bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse">
              🚨 Trigger Intercept: Manual Approval Required
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Hardware Access Layer</h3>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
              <div className="text-slate-300">🛡️ FIDO2 Token Matrix</div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${keyVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.2)]' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {keyVerified ? 'VERIFIED_AUTH' : 'STANDBY'}
              </span>
            </div>
            <button onClick={() => setKeyVerified(true)} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono font-bold text-[11px] py-2.5 rounded transition active:scale-95">
              🔑 Simulate Hardware Token Verification
            </button>
          </section>
        </div>

      </main>
    </div>
  );
}
