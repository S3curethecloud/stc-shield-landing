# MGF HANDOVER — STC Shield Landing

## 🔒 Context Block (Must Read)
- Repo State: STABLE / GOVERNED
- Architecture: STATIC-FIRST (LOCKED)
- Authority Mode: MGF-AUTHORITY-ALL
- Primary Objective:
  Preserve STC Shield’s public landing and read-only AI demo
  while preventing architectural or behavioral drift.
- Success Criteria:
  - Landing page remains fast, static, and credible
  - AI demo remains read-only and stable
  - No regression in UX, AI wiring, or security posture

---

## 1) Project Identity
- Repo Name: stc-shield-landing
- Local Path: /home/cloudlab/projects/stc-shield-landing
- Remote: https://github.com/S3curethecloud/stc-shield-landing.git
- Branch: main
- Owner: SecureTheCloud / Ola Omoniyi
- Repo Type: Product Landing Page (Static-First)

Purpose:
STC Shield Landing is the **public-facing marketing and demonstration surface**
for the STC Shield product. It communicates value, architecture, and trust,
and exposes a **read-only AI-powered demo UI** wired to STC AI.
This repository is not a control plane and must remain static-first.

---

## 2) Governance Status (AUTHORITATIVE)
- MGF Installed: YES
- Governing Files:
  - .mgf/mgf.yaml
  - .mgf/mgf-metadata.yaml
  - .mgf/mgf-decisions.md
  - .mgf/mgf-schema.json

Governance Rules:
- MGF files override chat memory and assumptions
- Locked decisions must not be reversed without explicit ADR updates

---

## 3) Current State
- Status: ACTIVE / STABLE
- Working Tree: CLEAN
- Deployment Model: Static hosting
- Security / Headers:
  - `_headers` file present
- Entry Points:
  - `/index.html`
  - `/request-demo/index.html`

---

## 4) What Is Working ✅

### UI / UX
- Shield landing layout stabilized
- CTA spacing and vertical rhythm polished
- Demo CTA width intentionally constrained
- Visual hierarchy consistent and professional

### AI Demo Integration
- STC AI client fully wired into Shield UI
- Centralized AI logic:
  - `js/ai.js`
- Runtime configuration isolated:
  - `js/config.js`
- Guarded client initialization
- Structured dataset citations rendered in UI

### Documentation & Assets
- Architecture reference:
  - `ARCHITECTURE-STC-SHIELD-AI.md`
- Diagrams:
  - `diagrams/shield-architecture.svg`
  - `diagrams/shield-architecture.png`
- Styling:
  - `css/shield.css`

---

## 5) What Is Locked 🔒 (DO NOT CHANGE)

The following are enforced by `.mgf/mgf-decisions.md`:

- Static-first architecture (HTML / CSS / JS only)
- No frontend frameworks (React, Next.js, Vue, etc.)
- Read-only demo behavior (no mutation, no configuration)
- Centralized AI logic in `js/ai.js`
- Configuration isolation in `js/config.js`
- No backend logic in this repository

Any change violating these constraints is **non-compliant**.

---

## 6) Architecture Summary

### Frontend
- HTML:
  - `index.html`
  - `request-demo/index.html`
- CSS:
  - `css/shield.css`
- JavaScript:
  - `js/ai.js` — Shield ↔ STC AI interaction
  - `js/config.js` — environment configuration

### AI Interaction Model
- Client-side requests to STC AI
- Responses rendered read-only in the UI
- Dataset citations included for credibility
- No write-back, mutation, or control actions

### Hosting
- Static hosting
- `_headers` used for security and caching controls

---

## 7) Recent Change Context
Recent commits represent **stabilization and hardening**:
- Centralization of AI UI logic
- Guarded client initialization
- Explicit runtime configuration
- Structured dataset citations
- Architecture documentation added

Interpretation:
The repository is **v1 demo complete** and should evolve cautiously.

---

## 8) NEXT EXECUTION STEP (AUTHORITATIVE)

### Priority 1 — Maintenance Mode
- Monitor AI endpoint stability
- Validate `js/config.js` environment values
- Apply only **surgical UX or copy edits** if required

### Priority 2 — Optional (Explicit Approval Required)
- Minor copy refinement
- Additional static diagrams
- Performance or accessibility polish

No new features or behaviors without a formal decision.

---

## 9) Guardrails (Non-Negotiable)
- Do NOT introduce frontend frameworks
- Do NOT inline AI logic into HTML
- Do NOT add configuration or mutation capabilities
- Do NOT turn this repo into a Shield console
- Do NOT duplicate logic from SecureTheCloud platform repos

---

## 10) How to Resume This Repo in a New ChatGPT Session

Paste **exactly** this:

---
MGF-AUTHORITY-ALL:
This repository is governed by .mgf/mgf.yaml.
Resume stc-shield-landing using MGF-HANDOVER.md as the source of truth.
Start from NEXT EXECUTION STEP.
Do not redesign architecture.
Ask at most one clarifying question at a time.
---
