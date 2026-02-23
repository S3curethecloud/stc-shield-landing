/*
  STC PLATFORM HOME - Live Preview
  GOVERNANCE:
  - Read-only: fetch() only
  - Deterministic counters derived from incidents[].severity
  - No writes to backend, no remediation calls
*/

(function () {
  "use strict";

  const FEED_URL = "https://stc-intelligence-core.fly.dev/shield/feed";
  const REFRESH_MS = 30000; // 30s, light interactive

  const els = {
    status: document.getElementById("stc-status"),
    statusText: null,
    statusDot: null,

    critical: document.getElementById("critical-count"),
    high: document.getElementById("high-count"),
    medium: document.getElementById("medium-count"),
    low: document.getElementById("low-count"),

    lastUpdated: document.getElementById("stc-last-updated"),
    feedCount: document.getElementById("stc-feed-count"),
    year: document.getElementById("stc-year"),

    canvas: document.getElementById("riskPulse")
  };

  function initStatusRefs() {
    if (!els.status) return;
    els.statusDot = els.status.querySelector(".dot");
    els.statusText = els.status.querySelector(".status__text");
  }

  function setStatus(state, label) {
    if (!els.statusDot || !els.statusText) return;
    els.statusDot.classList.remove("dot--idle", "dot--ok", "dot--err");
    els.statusDot.classList.add(state === "ok" ? "dot--ok" : state === "err" ? "dot--err" : "dot--idle");
    els.statusText.textContent = label;
  }

  function nowStamp() {
    const d = new Date();
    // keep it readable and deterministic
    return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function safeArray(x) {
    return Array.isArray(x) ? x : [];
  }

  function deriveCounts(incidents) {
    // Deterministic derivation based solely on severity field.
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

    for (const i of incidents) {
      const sev = (i && typeof i.severity === "string") ? i.severity.toUpperCase() : "";
      if (sev in counts) counts[sev] += 1;
    }
    return counts;
  }

  function renderCounts(counts) {
    els.critical.textContent = String(counts.CRITICAL);
    els.high.textContent = String(counts.HIGH);
    els.medium.textContent = String(counts.MEDIUM);
    els.low.textContent = String(counts.LOW);
  }

  // ---- Risk pulse (subtle animated line) ----
  const pulse = {
    ctx: null,
    w: 0,
    h: 0,
    t: 0,
    baseline: 0.55,
    intensity: 0.12,
    points: [],
    maxPoints: 110,
    incidentVolume: 0
  };

  function initPulse() {
    if (!els.canvas) return;
    pulse.ctx = els.canvas.getContext("2d");
    pulse.w = els.canvas.width;
    pulse.h = els.canvas.height;
    pulse.points = [];
    for (let i = 0; i < pulse.maxPoints; i++) pulse.points.push(pulse.baseline);
    requestAnimationFrame(tickPulse);
  }

  function setPulseVolume(n) {
    // Tie intensity to volume but clamp for subtlety.
    pulse.incidentVolume = Math.max(0, Number.isFinite(n) ? n : 0);
    const capped = Math.min(10, pulse.incidentVolume); // keep subtle
    pulse.intensity = 0.10 + (capped * 0.012); // 0.10..0.22
  }

  function tickPulse() {
    if (!pulse.ctx) return;

    pulse.t += 0.06;

    // shift left
    pulse.points.shift();

    // generate next point: baseline + sin + noise
    const sin = Math.sin(pulse.t) * pulse.intensity;
    const noise = (Math.random() - 0.5) * (pulse.intensity * 0.35);
    const next = pulse.baseline + sin + noise;

    // clamp between 0.15..0.95
    pulse.points.push(Math.max(0.15, Math.min(0.95, next)));

    drawPulse();
    requestAnimationFrame(tickPulse);
  }

  function drawPulse() {
    const ctx = pulse.ctx;
    const w = pulse.w;
    const h = pulse.h;

    ctx.clearRect(0, 0, w, h);

    // background sweep (very faint)
    ctx.fillStyle = "rgba(0,0,0,0.0)";
    ctx.fillRect(0, 0, w, h);

    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    for (let y = 40; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // pulse line (gold)
    ctx.strokeStyle = "rgba(201,162,39,0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < pulse.points.length; i++) {
      const x = (i / (pulse.points.length - 1)) * w;
      const y = (1 - pulse.points[i]) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // glow (subtle)
    ctx.strokeStyle = "rgba(227,195,90,0.20)";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  // ---- Fetch + render ----
  async function loadFeed() {
    setStatus("idle", "Loading");
    try {
      const res = await fetch(FEED_URL, { method: "GET" });

      if (!res.ok) {
        setStatus("err", `HTTP ${res.status}`);
        return;
      }

      const data = await res.json();
      const incidents = safeArray(data && data.incidents);

      const counts = deriveCounts(incidents);

      renderCounts(counts);

      const total = incidents.length;
      if (els.feedCount) els.feedCount.textContent = `incidents: ${total}`;
      if (els.lastUpdated) els.lastUpdated.textContent = nowStamp();

      setPulseVolume(total);

      setStatus("ok", "Live");
    } catch (e) {
      console.error("STC feed error:", e);
      setStatus("err", "Offline");
    }
  }

  function initYear() {
    if (els.year) els.year.textContent = String(new Date().getFullYear());
  }

  // Boot
  function boot() {
    initStatusRefs();
    initYear();
    initPulse();
    loadFeed();
    setInterval(loadFeed, REFRESH_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
