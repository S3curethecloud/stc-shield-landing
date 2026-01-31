/* =========================================================
   STC SHIELD — AI DRAWER WIRING (v1.0)
   Contextual • Read-only • Explanation-only
   ========================================================= */

const aiDrawer = document.getElementById("ai-drawer");
const aiInput = document.getElementById("ai-input");
const aiBtn = document.getElementById("ai-btn");
const aiExplanation = document.getElementById("ai-explanation");
const aiCitations = document.getElementById("ai-citations");
const contextValue = document.querySelector(".context-value");

/**
 * Enable AI drawer when a finding/path is selected
 */
function enableAIDrawer(contextLabel) {
  aiInput.disabled = false;
  aiBtn.disabled = false;
  aiDrawer.classList.remove("disabled");

  contextValue.textContent = contextLabel || "Selected finding";

  aiExplanation.textContent =
    "Click “Explain with STC AI” to understand why this path exists.";
}

/**
 * Disable AI drawer (default state)
 */
function disableAIDrawer() {
  aiInput.disabled = true;
  aiBtn.disabled = true;
  aiDrawer.classList.add("disabled");

  contextValue.textContent = "No selection";

  aiExplanation.textContent =
    "Select a finding to enable AI reasoning.";

  aiCitations.innerHTML = "<li>No datasets referenced.</li>";
}

/**
 * Temporary hook: simulate selecting a finding
 * (Will be replaced when real data wiring is added)
 */
document.querySelectorAll(".finding").forEach(item => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".finding")
      .forEach(f => f.classList.remove("active"));

    item.classList.add("active");

    enableAIDrawer(item.textContent.trim());
  });
});

/**
 * AI button click handler
 */
aiBtn.addEventListener("click", async () => {
  const question = aiInput.value.trim();

  if (!question) {
    alert("Please enter a question about the selected finding.");
    return;
  }

  aiExplanation.textContent = "Querying STC AI…";
  aiCitations.innerHTML = "";

  try {
    const res = await fetch("http://127.0.0.1:8000/ask/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const payload = await res.json();

    aiExplanation.textContent =
      payload.explanation || "No explanation returned.";

    if (payload.citations && payload.citations.length > 0) {
      payload.citations.forEach(c => {
        const li = document.createElement("li");
        li.textContent =
          `${c.dataset}` +
          (c.authority ? ` · ${c.authority}` : "") +
          (c.last_sync ? ` · last_sync=${c.last_sync}` : "");
        aiCitations.appendChild(li);
      });
    } else {
      aiCitations.innerHTML = "<li>No datasets referenced.</li>";
    }

  } catch (err) {
    aiExplanation.textContent =
      "AI explanation failed. See console for details.";
    console.error("STC AI error:", err);
  }
});

/* Initialize safe default */
disableAIDrawer();
