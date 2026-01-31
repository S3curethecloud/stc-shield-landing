// js/ai.js

async function askSTCAI(question) {
  // --- CRITICAL GUARD (AUTHORITATIVE) ---
  if (!window.STC_CONFIG || !window.STC_CONFIG.AI_API_BASE) {
    throw new Error("STC_CONFIG.AI_API_BASE is not defined");
  }

  const base = window.STC_CONFIG.AI_API_BASE;

  const res = await fetch(`${base}/ask/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`STC AI error ${res.status}: ${text}`);
  }

  return res.json();
}

function renderAnswer(payload) {
  const { question, result, explanation, citations } = payload;

  document.querySelector("#ai-question").textContent =
    question || "";

  document.querySelector("#ai-explanation").textContent =
    explanation || "";

  document.querySelector("#ai-result").textContent =
    JSON.stringify(result, null, 2);

  const citeEl = document.querySelector("#ai-citations");
  citeEl.innerHTML = "";

  if (!citations || citations.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No datasets referenced.";
    citeEl.appendChild(li);
    return;
  }

  citations.forEach(c => {
    const li = document.createElement("li");
    li.textContent =
      `${c.dataset}` +
      `${c.authority ? " · " + c.authority : ""}` +
      `${c.last_sync ? " · last_sync=" + c.last_sync : ""}`;
    citeEl.appendChild(li);
  });
}
