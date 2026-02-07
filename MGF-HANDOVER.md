# MGF HANDOVER — STC Shield Landing

## 🔒 CONTEXT BLOCK (MUST READ FIRST)
- Repo State: STABLE / GOVERNED
- Authority Mode: MGF-AUTHORITY-ALL
- Architecture: STATIC-FIRST (LOCKED)
- Lifecycle Phase: Public Demo / Marketing Surface (v1)

Primary Objective:
Maintain STC Shield’s public-facing landing page and read-only AI demo
as a **stable, credible, static artifact** with zero architectural drift.

Success Criteria:
- Landing page remains fast, static, and production-safe
- AI demo remains read-only and deterministic
- No UX regressions, no AI wiring regressions, no framework creep

---

## 1) Project Identity
- Repo Name: stc-shield-landing
- GitHub: https://github.com/S3curethecloud/stc-shield-landing.git
- Local Path: /home/cloudlab/projects/stc-shield-landing
- Default Branch: main
- Owner: SecureTheCloud (Ola Omoniyi)
- Repo Type: Product Landing + Demo (Static-First)

Purpose:
STC Shield Landing is the **public marketing and demonstration surface**
for the STC Shield product. It communicates value, trust, and architecture
and exposes a **read-only AI-powered demo UI** wired to STC Intelligence.
This repository is **not** a control plane and must remain static-first.

---

## 2) Governance Status (AUTHORITATIVE)
MGF governance is installed and enforced.

Governing files:
- `.mgf/mgf.yaml`
- `.mgf/mgf-metadata.yaml`
- `.mgf/mgf-decisions.md`
- `.mgf/mgf-schema.json`

Governance Rules:
- MGF files override chat memory and assumptions
- Locked decisions may only be changed via explicit ADR updates
- Handover is the source of truth for resumption

---

## 3) Current State
- Status: ACTIVE / STABLE
- Working Tree: CLEAN
- Deployment Model: Static hosting
- Security Headers: `_headers` file present
- Public Entry Points:
  - `/index.html`
  - `/request-demo/index.html`

This repo is production-safe and demo-ready.

---

## 4) What Is Working ✅

### UI / UX
- Shield landing layout stabilized
- CTA spacing and vertical rhythm polished
- Demo CTA width intentionally constrained
- Visual hierarchy consistent and professional

### AI Demo Integration
- STC Intelligence client fully wired into Shield UI
- Centralized AI logic:
  - `js/ai.js`
- Runtime configuration isolated:
  - `js/config.js`
- Guarded AI client initialization
- Structured dataset citations rendered in the UI

### Documentation & Assets
- Architecture document:
  - `ARCHITECTURE-STC-SHIELD-AI.md`
- Diagrams:
  - `diagrams/shield-architecture.svg`
  - `diagrams/shield-architecture.png`
- Styling:
  - `css/shield.css`

---

## 5) Locked Decisions 🔒 (NON-NEGOTIABLE)

Enforced by `.mgf/mgf-decisions.md`:

- Static-first implementation only (HTML / CSS / JS)
- No frontend frameworks (React, Next.js, Vue, etc.)
- Read-only demo behavior (no mutation, no configuration)
- All AI logic must live in `js/ai.js`
- All environment config must live in `js/config.js`
- No backend or control-plane logic in this repo

Violating any of the above is **MGF non-compliance**.

---

## 6) Architecture Summary

### Frontend
- HTML:
  - `index.html`
  - `request-demo/index.html`
- CSS:
  - `css/shield.css`
- JavaScript:
  - `js/ai.js` — Shield ↔ STC Intelligence interaction
  - `js/config.js` — runtime/environment configuration

### AI Interaction Model
- Client-side calls to STC Intelligence endpoints
- Responses rendered read-only in the UI
- Dataset citations included for trust and auditability
- No write-back, no mutation, no persistence

### Hosting
- Static hosting (Cloudflare Pages / equivalent)
- `_headers` controls security and caching behavior

---

## 7) Recent Change Context
Recent commits represent **hardening and stabilization**:
- Centralized AI UI logic
- Guarded client initialization
- Explicit runtime configuration
- Dataset citations surfaced
- Architecture documentation added

Interpretation:
This repo is **v1 demo complete** and should evolve conservatively.

---

## 8) NEXT EXECUTION STEP (AUTHORITATIVE)

### Priority 1 — Maintenance Mode
- Monitor STC Intelligence endpoint stability
- Verify values in `js/config.js` when environments change
- Apply only **surgical UX or copy edits** if required

### Priority 2 — Optional (Explicit Approval Required)
- Minor copy refinement
- Additional static diagrams
- Performance or accessibility polish

No new features, behaviors, or flows without a formal decision.

---

## 9) Guardrails (DO NOT VIOLATE)
- Do NOT introduce frontend frameworks
- Do NOT inline AI logic into HTML
- Do NOT add configuration or mutation capabilities
- Do NOT turn this repo into a Shield console
- Do NOT duplicate logic from other SecureTheCloud repos

---

## 10) How to Resume This Repo in a New ChatGPT Session

Paste **exactly** this at the start of the new chat:

MGF-ABSOLUTE: Freeze Shield Console Preview v0.1

- Finalize Shield Console Preview UI (read-only, deterministic)
- Complete ARIA Phase 3 polish and keyboard navigation
- Integrate RiskDNA as a discoverable preview entry point
- Preserve no-remediation, no-mutation guarantees
- Lock visual alignment and operator-safe navigation

This freeze establishes a stable, audit-ready baseline.

---
MGF-AUTHORITY-ALL:
This repository is governed by .mgf/mgf.yaml.
Resume stc-shield-landing using MGF-HANDOVER.md as the source of truth.
Start from NEXT EXECUTION STEP.
Do not redesign architecture.
Ask at most one clarifying question at a time.
---
