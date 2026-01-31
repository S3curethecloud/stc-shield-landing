# MGF HANDOVER — STC Shield Landing

## 1) Project Identity
- Repo Name: stc-shield-landing
- Local Path: /home/cloudlab/projects/stc-shield-landing
- Remote: https://github.com/S3curethecloud/stc-shield-landing.git
- Active Branch: main
- Owner: SecureTheCloud / Ola Omoniyi
- Repo Type: Product Landing Page (static-first)

Purpose:
STC Shield Landing is the **public-facing landing and demo entry point** for the STC Shield product.
It presents the Shield value proposition, architecture, and a live AI-powered demo UI wired to STC AI.
This repo is intentionally static-first and optimized for clarity, credibility, and conversion.

---

## 2) Current State (AUTHORITATIVE)
- Status: ACTIVE / STABLE
- Working Tree: CLEAN
- Deployment Model: Static site (Cloudflare Pages–style headers present)
- Canonical Entry:
  - `/index.html`
- Demo Flow:
  - `/request-demo/index.html`
- MGF Status: NOT YET INSTALLED (no .mgf directory)

---

## 3) What Is Working ✅

### UI / UX
- Shield landing page layout stabilized
- CTA spacing and vertical rhythm polished
- Demo CTA width constrained for visual balance
- Architecture visuals present (PNG + SVG)

### AI Integration
- STC AI client fully wired into Shield UI
- Centralized AI logic:
  - `js/ai.js`
- Explicit runtime config:
  - `js/config.js`
- Guarded client initialization (prevents runtime breakage)
- Structured dataset citations surfaced in UI

### Documentation
- Architecture document:
  - `ARCHITECTURE-STC-SHIELD-AI.md`
- Diagrams:
  - `diagrams/shield-architecture.png`
  - `diagrams/shield-architecture.svg`

---

## 4) What Is Locked (DO NOT CHANGE) 🔒

- Static-first architecture (no frameworks)
- Centralized AI logic in `js/ai.js`
- Config separation via `js/config.js`
- Shield landing remains **read-only demo**, not a control plane
- No backend logic added to this repo

These decisions are reinforced by recent commits:
- B2: Centralize STC AI UI logic
- B2: Guard AI client + explicit config
- B3: Structured dataset citations

---

## 5) Architecture Summary

### Frontend
- HTML:
  - `index.html`
  - `request-demo/index.html`
- CSS:
  - `css/shield.css`
- JS:
  - `js/ai.js` (core Shield ↔ AI interaction)
  - `js/config.js` (runtime config)

### AI Interaction Model
- Client-side calls to STC AI endpoint
- Responses rendered in Shield UI
- Citations displayed for credibility
- No mutation or write-back behavior

### Hosting
- Static hosting
- `_headers` file indicates security headers / caching rules

---

## 6) Recent Commit Context
Last 10 commits show a **focused stabilization phase**:
- AI logic consolidation
- Guardrails around config and client init
- UX polish and spacing normalization
- Architecture documentation added

Interpretation:
The repo is **feature-complete for v1 demo** and entering a maintenance / polish phase.

---

## 7) NEXT EXECUTION STEP (AUTHORITATIVE)

### Priority 1 — Install MGF Governance
To align with the rest of the SecureTheCloud ecosystem, this repo must be brought under MGF.

Actions:
1. Create `.mgf/` directory
2. Add:
   - `mgf.yaml`
   - `mgf-metadata.yaml`
   - `mgf-decisions.md`
   - `mgf-schema.json`

This enables:
- future handover generation
- STI / STC Intelligence indexing
- enforced continuity

---

### Priority 2 — Optional (Only If Needed)
- Validate AI endpoint URL in `js/config.js`
- Confirm production vs demo environment handling
- Add minor copy polish if product positioning evolves

---

## 8) Guardrails (DO NOT VIOLATE)

- Do NOT add frontend frameworks (React, Next.js, etc.)
- Do NOT move AI logic back into inline scripts
- Do NOT turn this into a configuration UI
- Do NOT duplicate Shield logic from the main platform
- Do NOT break the `/request-demo` flow

---

## 9) How to Resume This Repo in a New ChatGPT Session

Paste **exactly** this:

---
MGF-AUTHORITY-ALL:
Resume stc-shield-landing using MGF-HANDOVER.md as the source of truth.
Start from “NEXT EXECUTION STEP”.
Do not redesign architecture.
Ask at most one clarifying question at a time.
---

