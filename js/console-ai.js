/* ============================================================
   STC Shield — Hybrid AI Layer (Authoritative)
   PURPOSE:
   - Listen for shield selection event
   - Enable AI explain
   - Call STC AI /ask/explain
   - Render explanation + citations
   ============================================================ */

(function () {

  const API_BASE = "https://stc-intelligence-core.fly.dev";
  const EXPLAIN_ENDPOINT = `${API_BASE}/ask/explain`;

  const aiRegion = document.querySelector(".console-ai");
  const aiButton = document.querySelector(".ai-btn");
  const explanationEl = document.getElementById("ai-explanation");
  const citationsEl = document.querySelector(".citations");
  const aiStateText = document.querySelector(".ai-state");

  if (!aiRegion || !aiButton || !explanationEl || !citationsEl) {
    console.warn("[console-ai] Required DOM elements not found");
    return;
  }

  let currentFinding = null;

  /* ============================================================
     Listen to Shield governed selection event
     ============================================================ */

  document.addEventListener("stc:shield:finding:selected", (e) => {

    currentFinding = e.detail?.finding || null;

    if (!currentFinding) return;

    aiButton.disabled = false;
    aiButton.classList.remove("disabled");
    aiButton.setAttribute("aria-disabled", "false");

    aiRegion.setAttribute("aria-disabled", "false");

    if (aiStateText) {
      aiStateText.textContent =
        "AI ready. Explanation will reference Shield data and Academy labs.";
      aiStateText.classList.remove("disabled");
    }

  });

  /* ============================================================
     Hybrid Explain
     ============================================================ */

  async function hybridExplain(finding) {

    const payload = {
      question: `Explain this Shield finding and what lab addresses it.
Severity: ${finding.severity}
Title: ${finding.title}
Summary: ${finding.risk_summary || ""}`,
      dataset: "academy.labs",
      context: { source: "shield-console" },
      mode: "shield_hybrid"
    };

    const res = await fetch(EXPLAIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`AI HTTP ${res.status}`);
    }

    return res.json();
  }

  /* ============================================================
     Button Click
     ============================================================ */

  aiButton.addEventListener("click", async () => {

    if (!currentFinding) return;

    aiRegion.setAttribute("aria-busy", "true");

    try {

      const envelope = await hybridExplain(currentFinding);

      explanationEl.textContent =
        envelope?.explanation || "No explanation returned.";

      citationsEl.innerHTML = "";

      const cites = Array.isArray(envelope?.citations)
        ? envelope.citations
        : [];

      if (cites.length === 0) {
        citationsEl.innerHTML = "<li>No datasets referenced.</li>";
      } else {
        cites.forEach(c => {
          const li = document.createElement("li");
          li.textContent = c;
          citationsEl.appendChild(li);
        });
      }

    } catch (err) {
      console.error("[console-ai] explain failed:", err);
      explanationEl.textContent = "AI explain failed.";
    } finally {
      aiRegion.setAttribute("aria-busy", "false");
    }

  });

})();
