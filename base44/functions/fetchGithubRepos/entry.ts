Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const currentPersona = url.searchParams.get("persona") || "Developer";
  const provider = url.searchParams.get("provider") || "";
  const token = url.searchParams.get("token") || "";
  const authenticated = url.searchParams.get("auth") === "true";

  // 🚪 PHASE 1: THE WELCOME / LOGIN GATEWAY LANDING PAGE
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
            <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-950 border border-slate-800 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-2xl">
              🛡️
            </div>
            <h1 class="text-xl font-black font-mono tracking-widest text-slate-100 uppercase pt-2">
              Amani Guide Matrix
            </h1>
            <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Biometric-Responsive Workflow Orchestration Hub for high-consequence operational ecosystems.
            </p>
          </div>

          <hr class="border-slate-800" />

          <div class="space-y-2 text-left">
            <div class="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-center gap-3">
              <span class="text-cyan-400 font-mono text-sm">01</span>
              <div>
                <div class="text-xs font-bold font-mono text-slate-300">Biometric Guardrails</div>
                <div class="text-[10px] text-slate-500">Live Oura/WHOOP stress pipeline gating.</div>
              </div>
            </div>
            <div class="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-center gap-3">
              <span class="text-indigo-400 font-mono text-sm">02</span>
              <div>
                <div class="text-xs font-bold font-mono text-slate-300">Adaptive UI Personas</div>
                <div class="text-[10px] text-slate-500">Dynamic Developer, Executive, & Family views.</div>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <a href="?auth=true&persona=Developer" class="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-center rounded-xl font-black text-xs py-3.5 tracking-widest uppercase font-mono shadow-lg shadow-cyan-500/15 transition-all transform active:scale-[0.98]">
              Initialize Session Core
            </a>
            <div class="text-[10px] font-mono text-slate-600 mt-3 tracking-wider uppercase">FIDO2 Hardware Key Verification Standby</div>
          </div>

        </div>

        <div class="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md text-[11px] tracking-widest font-mono font-bold text-cyan-400 shadow-2xl uppercase z-50">
          Technical
        </div>

      </body>
      </html>
    `;
    return new Response(landingHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 200,
    });
  }

  // 🖥️ PHASE 2: THE INTERACTIVE APPLICATION WORKSPACE DASHBOARD
  const personas: Record<string, any> = {
    Developer: {
      username: 'amani_dev_matrix',
      role: 'System_Architect',
      color: 'cyan',
      tagline: 'Orchestrator node active. All continuous pipelines isolated behind FIDO2 hardware keys.',
      blueprint: 'PCI_DSS_v4_Tokenization_Filter',
      status: 'SYNCHRONIZED'
    },
    Executive: {
      username: 'exec_clearance_amani',
      role: 'Exec_Assistant',
      color: 'indigo',
      tagline: 'Administrative grid online. Compliance auditing logs compiled for enterprise review panels.',
      blueprint: 'SOC2_Type_II_Audit_Pipeline',
      status: 'SYNCHRONIZED'
    },
    Family: {
      username: 'family_lead_amani',
      role: 'Family_Lead',
      color: 'emerald',
      tagline: 'Localized smart home mesh secure. Child tracking loops muted to satisfy strict COPPA boundaries.',
      blueprint: 'Household_Pacing_Schedule',
      status: 'PAUSED_HITL'
    }
  };

  const active = personas[currentPersona] || personas.Developer;

  let biometricHtml = "";
  if (!token) {
    biometricHtml = `
      <div class="space-y-3">
        <p class="text-xs text-slate-400">Sync live physiological telemetry to automatically gate automation pipelines based on user stress spikes:</p>
        <div class="grid grid-cols-1 gap-2 pt-1">
          <a href="?auth=true&persona=${currentPersona}&provider=oura&token=simulated_token" class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-center rounded font-semibold text-xs py-2 transition">🦪 Link Oura Profile</a>
          <a href="?auth=true&persona=${currentPersona}&provider=whoop&token=simulated_token" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-center rounded font-semibold text-xs py-2 transition">🚀 Link WHOOP Profile</a>
        </div>
      </div>
    `;
  } else {
    biometricHtml = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-950 p-3 border border-slate-800 rounded-lg">
            <div class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">HRV Balance</div>
            <div class="text-lg font-bold text-emerald-400 font-mono mt-0.5">64 <span class="text-xs text-slate-500 font-normal">ms</span></div>
          </div>
          <div class="bg-slate-950 p-3 border border-slate-800 rounded-lg">
            <div class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Resting HR</div>
            <div class="text-lg font-bold text-slate-200 font-mono mt-0.5">62 <span class="text-xs text-slate-500 font-normal">bpm</span></div>
          </div>
        </div>
        <div class="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
          <div class="text-slate-400 flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse inline-block mr-1"></span>
            Telemetry Stream: <span class="font-mono text-cyan-400 uppercase font-bold">${provider}</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PACING_NORMAL</span>
        </div>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AMANI MATRIX WORKSPACE</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans">
      
      <div class="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md text-[11px] tracking-widest font-mono font-bold text-cyan-400 shadow-2xl uppercase z-50">
        Technical
      </div>

      <header class="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-2.5 w-2.5 rounded-full bg-${active.color}-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
          <h1 class="text-base font-bold tracking-wider font-mono text-slate-200">AMANI // WORKSPACE CORE</h1>
        </div>
        
        <div class="bg-slate-950 border border-slate-800 p-1 rounded-lg flex gap-1">
          <a href="?auth=true&persona=Developer&token=${token}&provider=${provider}" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Developer' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}">Developer</a>
          <a href="?auth=true&persona=Executive&token=${token}&provider=${provider}" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Executive' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}">Executive</a>
          <a href="?auth=true&persona=Family&token=${token}&provider=${provider}" class="px-3 py-1 rounded text-xs font-mono font-bold transition ${currentPersona === 'Family' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}">Family</a>
        </div>
      </header>

      <main class="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 space-y-6">
          <section class="bg-gradient-to-br from-slate-900 to-slate-900/30 border border-slate-800/80 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div class="space-y-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-slate-800 border border-slate-700 text-slate-300 uppercase">${active.role}</span>
              <h2 class="text-2xl font-black tracking-tight mt-1">Authorized Profile: <span class="text-slate-100 font-mono">@${active.username}</span></h2>
              <p class="text-xs text-slate-400 leading-relaxed max-w-xl">${active.tagline}</p>
            </div>
          </section>

          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Active Workflow Pipeline</h3>
              <button class="text-[11px] font-mono bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-1 px-2.5 rounded transition">+ Custom Workflow</button>
            </div>
            <div class="bg-slate-950/50 p-4 border border-slate-800/60 rounded-xl flex items-center justify-between">
              <div class="space-y-0.5">
                <div class="font-mono text-sm text-slate-200">${active.blueprint}</div>
                <div class="text-[10px] text-slate-500 font-mono">Context Hash Validation Pass</div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">${active.status}</span>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono mb-4">Biometric Strain Index</h3>
            ${biometricHtml}
          </section>
          
          <section class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono mb-3">Hardware Credentials</h3>
            <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
              <div class="text-slate-300">🛡️ FIDO2 Token Master Key</div>
              <span class="text-emerald-400 font-bold text-[10px] uppercase">Locked</span>
            </div>
          </section>
        </div>

      </main>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
    status: 200,
  });
});
