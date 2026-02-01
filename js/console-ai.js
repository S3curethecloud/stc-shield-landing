/* ================================
   STC SHIELD — AI PANEL LOGIC v1.2
   State-driven • Operator-trust-first
   ================================ */

/* ---------- CANONICAL STATE ---------- */
let activeFindingId = null;

/* ---------- DOM REFERENCES ---------- */
const findingItems = document.querySelectorAll(".finding-item");
const aiPanel = document.querySelector(".console-ai");
const aiButton = aiPanel?.querySelector("button");
const aiStateText = aiPanel?.querySelector(".ai-state");
const aiExplanation = aiPanel?.querySelector(".ai-output p");
const aiCitations = aiPanel?.querySelector(".citations");

/* ---------- SANITY RESET (CRITICAL) ---------- */
/* AI MUST NEVER AUTO-ACTIVATE */
document
  .querySelector(".console-ai")
  ?.classList.remove("active");

/* ---------- ENABLE AI (IDEMPOTENT) ---------- */
function enableAI() {
  aiPanel?.classList.add("active");
  if (aiButton) aiButton.disabled = false;

  if (aiStateText) {
    aiStateText.textContent =
      "AI ready. Explanation will reference Shield data only.";
  }
}

/* ---------- RENDER AI PANEL (STATE-DRIVEN) ---------- */
function updateAIPanel(findingId) {
  if (!findingId) return;

  enableAI(); // idempotent, safe to call every time
  renderExplanation(findingId);
  renderCitations(findingId);
}

/* ---------- FINDING SELECTION (CANONICAL) ---------- */
findingItems.forEach(item => {
  item.addEventListener("click", () => {
    const id = item.dataset.findingId || item.textContent.trim();

    /* Always update state */
    activeFindingId = id;

    /* Update visual selection */
    findingItems.forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    /* ALWAYS re-render AI panel */
    updateAIPanel(activeFindingId);
  });
});

/* ---------- AI INVOCATION ---------- */
aiButton?.addEventListener("click", async () => {
  if (!activeFindingId) return;

  aiButton.disabled = true;
  if (aiStateText) aiStateText.textContent = "Analyzing…";

  try {
    const response = await askSTCAI(
      `Explain why this identity is reachable: ${activeFindingId}`
    );
    renderAIResponse(response);
  } catch (err) {
    if (aiStateText) {
      aiStateText.textContent =
        "AI unavailable. Deterministic findings remain valid.";
    }
    aiButton.disabled = false;
  }
});

/* ---------- RENDER EXPLANATION ---------- */
function renderExplanation(findingId) {
  if (aiExplanation) {
    aiExplanation.textContent =
      "AI explanations are grounded in Shield data only.";
  }
}

/* ---------- RENDER CITATIONS ---------- */
function renderCitations(findingId) {
  if (!aiCitations) return;
  aiCitations.innerHTML = "<li>No datasets referenced.</li>";
}

/* ---------- RENDER RESPONSE ---------- */
function renderAIResponse(payload) {
  const { explanation, citations } = payload || {};

  if (aiExplanation) {
    aiExplanation.textContent =
      explanation || "No explanation returned.";
  }

  if (!aiCitations) return;

  aiCitations.innerHTML = "";

  if (!citations || citations.length === 0) {
    aiCitations.innerHTML = "<li>No datasets referenced.</li>";
  } else {
    citations.forEach(c => {
      const li = document.createElement("li");
      li.textContent =
        `${c.dataset}` +
        `${c.authority ? " · " + c.authority : ""}` +
        `${c.last_sync ? " · last_sync=" + c.last_sync : ""}`;
      aiCitations.appendChild(li);
    });
  }

  if (aiStateText) {
    aiStateText.textContent =
      "AI explanation generated from Shield data.";
  }
}

/* ---------- TOOLTIP WIRING (UNCHANGED) ---------- */
(function () {
  // Tooltip JS intentionally unchanged
})();
