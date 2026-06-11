# 🛡️ Amani Guide Matrix // Physiological Guardrail Core

The **Amani Guide Matrix** is an adaptive, biometric-responsive orchestration engine and zero-trust proxy gateway. Built on static edge computing infrastructure, it continuously monitors real-time human physiological markers to act as an automated software circuit breaker—shielding production deployments, critical background pipelines, and shared system states from human error during periods of severe physical fatigue or acute burnout.

---

## 🏗️ Architectural Topology

The core system processes raw biometric data feeds to dynamically calculate infrastructure risk parameters, passing execution flags down to CI/CD workflows and visual workspaces:

[ Wearable Ecosystem ]       --->  (Real-Time Bio Telemetry Ingress)
          |
          v
[ Deno Serverless Edge ]     --->  (Evaluates Thresholds: WHOOP Recovery < 45%)
          |
          +---> [ /api/health-gate ]  ---> Trigger Gating State (True/False)
          |                                            |
          |                                            v
          +---> [ Interactive Workspace ]    [ GitHub Actions CI/CD Pipeline ]
                - Developer Mode                  - Intercepts Code Pushes
                - Executive Clearance             - Fails Fatigued Commits
                - Family Safe View                - Demands FIDO2 Hardware Key

   ---

## ⚡ Core Operational Capabilities

* **Biometric Pipeline Intercepts:** Automated infrastructure protection logic that halts execution if custom thresholds are breached (e.g., WHOOP RecoveryIndex $< 45\%$ or Oura Readiness $< 50\%$).
* **Dynamic Persona Management:** Instantly updates global environment contexts, themes, and execution blueprints across three discrete structural tiers:
  * 🖥️ **Developer Mode:** Focuses on code safety frameworks and compliance tokenization filters.
  * 💼 **Executive Clearance:** Direct operations control panel with audit pipeline views.
  * 🏡 **Family Safe View:** Shared household pacing and safe context schedules.
* **Dual-Ingress Runtime Engine:** Seamlessly serves an interactive web dashboard to humans while exposing a highly performant, ultra-low-latency JSON REST endpoint (`/api/health-gate`) to automated backend cron scripts.
* **Zero-Trust Hardware Access Controls:** Simulates physical FIDO2 tokens (e.g., YubiKey Matrix hardware keys) as a mandatory authorization bypass for locked processes.

---

## 🛠️ Global Deployment & Configuration

### Prerequisites
The runtime engine compiles natively as a lightweight serverless script.
* [Deno Runtime Env](https://deno.land/) (v1.30.0+ recommended)
* A valid DNS custom domain or server routing point

### Environment Variables
To map real-world production credentials, provision and bind the following keys within your hosting environment variables:

| Secret Key Identifier | Purpose / Source Location |
| :--- | :--- |
| `OURA_PERSONAL_ACCESS_TOKEN` | Generated via the [Oura Cloud Developer Dashboard](https://cloud.ouraring.com/developers). |
| `WHOOP_ACCESS_TOKEN` | OAuth Bearer token generated inside the [WHOOP Developer Portal](https://developer.whoop.com/). |

---

## 🔗 Deep Integration: GitHub Actions Biometric Gate

To activate the physiological firewall inside your GitHub workflows, store your live deployment path as a repository secret named `BIOMETRIC_GATE_URL` (pointing to `https://your-domain.com/api/health-gate`), and create a workflow file at `.github/workflows/biometric-gate.yml`:

```yaml
name: "🛡️ PRE-FLIGHT BIOMETRIC GUARD"
on:
  push:
    branches: [ main ]

jobs:
  evaluate-health-gate:
    runs-on: ubuntu-latest
    steps:
      - name: "Fetch Live Telemetry Matrix Token"
        id: check_gate
        run: |
          RESPONSE=$(curl -s "${{ secrets.BIOMETRIC_GATE_URL }}")
          GATED=$(echo "$RESPONSE" | grep -o '"automationGated":\s*[a-z]*' | cut -d: -f2 | xargs)
          echo "gated=$GATED" >> $GITHUB_OUTPUT

      - name: "Evaluate Health Threshold Guardrails"
        if: steps.check_gate.outputs.gated == 'true'
        run: |
          echo "🚨 CRITICAL INTERCEPT: Biometric metrics show severe exhaustion. Build halted."
          exit 1             
