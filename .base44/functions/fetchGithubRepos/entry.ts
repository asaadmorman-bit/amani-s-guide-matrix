Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  
  // 🧭 PERSISTENT APP STATE LAYER
  const currentPersona = url.searchParams.get("persona") || "Developer";
  const authenticated = url.searchParams.get("auth") === "true";

  // 📡 NATIVE BASE44 TELEMETRY BINDING OVERRIDES
  const liveOuraSleep = Number(globalThis?.Base44?.metrics?.oura?.sleepScore) || Number(url.searchParams.get("oura_sleep")) || 82;
  const liveOuraReady = Number(globalThis?.Base44?.metrics?.oura?.readiness) || Number(url.searchParams.get("oura_ready")) || 78;
  const liveOuraStatus = globalThis?.Base44?.metrics?.oura?.status || url.searchParams.get("oura_status") || "NOMINAL";

  const liveWhoopStrain = Number(globalThis?.Base44?.metrics?.whoop?.strain) || Number(url.searchParams.get("whoop_strain")) || 14.2;
  const liveWhoopRecover = Number(globalThis?.Base44?.metrics?.whoop?.recovery) || Number(url.searchParams.get("whoop_recover")) || 42;
  const liveWhoopStatus = globalThis?.Base44?.metrics?.whoop?.status || url.searchParams.get("whoop_status") || "WARNING";

  const metrics = {
    oura: { sleepScore: liveOuraSleep, readiness: liveOuraReady, status: liveOuraStatus },
    whoop: { strain: liveWhoopStrain, recovery: liveWhoopRecover, status: liveWhoopStatus }
  };

  // 🚨 AUTOMATION TRIPPING CIRCUIT CRITERIA
  const pipelineGated = metrics.whoop.recovery < 45 || metrics.oura.readiness < 50;

  // =========================================================================
  // 📥 MACHINE INGRESS: SECURE TRIPPING API FEED
  // =========================================================================
  if (url.pathname === "/api/health-gate") {
    const apiPayload = {
      timestamp: new Date().toISOString(),
      automationGated: pipelineGated,
      telemetry: {
        oura: { readinessScore: metrics.oura.readiness, status: metrics.oura.status },
        whoop: { recoveryScore: metrics.whoop.recovery, status: metrics.whoop.status }
      }
    };
    return new Response(JSON.stringify(apiPayload, null, 2), {
      headers: { 
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      },
      status: 200
    });
  }

  // 🎛️ PERSONA MANAGEMENT REGISTER
  const personas: Record<string, { username: string; role: string; color: string; blueprint: string }> = {
    Developer: { username: 'amani_dev_matrix', role: 'System_Architect', color: 'cyan', blueprint: 'PCI_DSS_v4_Tokenization_Filter' },
    Executive: { username: 'exec_clearance_amani', role: 'Exec_Assistant', color: 'indigo', blueprint: 'SOC2_Type_II_Audit_Pipeline' },
    Family: { username: 'family_lead_amani', role: 'Family_Lead', color: 'emerald', blueprint: 'Household_Pacing_Schedule' }
  };

  const active = personas[currentPersona] || personas.Developer;

  // 🚪 GATEWAY 1: THE UNAUTHENTICATED PUBLIC PORTAL
  if (!authenticated) {
    const landingHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            <button onclick="clearanceRedirect()" class="w-full block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-center rounded-xl font-black text-xs py-3.5 tracking-widest uppercase font-mono shadow-lg shadow-cyan-500/15 transition-all">
              Initialize Session Core
            </button>
          </div>
        </div>
        <script>
          function clearanceRedirect() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("auth", "true");
            currentUrl.searchParams.set("persona", "Developer");
            window.location.href = currentUrl.toString();
          }
        </script>
      </body>
      </html>
    `;
    return new Response(landingHtml, { 
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }, 
      status: 200 
    });
  }

  // 🖥️ GATEWAY 2: CORE MONITOR MATRIX WORKSPACE
  const dashboardHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AMANI MATRIX WORKSPACE</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans relative select-none">
      
      <header class="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] bg-${active.color}-400"></div>
          <h1 class="text-base font-bold tracking-wider font-mono text-slate-200">AMANI // WORKSPACE CORE</h1>
        </div>
        
        <div class="bg-slate-950 border border-slate-800 p-1 rounded-lg flex gap-1">
          <button onclick="updatePersona('Developer')" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Developer' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400'}">Developer</button>
          <button onclick="updatePersona('Executive')" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Executive' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400'}">Executive</button>
          <button onclick="updatePersona('Family')" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Family' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400'}">Family</button>
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

          <section class="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner font-mono text-xs space-y-2">
            <div class="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2">
              <span>SYSTEM LOG STREAM // SUB-LATENCY POLLING</span>
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div class="space-y-1.5 text-[11px] leading-relaxed max-h-28 overflow-y-auto pt-1 text-slate-400">
              <div><span class="text-slate-600">[14:02:11]</span> <span class="text-cyan-400 font-bold">INFO:</span> Initializing Deno serverless edge execution layer... <span class="text-emerald-400">SUCCESS</span></div>
              <div><span class="text-slate-600">[14:02:12]</span> <span class="text-cyan-400 font-bold">INFO:</span> Listening on global ingress routing gateway proxy hooks.</div>
              <div><span class="text-slate-600">[14:05:14]</span> <span class="text-indigo-400 font-bold">RECV:</span> Ingesting physiological telemetry webhook array from compiled Base44 source.</div>
              <div><span class="text-slate-600">[14:05:15]</span> <span class="text-amber-400 font-bold">WARN:</span> Recovery value processed at <span class="text-rose-400 font-bold">${metrics.whoop.recovery}%</span> (Threshold ceiling: 45%).</div>
              <div class="text-rose-400 font-bold bg-rose-500/5 p-1 rounded border border-rose-500/10 ${pipelineGated ? 'block animate-pulse' : 'hidden'}">
                <span class="text-slate-600">[14:05:15]</span> [INTERCEPT] Gating active execution pipelines. Tripping Human-in-the-Loop circuit breaker token.
              </div>
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

          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
            <h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Hardware Access Layer</h3>
            <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
              <div class="text-slate-300">🛡️ FIDO2 YubiKey Matrix Core</div>
              <span id="keyStatus" class="text-amber-400 font-bold text-[10px] uppercase bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20 rounded">STANDBY</span>
            </div>
            <button onclick="verifyKey()" class="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono font-bold text-[11px] py-2.5 rounded transition shadow-lg active:scale-[0.98]">
              🔑 Simulate Hardware Token Verification
            </button>
          </section>
        </div>

      </main>

      <script>
        function updatePersona(targetPersona) {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("persona", targetPersona);
          window.location.href = currentUrl.toString();
        }

        function verifyKey() {
          const badge = document.getElementById('keyStatus');
          badge.innerText = "VERIFIED_AUTH";
          badge.className = "text-emerald-400 font-bold text-[10px] uppercase bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded shadow-[0_0_8px_rgba(52,211,153,0.2)]";
        }
      </script>

      <div class="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md text-[11px] tracking-widest font-mono font-bold text-cyan-400 shadow-2xl uppercase z-50">
        Technical Stable Core
      </div>

    </body>
    </html>
  `;

  return new Response(dashboardHtml, { 
    headers: { 
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }, 
    status: 200 
  });
});
