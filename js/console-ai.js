/* ============================================================
   STC Shield — Canonical Finding → AI Sync (FIX)
   State-driven • Deterministic • Operator-trust-first
   ============================================================ */

let activeFinding = null;

/* ---------- DOM REFERENCES ---------- */
const findingItems = document.querySelectorAll(".finding-item");
const aiPanel = document.querySelector(".console-ai");
const aiStatus = aiPanel?.querySelector(".ai-status");
const aiExplanation = aiPanel?.querySelector(".ai-explanation");
const aiCitations = aiPanel?.querySelector(".ai-citations");
const aiButton = aiPanel?.querySelector(".ai-btn");

/* ---------- SANITY RESET (CRITICAL) ---------- */
/* AI MUST NEVER AUTO-ACTIVATE */
aiPanel?.classList.remove("active");

/* ---------- CANONICAL AI RENDER ---------- */
function renderAIForFinding(findingEl) {
  if (!findingEl) return;

  /* Update AI panel state (idempotent) */
  aiPanel?.classList.add("active");
  aiButton?.classList.remove("disabled");

  const title =
    findingEl.querySelector(".finding-title")?.textContent || "Finding";
  const severity =
    findingEl.querySelector(".severity")?.textContent || "";

  if (aiStatus) {
    aiStatus.textContent =
      "AI ready. Explanation will reference Shield data only.";
  }

  if (aiExplanation) {
    aiExplanation.textContent =
      `This finding (${severity}) was computed deterministically from the live identity graph. ` +
      `AI explanations describe reachability and impact without modifying system state.`;
  }

  if (aiCitations) {
    aiCitations.innerHTML =
      "<li>Shield identity graph (deterministic)</li>";
  }
}

/* ---------- FINDING SELECTION (AUTHORITATIVE) ---------- */
findingItems.forEach((item) => {
  item.addEventListener("click", () => {
    /* 1️⃣ Clear previous selection (always) */
    findingItems.forEach((el) =>
      el.classList.remove("selected", "active")
    );

    /* 2️⃣ Set new active finding */
    item.classList.add("selected", "active");
    activeFinding = item;

    /* 3️⃣ ALWAYS re-render AI panel */
    renderAIForFinding(activeFinding);
  });
});

/* ---------- TOOLTIP WIRING (UNCHANGED) ---------- */
(function () {
  // Tooltip JS intentionally unchanged
})();
