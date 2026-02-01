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

/* ---------- ARIA INIT (FINDINGS LIST) ---------- */
findingItems.forEach((el) => {
  el.setAttribute("role", "option");
  el.setAttribute("tabindex", "-1");
  el.setAttribute("aria-selected", "false");
});

/* ---------- SANITY RESET (CRITICAL) ---------- */
/* AI MUST NEVER AUTO-ACTIVATE */
aiPanel?.classList.remove("active");

/* Optional high-trust polish: live region for SRs */
aiPanel?.setAttribute("aria-live", "polite");
aiPanel?.setAttribute("aria-atomic", "true");

/* ---------- CANONICAL AI RENDER (ALIGN TO DOM) ---------- */
function renderAIForFinding(findingEl) {
  if (!findingEl || !aiPanel) return;

  /* SR: panel is updating */
  aiPanel.setAttribute("aria-busy", "true");

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

  /* SR: update complete */
  aiPanel.setAttribute("aria-busy", "false");
}

/* ---------- FINDING SELECTION (AUTHORITATIVE) ---------- */
findingItems.forEach((item) => {
  item.addEventListener("click", () => {
    /* 1️⃣ Clear previous selection (visual + ARIA) */
    findingItems.forEach((el) => {
      el.classList.remove("selected", "active");
      el.setAttribute("aria-selected", "false"); // ARIA sync (clear)
      el.setAttribute("tabindex", "-1");
    });

    /* 2️⃣ Set new active finding (visual + ARIA + focus) */
    item.classList.add("selected", "active");
    item.setAttribute("aria-selected", "true"); // ARIA sync (set)
    item.setAttribute("tabindex", "0");
    item.focus(); // quiet professionalism
    activeFinding = item;

    /* 3️⃣ ALWAYS re-render AI panel */
    renderAIForFinding(activeFinding);
  });
});

/* ---------- TOOLTIP WIRING (UNCHANGED) ---------- */
(function () {
  // Tooltip JS intentionally unchanged
})();
