// =========================================================
// FILE: website/copilot/shield-ui.js
// PURPOSE: Shield UI Renderer (GSI-backed incidents)
// GOVERNANCE: MGF-AUTHORITY-ALL
//
// STATUS:
//   Modular renderer
//   No business logic
//   No scoring logic
//   GSI-backed fetch
//   Severity class-based styling
//   DOM-safe
// =========================================================


// ---------------------------------------------------------
// FETCH LAYER
// ---------------------------------------------------------

async function fetchLatestCritical() {
  try {
    const res = await fetch(
      "https://stc-intelligence-core.fly.dev/shield/incidents?severity=CRITICAL"
    );

    const data = await res.json();

    if (data.status !== "ok" || !data.incidents || data.incidents.length === 0) {
      return null;
    }

    return data.incidents[0]; // newest first

  } catch (e) {
    console.warn("[Shield UI] Fetch failed:", e);
    return null;
  }
}


// ---------------------------------------------------------
// RENDER RISK SCORE
// ---------------------------------------------------------

function renderRiskScore(incident) {
  const scoreEl = document.getElementById("shield-risk-score");
  if (!scoreEl) return;

  if (!incident) {
    scoreEl.innerText = "Risk Score: —";
    scoreEl.className = "risk-badge";
    return;
  }

  const score = incident?.riskdna?.risk_score ?? 0;
  const severity = incident?.severity ?? "LOW";

  scoreEl.innerText = `Risk Score: ${score} (${severity})`;
  scoreEl.className = "risk-badge " + severity.toLowerCase();
}


// ---------------------------------------------------------
// RENDER DRIVERS
// ---------------------------------------------------------

function renderDrivers(incident) {
  const list = document.getElementById("shield-drivers");
  if (!list) return;

  list.innerHTML = "";

  const drivers = incident?.riskdna?.drivers ?? [];

  drivers.forEach(driver => {
    const li = document.createElement("li");
    li.textContent = driver;
    list.appendChild(li);
  });
}


// ---------------------------------------------------------
// RENDER RECOMMENDED ACTIONS
// ---------------------------------------------------------

function renderActions(incident) {
  const list = document.getElementById("shield-actions");
  if (!list) return;

  list.innerHTML = "";

  const actions = incident?.recommended_actions ?? [];

  actions.forEach(action => {
    const li = document.createElement("li");
    li.textContent = action;
    list.appendChild(li);
  });
}


// ---------------------------------------------------------
// RENDER "WHY THIS SCORE" PANEL
// ---------------------------------------------------------

function wireWhyButton(incident) {
  const whyBtn = document.getElementById("shield-why-button");
  const panel = document.getElementById("shield-why-panel");

  if (!whyBtn || !panel) return;

  whyBtn.onclick = () => {
    if (!incident) return;

    panel.innerHTML = "";

    const drivers = incident?.riskdna?.drivers ?? [];

    drivers.forEach(driver => {
      const p = document.createElement("p");
      p.textContent = driver;
      panel.appendChild(p);
    });

    panel.style.display = "block";
  };
}


// ---------------------------------------------------------
// INITIALIZE SHIELD PANEL
// ---------------------------------------------------------

async function renderShieldPanel() {
  const incident = await fetchLatestCritical();

  renderRiskScore(incident);
  renderDrivers(incident);
  renderActions(incident);
  wireWhyButton(incident);
}


// ---------------------------------------------------------
// AUTO-INIT (DOM-SAFE)
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderShieldPanel();
});

<script src="/assets/js/shield-ui.js"></script>
