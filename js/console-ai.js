/* ============================================================
   STC Shield — Canonical Finding → AI Sync (FIX)
   Deterministic • Enterprise-safe • No DOM assumptions
   ============================================================ */

let activeFinding = null;

/* ---------- DOM REFERENCES (EXISTING HTML ONLY) ---------- */
const findingItems = document.querySelectorAll(".finding-item");
const aiPanel = document.querySelector(".console-ai");
const aiButton = aiPanel?.querySelector(".btn");

const aiSubtitle = aiPanel?.querySelector(".ai-subtitle");
const aiExplanationBlock = aiPanel?.querySelector("p");
const aiCitationsBlock = aiPanel?.querySelectorAll("p")[1];

/* ---------- SANITY RESET (CRITICAL) ---------- */
/* AI MUST NEVER AUTO-ACTIVATE */
aiPanel?.classList.remove("active");

/* ---------- CANONICAL AI RENDER (ALIGN TO DOM) ---------- */
function renderAIForFinding(findingEl) {
  if (!findingEl || !aiPanel) return;

  aiPanel.classList.add("active");
  aiButton?.classList.remove("disabled");

  const severity =
    findingEl.querySelector(".severity")?.textContent || "UNKNOWN";

  if (aiSubtitle) {
    aiSubtitle.textContent =
      "AI ready. Explanation will reference Shield data only.";
  }

  if (aiExplanationBlock) {
    aiExplanationBlock.textContent =
      `This ${severity} severity finding was computed deterministically from the live identity graph. ` +
      `AI explanations describe reachability and impact without modifying system state.`;
  }

  if (aiCitationsBlock) {
    aiCitationsBlock.textContent =
      "Shield identity graph (deterministic)";
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
