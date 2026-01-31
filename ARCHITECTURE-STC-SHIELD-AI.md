# STC Shield ↔ STC AI Architecture (v1.0)

## Overview

STC Shield integrates with STC AI using a strict UI ↔ API contract.
Shield acts as a **read-only operator console**, while STC AI serves as the
**authoritative reasoning engine**.

This separation is intentional and enforced.

---

## System Responsibilities

### STC Shield (UI / Consumer)
- Static HTML, CSS, and JavaScript
- Collects user questions
- Sends requests to STC AI over HTTP
- Renders results, explanations, and citations
- Contains **no AI logic** and **no backend state**

### STC AI (`stc-intelligence-core`) (Provider)
- FastAPI backend
- Deterministic query engine
- LLM-based explanation layer
- Dataset ingestion (CSV, MGF-governed)
- Exposes `/ask` and `/ask/explain` endpoints
- Returns structured, explainable payloads

---

## Integration Contract (Frozen v1.0)

### Configuration (A3)
**File:** `js/config.js`

```js
window.STC_CONFIG = {
  AI_API_BASE: "http://127.0.0.1:8000"
};
Single source of truth for the AI endpoint.
No hardcoded URLs exist in HTML or logic.

API Client (A4)
File: js/ai.js

async function askSTCAI(question) { ... }
Encapsulates all HTTP communication

Calls POST /ask/explain

Throws explicit errors on non-200 responses

Renderer (A5)
File: js/ai.js

function renderAnswer(payload) { ... }
Converts AI payload → DOM

Renders:

question

explanation

result (JSON)

citations

HTML remains dumb and stable

Wiring (A6)
File: index.html

#ai-btn → askSTCAI() → renderAnswer()
Shield owns event wiring only.
All reasoning and interpretation live in STC AI.

Payload Expectations
STC AI returns:

{
  "question": "...",
  "result": {...},
  "explanation": "...",
  "citations": [
    {
      "dataset": "name",
      "authority": "MGF-AUTHORITY-ALL",
      "last_sync": "timestamp"
    }
  ]
}
Missing fields are handled gracefully.

Design Principles
Clear separation of concerns

UI and AI deploy independently

No shared state

No embedded demos or mock data

Read-only by design

Compliance- and audit-ready
