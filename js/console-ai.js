/* ================================
   STC SHIELD — AI DRAWER LOGIC v1.0
   Read-only, state-driven, safe
   ================================ */

const state = {
  selectedFinding: null,
};

/* DOM references */
const findingItems = document.querySelectorAll(".finding-item");
const aiPanel = document.querySelector(".ai-panel");
const aiButton = aiPanel.querySelector("button");
const aiStateText = aiPanel.querySelector(".ai-state");
const aiExplanation = aiPanel.querySelector(".ai-output p");
const aiCitations = aiPanel.querySelector(".citations");

/* ---------- STATE TRANSITIONS ---------- */

function resetAI() {
  aiPanel.classList.add("collapsed");
  aiButton.disabled = true;
  aiStateText.textContent =
    "Select a finding to enable AI explanations.";

  aiExplanation.textContent =
    "AI explanations are grounded in Shield data only.";

  aiCitations.innerHTML = "<li>No datasets referenced.</li>";
}

function enableAI(findingText) {
  state.selectedFinding = findingText;

  aiPanel.classList.remove("collapsed");
  aiButton.disabled = false;
  aiStateText.textContent =
    "AI ready. Explanation will reference Shield data only.";
}

/* ---------- FINDING SELECTION ---------- */

findingItems.forEach(item => {
  item.addEventListener("click", () => {
    findingItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");

    const title =
      item.querySelector("strong")?.textContent || "Selected finding";

    enableAI(title);
  });
});

/* ---------- AI INVOCATION ---------- */

aiButton.addEventListener("click", async () => {
  if (!state.selectedFinding) return;

  aiButton.disabled = true;
  aiStateText.textContent = "Analyzing…";

  try {
    const response = await askSTCAI(
      `Explain why this identity is reachable: ${state.selectedFinding}`
    );

    renderAIResponse(response);
  } catch (err) {
    aiStateText.textContent =
      "AI unavailable. Deterministic findings remain valid.";
    aiButton.disabled = false;
  }
});

/* ---------- RENDER RESPONSE ---------- */

function renderAIResponse(payload) {
  const { explanation, citations } = payload;

  aiExplanation.textContent =
    explanation || "No explanation returned.";

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

  aiStateText.textContent =
    "AI explanation generated from Shield data.";
}

/* ============================================================
   STC Shield — Tooltip Wiring (No Libraries)
   ============================================================ */
(function () {
  // … tooltip JS exactly as provided …
})();
