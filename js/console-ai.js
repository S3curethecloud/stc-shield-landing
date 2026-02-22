/* ============================================================
   STC Shield — Console AI Logic (Authoritative, event-driven)
   - No selection logic here (owned by console-data.js)
   - Listens for stc:shield:finding:selected
   ============================================================ */

(function () {
  const aiPanel = document.querySelector(".console-ai");
  if (!aiPanel) {
    console.warn("[console-ai] AI panel not found");
    return;
  }

  const aiButton = aiPanel.querySelector(".ai-btn");
  const aiSubtitle = aiPanel.querySelector(".ai-subtitle");
  const aiExplanationBlock = aiPanel.querySelectorAll("p")[0];
  const aiCitationsBlock = aiPanel.querySelectorAll("p")[1];

  let activeFinding = null;

  function setDisabled() {
    aiPanel.classList.remove("active");
    aiPanel.setAttribute("aria-disabled", "true");
    aiButton?.classList.add("disabled");
    aiButton?.setAttribute("aria-disabled", "true");
    aiButton?.setAttribute("disabled", "true");
    if (aiSubtitle) aiSubtitle.textContent = "Select a finding to enable AI explanations.";
    if (aiExplanationBlock) aiExplanationBlock.textContent = "—";
    if (aiCitationsBlock) aiCitationsBlock.textContent = "No datasets referenced.";
  }

  function setEnabled(finding) {
    aiPanel.setAttribute("aria-busy", "true");
    aiPanel.setAttribute("aria-disabled", "false");
    aiButton?.classList.remove("disabled");
    aiButton?.removeAttribute("aria-disabled");
    aiButton?.removeAttribute("disabled");

    const sev = String(finding?.severity || "UNKNOWN").toUpperCase();
    const title = String(finding?.title || "Finding");

    if (aiSubtitle) {
      aiSubtitle.textContent = "AI ready. Explanation will reference Shield data only.";
    }

    if (aiExplanationBlock) {
      aiExplanationBlock.textContent =
        `This ${sev} finding (“${title}”) was computed deterministically from Shield’s identity model. ` +
        `AI explanations describe reachability + impact without modifying system state.`;
    }

    if (aiCitationsBlock) {
      aiCitationsBlock.textContent = "Shield findings feed (deterministic)";
    }

    aiPanel.setAttribute("aria-busy", "false");
  }

  // Listen for governed selection event
  document.addEventListener("stc:shield:finding:selected", (e) => {
    const f = e?.detail?.finding;
    if (!f) return;
    activeFinding = f;
    setEnabled(activeFinding);
  });

  // Button action (placeholder now; Hybrid reasoning comes next step)
  aiButton?.addEventListener("click", () => {
    if (!activeFinding) return;
    // Next phase: call /ask/explain in hybrid mode
    // For now: keep deterministic UI-only behavior
    if (aiExplanationBlock) {
      aiExplanationBlock.textContent =
        "Hybrid reasoning pending: Lab explanation + Shield severity summary (next step).";
    }
    if (aiCitationsBlock) {
      aiCitationsBlock.textContent =
        "Pending: academy.labs (lab-linked) + shield.findings";
    }
  });

  // Default state
  setDisabled();
})();
