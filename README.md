# 🛡️ Amani Guide Matrix // Physiological Guardrail Core

The **Amani Guide Matrix** is an adaptive, biometric-responsive orchestration engine and zero-trust proxy gateway. Built on static edge computing infrastructure, it continuously monitors real-time human physiological markers to act as an automated software circuit breaker—shielding production deployments, critical background pipelines, and shared system states from human error during periods of severe physical fatigue or acute burnout.

---

## 🏗️ Architectural Topology

The core system processes raw biometric data feeds to dynamically calculate infrastructure risk parameters, passing execution flags down to CI/CD workflows and visual workspaces:

```text
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
🧪 Simulation & Parameters Override
The engine supports dynamic query-string parameters natively. This allows system administrators to easily simulate physiological fatigue scenarios or clear gated blocks right inside the browser window without waiting for physical metric data changes:

Simulate Critical Exhaustion (Trip the Circuit Breaker): https://your-domain.com/?auth=true&whoop_recover=30

Simulate High Readiness (Clear Gating Logic): https://your-domain.com/?auth=true&whoop_recover=85&oura_ready=90

🔒 Security Architecture & Vulnerability Disclosure
The Amani Guide Matrix acts as an active gatekeeper to infrastructure pipelines. To maintain a strict zero-trust boundary, the system implements the following security vectors natively:

Cryptographic Local Bypass: Gated states can only be bypassed via real physical cryptographic handshakes using the Web Authentication (WebAuthn) API. No session injection attacks or string tampering can clear a gate without a physical FIDO2 credential.

Ephemeral Ingress (No Storage Data Persistence): Telemetry responses are compiled dynamically directly out of runtime system memory. No biometric data points, sleep indices, or physiological logs are stored inside an internal database, reducing tracking footprints to zero.

Transport Encryption Framework: All system communication channels natively enforce TLS 1.3 encryption layers to protect the transmission of private wearable metrics.

Reporting Vulnerabilities
If you identify a security vulnerability, side-channel attack vector, or query-string injection flaw inside this architecture, please do not open a public GitHub Issue. Instead, follow a responsible disclosure process by opening a confidential security advisory channel through the GitHub repository management tab.

🤝 Contribution Guidelines
We welcome community adjustments to enhance the resilience of the physiological firewall.

Fork the Repository to your independent development workspace.

Create a Feature Branch targeting a specific telemetry provider optimization or security feature:

Bash
git checkout -b feature/impl-apple-healthkit-ingress
Write Zero-Dependency Code: To ensure maximum deployment flexibility on Deno serverless edge instances, all external data fetches must use raw standard web platform web APIs (fetch, Crypto, WebAuthn) without adding third-party packages.

Submit a Clear Pull Request (PR) explicitly detailing the verification tests you ran to confirm performance.

📜 Official Architecture License
This project framework is licensed under the terms of the MIT License.

Plaintext
Copyright (c) 2026 Emerging Defense Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
