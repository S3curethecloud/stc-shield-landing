/* ============================================================
   STC Shield — Console Data Layer (Authoritative)
   Purpose:
   - Fetch deterministic findings from backend
   - Render .finding-item elements
   - Do NOT handle interaction (console-ai.js does that)
   ============================================================ */

(function () {

  const API_ENDPOINT = "https://stc-intelligence-core.fly.dev/shield/findings";

  const container = document.querySelector(".console-findings");

  if (!container) return;

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function renderFindings(findings) {

    if (!Array.isArray(findings) || findings.length === 0) {
      container.innerHTML = `
        <div class="finding-item">
          <strong>No findings available</strong>
        </div>
      `;
      return;
    }

    container.innerHTML = findings.map((f, index) => {

      const severity = escapeHtml(f.severity || "UNKNOWN");
      const title = escapeHtml(f.title || "Untitled");
      const summary = escapeHtml(f.risk_summary || "");
      const id = escapeHtml(f.finding_id || `finding-${index}`);

      return `
        <div 
          class="finding-item"
          id="finding-${id}"
          data-finding-id="${id}"
        >
          <div class="severity">${severity}</div>
          <strong>${title}</strong>
          <div class="summary">${summary}</div>
        </div>
      `;
    }).join("");

  }

  async function loadFindings() {

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch findings");
      }

      const data = await response.json();
      renderFindings(data.findings || []);

    } catch (error) {
      console.error("Shield findings load error:", error);
      container.innerHTML = `
        <div class="finding-item">
          <strong>Error loading findings</strong>
        </div>
      `;
    }

  }

  loadFindings();

})();
