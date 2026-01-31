# MGF DECISIONS — STC Shield Landing

## ADR-0001 — Static-First Landing Page
- Decision:
STC Shield Landing is implemented using static HTML, CSS, and JavaScript only.
- Status: LOCKED
- Consequence:
No React, Next.js, or server-rendered frameworks may be introduced.

## ADR-0002 — Read-Only Demo Surface
- Decision:
The Shield landing UI is a read-only demo and visualization surface.
- Status: LOCKED
- Consequence:
No configuration, mutation, or control-plane actions are allowed from this UI.

## ADR-0003 — Centralized AI Logic
- Decision:
All AI interaction logic must live in `js/ai.js`, with runtime configuration
isolated in `js/config.js`.
- Status: LOCKED
- Consequence:
Inline scripts or duplicated AI logic are not permitted.
