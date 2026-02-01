/* ================================
   STC SHIELD — AI PANEL LOGIC v1.1
   Read-only • Operator-trust-first
   ================================ */

/* ---------- GLOBAL STATE ---------- */
const state = {
  selectedFinding: null,
};

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

/* ---------- RESET AI STATE ---------- */
function resetAI() {
  state.selectedFinding = null;

  aiPanel?.classList.remove("active");
  if (aiButton) aiButton.disabled = true;

  if (aiStateText) {
    aiStateText.textContent =
      "Select a finding to enable AI explanations.";
  }

  if (aiExplanation) {
    aiExplanation.textContent =
      "AI explanations are grounded in Shield data only.";
  }

  if (aiCitations) {
    aiCitations.innerHTML = "<li>No datasets referenced.</li>";
  }
}

/* ---------- ENABLE AI (EXPLICIT USER ACTION ONLY) ---------- */
function enableAI(findingText) {
  state.selectedFinding = findingText;

  aiPanel?.classList.add("active");
  if (aiButton) aiButton.disabled = false;

  if (aiStateText) {
    aiStateText.textContent =
      "AI ready. Explanation will reference Shield data only.";
  }
}

/* ---------- FINDING SELECTION ---------- */
findingItems.forEach(item => {
  item.addEventListener("click", () => {
    findingItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    const title =
      item.querySelector("strong")?.textContent ||
      "Selected finding";

    enableAI(title);
  });
});

/* ---------- AI INVOCATION ---------- */
aiButton?.addEventListener("click", async () => {
  if (!state.selectedFinding) return;

  aiButton.disabled = true;
  if (aiStateText) aiStateText.textContent = "Analyzing…";

  try {
    const response = await askSTCAI(
      `Explain why this identity is reachable: ${state.selectedFinding}`
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
  // Tooltip JS unchanged and intentionally omitted
})();
