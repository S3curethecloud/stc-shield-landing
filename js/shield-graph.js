/* ============================================================
   STC Shield — Attack Path Graph (Deterministic, Read-only)
   Renders only w:contentReference[oaicite:20]{index=20}_path:
     - nodes: [{id,type}]
     - edges: [{from,to,action}]
   NO inference. NO extra joins. NO random layout.
   ============================================================ */

(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  function isObj(x) { return x && typeof x === "object"; }

  function normalizeAttackPath(ap) {
    const out = { nodes: [], edges: [] };

    if (!isObj(ap)) return out;

    const rawNodes = Array.isArray(ap.nodes) ? ap.nodes : [];
    const rawEdges = Array.isArray(ap.edges) ? ap.edges : [];

    // Nodes: accept {id,type} OR string ids (but do not invent types)
    out.nodes = rawNodes
      .map(n => {
        if (typeof n === "string") return { id: n, type: null };
        if (isObj(n) && n.id) return { id: String(n.id), type: n.type ? String(n.type) : null };
        return null;
      })
      .filter(Boolean);

    // Edges: accept {from,to,action}
    out.edges = rawEdges
      .map(e => {
        if (!isObj(e)) return null;
        const from = e.from ? String(e.from) : null;
        const to = e.to ? String(e.to) : null;
        if (!from || !to) return null;
        return { from, to, action: e.action ? String(e.action) : "" };
      })
      .filter(Boolean);

    return out;
  }

  function buildIndex(nodes) {
    const map = new Map();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }

  // Deterministic layout:
  // - compute "depth" by longest-path style relaxation (DAG-friendly)
  // - stable fallback: nodes array order if depth cannot advance
  function computeDepths(nodes, edges) {
    const depths = new Map(nodes.map(n => [n.id, 0]));
    const indeg = new Map(nodes.map(n => [n.id, 0]));
    edges.forEach(e => indeg.set(e.to, (indeg.get(e.to) || 0) + 1));

    // Kahn queue: stable ordering by node id
    const queue = nodes
      .filter(n => (indeg.get(n.id) || 0) === 0)
      .map(n => n.id)
      .sort((a,b) => a.localeCompare(b));

    const adj = new Map(nodes.map(n => [n.id, []]));
    edges.forEach(e => {
      if (!adj.has(e.from)) adj.set(e.from, []);
      adj.get(e.from).push(e.to);
    });

    while (queue.length) {
      const u = queue.shift();
      const next = adj.get(u) || [];
      next.forEach(v => {
        const cand = (depths.get(u) || 0) + 1;
        if (cand > (depths.get(v) || 0)) depths.set(v, cand);
        indeg.set(v, (indeg.get(v) || 0) - 1);
        if ((indeg.get(v) || 0) === 0) queue.push(v);
      });
      queue.sort((a,b) => a.localeCompare(b)); // keep deterministic
    }

    return depths;
  }

  function el(name, attrs = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
    return node;
  }

  function clear(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  function makeButtonHandlers(container, api) {
    const zoomIn = document.getElementById("graph-zoom-in");
    const zoomOut = document.getElementById("graph-zoom-out");
    const reset = document.getElementById("graph-reset");
    const fs = document.getElementById("graph-fullscreen");

    if (zoomIn) zoomIn.onclick = () => api.zoomBy(1.15);
    if (zoomOut) zoomOut.onclick = () => api.zoomBy(1 / 1.15);
    if (reset) reset.onclick = () => api.resetView();
    if (fs) fs.onclick = () => api.fullscreen(container);
  }

  function render(container, attackPath, opts = {}) {
    const { severity, findingId, onInspect } = opts;

    const ap = normalizeAttackPath(attackPath);
    clear(container);

    if (!ap.nodes.length) {
      container.innerHTML = `<div class="muted" style="padding:14px;">No attack_path nodes to render.</div>`;
      if (typeof onInspect === "function") onInspect("No attack_path nodes to render.");
      return;
    }

    const nodeIndex = buildIndex(ap.nodes);
    const depths = computeDepths(ap.nodes, ap.edges);

    const layers = new Map(); // depth -> [nodeId]
    ap.nodes.forEach(n => {
      const d = depths.get(n.id) || 0;
      if (!layers.has(d)) layers.set(d, []);
      layers.get(d).push(n.id);
    });

    // Deterministic ordering inside each layer
    Array.from(layers.keys()).forEach(d => layers.get(d).sort((a,b) => a.localeCompare(b)));

    const maxDepth = Math.max(...Array.from(layers.keys()));
    const maxLayerSize = Math.max(...Array.from(layers.values()).map(a => a.length));

    // Geometry (deterministic constants)
    const PAD = 24;
    const X_STEP = 220;
    const Y_STEP = 90;
    const NODE_W = 180;
    const NODE_H = 52;

    const width = PAD * 2 + (maxDepth + 1) * X_STEP;
    const height = PAD * 2 + Math.max(1, maxLayerSize) * Y_STEP;

    const svg = el("svg", {
      width: "100%",
      height: "100%",
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-label": "Attack path map"
    });

    // Background
    svg.appendChild(el("rect", { x: 0, y: 0, width, height, fill: "transparent" }));

    // Arrow marker
    const defs = el("defs");
    const marker = el("marker", {
      id: "arrow",
      markerWidth: 10,
      markerHeight: 10,
      refX: 9,
      refY: 3,
      orient: "auto",
      markerUnits: "strokeWidth"
    });
    marker.appendChild(el("path", { d: "M0,0 L10,3 L0,6 Z", fill: "currentColor" }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Pan/zoom group
    const g = el("g", { id: "viewport" });
    svg.appendChild(g);

    // Compute positions
    const pos = new Map(); // nodeId -> {x,y}
    layers.forEach((ids, d) => {
      const layerH = ids.length * Y_STEP;
      const yStart = PAD + (height - PAD * 2 - layerH) / 2;
      ids.forEach((id, i) => {
        const x = PAD + d * X_STEP;
        const y = yStart + i * Y_STEP;
        pos.set(id, { x, y });
      });
    });

    // Edge rendering
    const edgeEls = [];
    ap.edges.forEach((e) => {
      const a = pos.get(e.from);
      const b = pos.get(e.to);
      if (!a || !b) return;

      const x1 = a.x + NODE_W;
      const y1 = a.y + NODE_H / 2;
      const x2 = b.x;
      const y2 = b.y + NODE_H / 2;

      const cx = (x1 + x2) / 2;

      const path = el("path", {
        d: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
        fill: "none",
        stroke: "currentColor",
        "stroke-width": 2,
        "marker-end": "url(#arrow)",
        "data-edge": `${e.from}→${e.to}`
      });

      const label = el("text", {
        x: cx,
        y: (y1 + y2) / 2 - 6,
        "text-anchor": "middle",
        "font-size": 12,
        fill: "currentColor",
        opacity: 0.85
      });
      label.textContent = e.action || "";

      const hit = el("path", {
        d: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
        fill: "none",
        stroke: "transparent",
        "stroke-width": 14,
        "data-edge-hit": `${e.from}→${e.to}`
      });

      edgeEls.push({ path, label, hit, meta: e });
      g.appendChild(path);
      g.appendChild(label);
      g.appendChild(hit);
    });

    // Node rendering
    const nodeEls = new Map();
    ap.nodes.forEach((n) => {
      const p = pos.get(n.id);
      if (!p) return;

      const group = el("g", { "data-node": n.id, tabindex: 0 });

      const rect = el("rect", {
        x: p.x,
        y: p.y,
        width: NODE_W,
        height: NODE_H,
        rx: 12,
        fill: "rgba(255,255,255,0.03)",
        stroke: "currentColor",
        "stroke-width": 2
      });

      const t1 = el("text", {
        x: p.x + 12,
        y: p.y + 22,
        "font-size": 14,
        fill: "currentColor"
      });
      t1.textContent = n.id;

      const t2 = el("text", {
        x: p.x + 12,
        y: p.y + 42,
        "font-size": 12,
        fill: "currentColor",
        opacity: 0.75
      });
      t2.textContent = n.type ? n.type : "—";

      group.appendChild(rect);
      group.appendChild(t1);
      group.appendChild(t2);

      g.appendChild(group);
      nodeEls.set(n.id, { group, rect, node: n });
    });

    // Deterministic "selected" state
    let selectedNode = null;
    let selectedEdge = null;

    function inspect(msg) {
      if (typeof onInspect === "function") onInspect(msg);
    }

    function clearSelection() {
      selectedNode = null;
      selectedEdge = null;
      nodeEls.forEach(({ rect }) => rect.setAttribute("stroke-width", "2"));
      edgeEls.forEach(({ path }) => path.setAttribute("stroke-width", "2"));
    }

    nodeEls.forEach(({ group, rect, node }) => {
      group.addEventListener("click", () => {
        clearSelection();
        selectedNode = node.id;
        rect.setAttribute("stroke-width", "4");
        inspect(`Node: ${node.id}${node.type ? ` (${node.type})` : ""}${findingId ? ` • Finding: ${findingId}` : ""}`);
      });
      group.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          group.click();
        }
      });
    });

    edgeEls.forEach(({ hit, path, meta }) => {
      hit.addEventListener("click", () => {
        clearSelection();
        selectedEdge = `${meta.from}→${meta.to}`;
        path.setAttribute("stroke-width", "4");
        inspect(`Edge: ${meta.from} → ${meta.to}${meta.action ? ` • action: ${meta.action}` : ""}${findingId ? ` • Finding: ${findingId}` : ""}`);
      });
    });

    // Pan/zoom
    let scale = 1;
    let tx = 0;
    let ty = 0;
    let dragging = false;
    let last = null;

    function applyTransform() {
      g.setAttribute("transform", `translate(${tx},${ty}) scale(${scale})`);
    }
    applyTransform();

    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 / 1.08 : 1.08;
      scale = Math.max(0.3, Math.min(3, scale * dir));
      applyTransform();
    }, { passive: false });

    svg.addEventListener("mousedown", (e) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging || !last) return;
      tx += (e.clientX - last.x);
      ty += (e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      applyTransform();
    });
    window.addEventListener("mouseup", () => {
      dragging = false;
      last = null;
    });

    const api = {
      zoomBy(f) {
        scale = Math.max(0.3, Math.min(3, scale * f));
        applyTransform();
      },
      resetView() {
        scale = 1; tx = 0; ty = 0;
        applyTransform();
        clearSelection();
        inspect("View reset.");
      },
      fullscreen(host) {
        const el = host;
        if (el && el.requestFullscreen) el.requestFullscreen();
      }
    };

    makeButtonHandlers(container, api);

    // Severity styling: do NOT invent semantics—only set a class hook.
    // Your global CSS can color .sev-HIGH etc consistently with the rest of Shield.
    if (severity) {
      container.setAttribute("data-severity", String(severity).toUpperCase());
    }

    container.appendChild(svg);

    inspect("Rendered attack_path graph (read-only).");
  }

  window.STCShieldGraph = { render };
})();
