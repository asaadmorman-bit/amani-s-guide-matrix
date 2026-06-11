Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const currentPersona = url.searchParams.get("persona") || "Developer";
  const provider = url.searchParams.get("provider") || "all";
  const token = url.searchParams.get("token") || "active";
  const authenticated = url.searchParams.get("auth") === "true";

  // Mocked physiological parameters for demonstration
  const metrics = {
    oura: { sleepScore: 82, readiness: 78, rhr: 58, hrv: 68, status: "NOMINAL" },
    whoop: { strain: 14.2, recovery: 42, rhr: 64, hrv: 52, status: "WARNING" }
  };

  // Determine automation trigger threshold status based on combined metrics
  // If WHOOP recovery falls below 45%, automation pipelines automatically gate
  const pipelineGated = metrics.whoop.recovery < 45;

  // 🚪 PHASE 1: WELCOME GATEWAY
  if (!authenticated) {
    const landingHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>AMANI GUIDE MATRIX // PORTAL</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center antialiased font-sans p-4 relative overflow-hidden">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div class="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-8 relative z-10 text-center">
          <div class="space-y-3">
            <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-950 border border-slate-800 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-2xl">🛡️</div>
            <h1 class="text-xl font-black font-mono tracking-widest text-slate-100 uppercase pt-2">Amani Guide Matrix</h1>
            <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">Biometric-Responsive Workflow Orchestration Hub.</p>
          </div>
          <hr class="border-slate-800" />
          <div class="pt-2">
            <a href="?auth=true&persona=Developer" class="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-center rounded-xl font-black text-xs py-3.5 tracking-widest uppercase font-mono shadow-lg shadow-cyan-500/15 transition-all">
              Initialize Session Core
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
    return new Response(landingHtml, { headers: { "Content-Type": "text/html" }, status: 200 });
  }

  // 🖥️ PHASE 2: CORE WORKSPACE
  const personas: Record<string, any> = {
    Developer: { username: 'amani_dev_matrix', role: 'System_Architect', color: 'cyan', blueprint: 'PCI_DSS_v4_Tokenization_Filter' },
    Executive: { username: 'exec_clearance_amani', role: 'Exec_Assistant', color: 'indigo', blueprint: 'SOC2_Type_II_Audit_Pipeline' },
    Family: { username: 'family_lead_amani', role: 'Family_Lead', color: 'emerald', blueprint: 'Household_Pacing_Schedule' }
  };

  const active = personas[currentPersona] || personas.Developer;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AMANI MATRIX WORKSPACE</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans">
      
      <header class="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-2.5 w-2.5 rounded-full bg-${active.color}-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
          <h1 class="text-base font-bold tracking-wider font-mono text-slate-200">AMANI // WORKSPACE CORE</h1>
        </div>
        
        <div class="bg-slate-950 border border-slate-800 p-1 rounded-lg flex gap-1">
          <a href="?auth=true&persona=Developer" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Developer' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400'}">Developer</a>
          <a href="?auth=true&persona=Executive" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Executive' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400'}">Executive</a>
          <a href="?auth=true&persona=Family" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Family' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400'}">Family</a>
        </div>
      </header>

      <main class="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 space-y-6">
          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 uppercase">${active.role}</span>
            <h2 class="text-xl font-black mt-2">Authorized Profile: <span class="text-${active.color}-400 font-mono">@${active.username}</span></h2>
          </section>

          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Active Target Execution Matrix</h3>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${pipelineGated ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
                ${pipelineGated ? '⚠️ PIPELINES_GATED' : '✓ SYSTEMS_ACTIVE'}
              </span>
            </div>
            <div class="bg-slate-950 p-4 border border-slate-800/60 rounded-xl flex items-center justify-between">
              <div>
                <div class="font-mono text-sm text-slate-200">${active.blueprint}</div>
                <div class="text-[10px] text-slate-500 font-mono mt-0.5">Deployment Engine Strategy State</div>
              </div>
              <span class="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold ${pipelineGated ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}">
                ${pipelineGated ? 'PAUSED_HITL' : 'RUNNING_AUTOMATED'}
              </span>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Live Wearable Sync</h3>
            
            <div class="bg-slate-950 p-3.5 border border-slate-800 rounded-xl space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">🦪 Oura Ring Gen3</span>
                <span class="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded">${metrics.oura.status}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div class="text-[9px] text-slate-500 uppercase tracking-wider">Readiness</div>
                  <div class="text-sm font-mono font-bold text-emerald-400">${metrics.oura.readiness}%</div>
                </div>
                <div class="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div class="text-[9px] text-slate-500 uppercase tracking-wider">Sleep Score</div>
                  <div class="text-sm font-mono font-bold text-slate-200">${metrics.oura.sleepScore}</div>
                </div>
              </div>
            </div>

            <div class="bg-slate-950 p-3.5 border border-slate-800 rounded-xl space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">🚀 WHOOP Strap 4.0</span>
                <span class="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 rounded">${metrics.whoop.status}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div class="text-[9px] text-slate-500 uppercase tracking-wider">Recovery Index</div>
                  <div class="text-sm font-mono font-bold text-rose-400">${metrics.whoop.recovery}%</div>
                </div>
                <div class="bg-slate-900/50 p-2 rounded border border-slate-800/40">
                  <div class="text-[9px] text-slate-500 uppercase tracking-wider">Day Strain</div>
                  <div class="text-sm font-mono font-bold text-slate-200">${metrics.whoop.strain}</div>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
            <h4 class="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">Trigger Logic Diagnostics</h4>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Current safety parameter rules gate background serverless functions if WHOOP recovery drops under <span class="font-mono text-rose-400 font-bold">45%</span>.
            </p>
            <div class="p-3 rounded-lg border text-center text-xs font-mono font-black tracking-wider uppercase ${pipelineGated ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}">
              ${pipelineGated ? '🚨 Trigger Intercept: Manual Approval Required' : '✓ Telemetry Normal: Pipelines Clear'}
            </div>
          </section>
        </div>

      </main>
    </body>
    </html>
  `;

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 200 });
});
