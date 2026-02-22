/* ============================================================
   STC Shield — Console Data Layer (Authoritative)
   PURPOSE:
   - Fetch /shield/findings from stc-intelligence-core (Fly)
   - Render findings list
   - Update detail panel
   - Emit deterministic selection event for AI layer
   ============================================================ */

(function () {
  const API_ENDPOINT = "https://stc-intelligence-core.fly.dev/shield/findings";

  const listEl = document.getElementById("findings-list");
  const countEl = document.getElementById("findings-count");

  const titleEl = document.getElementById("finding-title");
  const summaryEl = document.getElementById("finding-summary");
  const attackEl = document.getElementById("finding-attackpath");
  const labLinkEl = document.getElementById("finding-lab-link");

  if (!listEl) {
    console.error("[console-data] Missing #findings-list");
    return;
  }

  let findings = [];
  let activeIndex = -1;

  function safeId(input) {
    return String(input || "unknown").replace(/[^a-zA-Z0-9\-_:.]/g, "-");
  }

  function severityClass(sev) {
    const s = String(sev || "UNKNOWN").toUpperCase();
    if (s === "LOW") return "sev-LOW";
    if (s === "MEDIUM") return "sev-MEDIUM";
    if (s === "HIGH") return "sev-HIGH";
    if (s === "CRITICAL") return "sev-CRITICAL";
    return "sev-MEDIUM";
  }

  function renderLoading() {
    listEl.innerHTML = `<div class="loading">Loading findings…</div>`;
    if (countEl) countEl.textContent = "—";
  }

  function renderError(message) {
    listEl.innerHTML = `<div class="error">Error loading findings: ${message}</div>`;
    if (countEl) countEl.textContent = "0";
  }

  function renderList() {
    if (!Array.isArray(findings) || findings.length === 0) {
      listEl.innerHTML = `<div class="loading">No findings available.</div>`;
      if (countEl) countEl.textContent = "0";
      return;
    }

    if (countEl) countEl.textContent = String(findings.length);

    listEl.innerHTML = findings.map((f, idx) => {
      const fid = safeId(f.finding_id || f.id || `finding-${idx}`);
      const sev = String(f.severity || "MEDIUM").toUpperCase();
      const title = String(f.title || "Untitled finding");
      const risk = String(f.risk_summary || f.summary || "");

      return `
        <div class="finding-item"
             id="finding-${fid}"
             data-index="${idx}"
             data-finding-id="${fid}"
             role="option"
             tabindex="-1"
             aria-selected="false">
          <div>
            <span class="severity-pill ${severityClass(sev)}">${sev}</span>
            <strong>${escapeHtml(title)}</strong>
          </div>
          <div class="muted" style="margin-top:6px;">${escapeHtml(risk)}</div>
        </div>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function updateDetail(finding) {
    if (!finding) return;

    const sev = String(finding.severity || "MEDIUM").toUpperCase();
    const title = String(finding.title || "Finding");
    const risk = String(finding.risk_summary || finding.summary || "—");

    titleEl.textContent = `${sev.toLowerCase()} — ${title}`;
    summaryEl.textContent = risk;

    // Attack path (best-effort display without guessing shape)
    const ap = finding.attack_path;
    if (ap && typeof ap === "object") {
      const nodes = Array.isArray(ap.nodes) ? ap.nodes.map(n => n.id || n).filter(Boolean) : [];
      attackEl.textContent = nodes.length ? nodes.join(" → ") : "—";
    } else {
      attackEl.textContent = "—";
    }

    // Lab anchor: ONLY if explicitly present (no guessing)
    const labUrl = (typeof finding.lab_url === "string" && finding.lab_url.startsWith("https://"))
      ? finding.lab_url
      : null;

    if (labUrl) {
      labLinkEl.href = labUrl;
      labLinkEl.style.display = "inline-block";
    } else {
      labLinkEl.href = "#";
      labLinkEl.style.display = "none";
    }
  }

  function setActive(index, opts = {}) {
    const { focus = true } = opts;
    const items = listEl.querySelectorAll(".finding-item");
    if (!items || items.length === 0) return;

    const clamped = Math.max(0, Math.min(index, items.length - 1));
    activeIndex = clamped;

    items.forEach((el) => {
      el.classList.remove("selected");
      el.setAttribute("aria-selected", "false");
      el.setAttribute("tabindex", "-1");
    });

    const active = items[clamped];
    active.classList.add("selected");
    active.setAttribute("aria-selected", "true");
    active.setAttribute("tabindex", "0");
    if (focus) active.focus();

    // listbox activedescendant
    const listbox = document.querySelector(".console-findings");
    if (listbox && active.id) {
      listbox.setAttribute("aria-activedescendant", active.id);
    }

    const selectedFinding = findings[clamped];
    updateDetail(selectedFinding);

    // Emit governed event for AI layer
    document.dispatchEvent(new CustomEvent("stc:shield:finding:selected", {
      detail: { finding: selectedFinding }
    }));
  }

  function bindInteractions() {
    listEl.addEventListener("click", (e) => {
      const item = e.target.closest(".finding-item");
      if (!item) return;
      const idx = Number(item.getAttribute("data-index"));
      if (Number.isFinite(idx)) setActive(idx);
    });

    listEl.addEventListener("keydown", (e) => {
      const items = listEl.querySelectorAll(".finding-item");
      if (!items || items.length === 0) return;

      if (activeIndex < 0) activeIndex = 0;

      let next = null;
      switch (e.key) {
        case "ArrowDown": next = activeIndex + 1; break;
        case "ArrowUp": next = activeIndex - 1; break;
        case "Home": next = 0; break;
        case "End": next = items.length - 1; break;
        case "Enter":
        case " ":
          e.preventDefault();
          setActive(activeIndex);
          return;
        default:
          return;
      }

      e.preventDefault();
      next = (next + items.length) % items.length;
      setActive(next);
    });
  }

  async function loadFindings() {
    renderLoading();

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "GET",
        mode: "cors",
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const arr = Array.isArray(data.findings) ? data.findings : [];

      findings = arr;
      renderList();

      // Make list interactive
      bindInteractions();

      // Auto-select first finding for demo clarity (deterministic)
      if (findings.length > 0) {
        setActive(0, { focus: false });
      }

    } catch (err) {
      console.error("[console-data] loadFindings failed:", err);
      renderError(err?.message || "Unknown error");
    }
  }

  // Boot
  loadFindings();
})();
