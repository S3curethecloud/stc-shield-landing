// ============================================================
// STC ENFORCEMENT GRAPH RENDERER
// Owns SVG construction + animation.
// No API calls.
// ============================================================

const STC_GRAPH = (() => {

  let container;
  let stateCache = null;

  function init(containerId) {
    container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="panel">
        <div class="panel__head">
          <div>
            <div class="panel__title">Live Enforcement Graph</div>
            <div class="panel__subtitle">
              controlplane.v1.1 — deterministic traversal
            </div>
          </div>
          <div class="status" id="runtime-badge">
            <div class="dot dot--idle"></div>
            <div class="status__text">Connecting</div>
          </div>
        </div>
        <div style="padding:16px">
          <svg id="stc-graph-svg" viewBox="0 0 800 400" width="100%" height="340"></svg>
        </div>
      </div>
    `;

    buildStaticGraph();
  }

  function buildStaticGraph() {
    const svg = document.getElementById("stc-graph-svg");
    if (!svg) return;

    const nodes = [
      ["operational_policy", 40, 40],
      ["financial_threshold", 280, 40],
      ["continuous_access_enforcement", 520, 40],
      ["token_introspection", 160, 180],
      ["token_revocation_registry", 440, 180],
      ["session_invalidation_boundary", 300, 300],
      ["blast_radius_model", 40, 320],
      ["compliance_surface", 600, 320]
    ];

    nodes.forEach(([id, x, y]) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("id", id);

      const rect = document.createElementNS(svg.namespaceURI, "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", 220);
      rect.setAttribute("height", 40);
      rect.setAttribute("rx", 8);
      rect.setAttribute("fill", "rgba(14,20,27,.6)");
      rect.setAttribute("stroke", "rgba(201,162,39,.35)");

      const text = document.createElementNS(svg.namespaceURI, "text");
      text.setAttribute("x", x + 110);
      text.setAttribute("y", y + 25);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#E9EEF6");
      text.setAttribute("font-size", "12");
      text.textContent = id;

      g.appendChild(rect);
      g.appendChild(text);
      svg.appendChild(g);
    });
  }

  function update(state) {
    if (!state) return;
    stateCache = state;

    const badge = document.getElementById("runtime-badge");
    if (!badge) return;

    const dot = badge.querySelector(".dot");
    const text = badge.querySelector(".status__text");

    if (state.runtime_status === "ok" || state.runtime_status === "healthy") {
      dot.className = "dot dot--ok";
      text.textContent = "LIVE";
    } else {
      dot.className = "dot dot--err";
      text.textContent = "DEGRADED";
    }

    highlightCritical(state);
  }

  function highlightCritical(state) {
    const svg = document.getElementById("stc-graph-svg");
    if (!svg) return;

    const critical = state.risk_score >= 90;

    ["continuous_access_enforcement",
     "token_revocation_registry",
     "session_invalidation_boundary"]
      .forEach(id => {
        const node = document.getElementById(id);
        if (!node) return;

        const rect = node.querySelector("rect");
        if (critical) {
          rect.setAttribute("stroke", "#E84545");
          rect.setAttribute("stroke-width", "2");
        } else {
          rect.setAttribute("stroke", "rgba(201,162,39,.35)");
          rect.setAttribute("stroke-width", "1");
        }
      });
  }

  return {
    init,
    update
  };

})();
